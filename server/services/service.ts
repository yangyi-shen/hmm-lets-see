import { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import "dotenv/config";
import axios from "axios";
import * as cheerio from "cheerio";

const model = new ChatGroq({
	model: "llama-3.3-70b-versatile",
	temperature: 0.2,
});

const keywordsSchema = z.object({
	keywords: z
		.array(z.string())
		.describe(
			"The keywords that should be used to search for materials related to the question, each keyword should not be more than 2 words long."
		),
});
const analysisSchema = z.object({
	summary: z
		.string()
		.describe(
			"A one-paragraph long summary of your answer, and how it derives from the provided material."
		),
	points: z
		.array(z.string())
		.describe(
			"The main points of your thought process, each point should be one paragraph long, and explain not only your thoughts but which of the provided materials they were based on."
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
		}&sort=relevance&order=desc&mailto=${process.env.CROSSREF_EMAIL}`,
		{
			method: "GET",
			headers: {
				"User-Agent":
					"Mozilla/5.0 (compatible; HmmLetsSee; +http://www.github.com/yangyi-shen/hmm-lets-see)",
			},
		}
	)
		.then(response => response.json())
		.then(response => response.message.items)
		.then((items: object[]) => items.map((item: any) => item.URL));

	const works = await Promise.all(
		urls.map(async (url: string) => {
			try {
				const html = await axios.get(url).then((res) => res.data);
				const $ = cheerio.load(html);
				let content;

				const main = $("main");
				const mainDiv = $("div#main");
				const article = $("article");
				const body = $("body");

				if (main.length > 0) {
					content = main;
				} else if (mainDiv.length > 0) {
					content = mainDiv;
				} else if (article.length > 0) {
					content = article;
				} else {
					content = body;
				}

				content = content.remove("script").remove("style");
				content = content.text().replace(/<[^>]*>/g, "").replace(/\s{4,}/g, "");
				console.log(content);

				return content;
			} catch (error) {
				return null;
			}
		})
	);

	const formattedWorks = works
		.filter((work: string | null) => work !== null)
		.filter((work: string) => work.length > 0)
		.slice(0, rows);

	return formattedWorks;
}

export async function fetchCrossrefWorksAnalysis(
	question: string,
	works: string[]
) {
	const res = await analysisLlm.invoke(`
		I have a question: "${question}". I have the following materials related to the question: ${works.join(
		"\n"
	)}. Please analyze the material and come up with an answer to the question based on the material, and also tell me how you came up with the answer based on the material. 
		`);

	return res;
}
