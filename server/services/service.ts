import { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import "dotenv/config";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

const model = new ChatGroq({
	model: "llama-3.3-70b-versatile",
	temperature: 0.2,
});

const keywordsSchema = z.object({
	keywords: z
		.array(z.string())
		.describe(
			"The keywords that should be used to search for academic materials that would help answer the question. Each keyword should not be more than 2 words long."
		),
});
const analysisSchema = z.object({
	summary: z
		.string()
		.describe(
			"A paragraph which states your answer to the question, and then explains how it follows from the information given in the provided materials."
		),
	points: z
		.array(z.string())
		.describe(
			"A series of paragraphs describing steps of your thought process. Each paragraph should contain one sentence summarizing the main logical progression of the step, and one or more sentences explaining how the point follows from the information given in the provided materials. "
		),
});

const keywordsLlm = model.withStructuredOutput(keywordsSchema);
const analysisLlm = model.withStructuredOutput(analysisSchema);

export async function fetchSearchKeywords(text: string): Promise<string[]> {
	const res = await keywordsLlm.invoke(text);

	res.keywords = res.keywords.map((keyword: string) =>
		encodeURIComponent(keyword)
	);

	return res.keywords;
}

export async function fetchCrossrefWorks(
	keywords: string[],
	rows: number
): Promise<string[]> {
	const urls = await fetch(
		`https://api.crossref.org/v1/works?query=${keywords.join("+")}&rows=${
			rows * 5
		}&sort=relevance&order=desc&mailto=mrshenyangyi@gmail.com`,
		{
			method: "GET",
			headers: {
				"User-Agent":
					"Mozilla/5.0 (compatible; HmmLetsSee; +http://www.github.com/yangyi-shen/hmm-lets-see)",
			},
		}
	)
		.then((response) => response.json())
		.then((response) => response.message.items)
		.then((items: object[]) => items.map((item: any) => item.URL));

	console.log("URLS: ", urls);

	const works = await Promise.all(
		urls.map(async (url: string) => {
			try {
				const loader = new CheerioWebBaseLoader(url, {
					selector: "p",
				});

				const docs = await Promise.race([
					loader.load(),
					new Promise<null>((resolve) =>
						setTimeout(() => resolve(null), 10000)
					),
				]);

				if (!docs) {
					return null;
				} else {
					const formattedDocument = docs[0].pageContent
						.replace(/[\n\t]/g, " ")
						.replace(/\s{4,}/g, " ");

					return formattedDocument;
				}
			} catch (error) {
				return null;
			}
		})
	);

	const formattedWorks = works
		.filter((work: string | null) => work !== null)
		.filter((work: string) => work.length > 500)
		.filter((work: string) => work.length < 2400)
		.slice(0, rows);

	return formattedWorks;
}

export async function fetchCrossrefWorksAnalysis(
	question: string,
	works: string[]
) {
	const res = await analysisLlm.invoke(`
		I have a question: "${question}". Please analyze the following academic materials (which are in the form of a single string) and come up with an answer to the question based on the data and professional opinions given in them: ${works.join(
		"\n"
	)}.`);

	return res;
}
