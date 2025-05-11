import { fetchCrossrefWorks, fetchCrossrefWorksAnalysis, fetchSearchKeywords } from "./services/service.js";

const question = "How long do you have to smoke cigarettes before it noticeably affects your health?";
// const keywords = await fetchSearchKeywords(question);
// console.log(keywords);

const works = await fetchCrossrefWorks(
	["cigarette", "smoking", "health", "effects", "time"],
	1 // increase count once I have Groq developer account for higher rate limit
);
console.log(works.reduce((acc: number, work: string) => work.length + acc, 0));

const analysis = await fetchCrossrefWorksAnalysis(question, works);
console.log(analysis);