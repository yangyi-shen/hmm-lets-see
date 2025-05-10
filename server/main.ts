import { fetchCrossrefWorks, fetchSearchKeywords } from "./services/service.js";

// const keywords = await fetchSearchKeywords(
// 	"How long do you have to smoke cigarettes before it noticeably affects your health?"
// );
// console.log(keywords);

const works = await fetchCrossrefWorks(
	["cigarette", "smoking", "health", "effects", "time"],
	5
);
console.log(works);
