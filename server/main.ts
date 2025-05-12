import { fetchCrossrefWorks, fetchCrossrefWorksAnalysis, fetchSearchKeywords } from "./services/service.js";

const question = "How, in quantitative terms, does drinking alchohol impair the mental development of a teenager?";

const keywords = await fetchSearchKeywords(question);
console.log("KEYWORDS: ", keywords);

const works = await fetchCrossrefWorks(
	keywords,
	1 // increase count once I have Groq developer account for higher rate limit
);
console.log("EST. TOKENS: ", works.reduce((acc: number, work: string) => work.length + acc, 0) / 4);

const analysis = await fetchCrossrefWorksAnalysis(question, works);
console.log("ANALYSIS: ", analysis);