import {
	fetchCrossrefWorks,
	fetchCrossrefWorksAnalysis,
	fetchSearchKeywords,
} from "../services/service.js";

export async function getAnalysis(question: string) {
	const keywords = await fetchSearchKeywords(question);
	console.log("KEYWORDS: ", keywords);

	const works = await fetchCrossrefWorks(keywords, 5);
	console.log(
		"EST. TOKENS: ",
		works.reduce((acc: number, work: string) => work.length + acc, 0) / 4
	);

	const analysis = await fetchCrossrefWorksAnalysis(question, works);
	console.log("ANALYSIS: ", analysis);

    return analysis;
}
