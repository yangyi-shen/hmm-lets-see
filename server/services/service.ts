import { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import "dotenv/config";
import axios from "axios";
import * as cheerio from "cheerio";

const model = new ChatGroq({
	model: "llama-3.3-70b-versatile",
	temperature: 0.2,
});

const schema = z.object({
	keywords: z
		.array(z.string())
		.describe(
			"The keywords that should be used to search for materials related to the question, each keyword should not be more than 2 words long."
		),
});

const structuredLlm = model.withStructuredOutput(schema);

export async function fetchSearchKeywords(text: string): Promise<string[]> {
	const res = await structuredLlm.invoke(text);

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
		.then((response) => response.json())
		.then((response) => response.message.items)
		.then((items: object[]) => items.map((item: any) => item.URL));

	const works = await Promise.all(
		urls.map(async (url: string) => {
			try {
				const html = await axios.get(url).then((res) => res.data);
				const $ = cheerio.load(html);

				$("body script, body style").remove();
				return $("body")
					.text()
					.trim()
					.replace(/[\n\t]/g, "");
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
