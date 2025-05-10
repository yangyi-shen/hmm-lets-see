import { fetchSearchKeywords } from "./services/service.js";

const keywords = await fetchSearchKeywords(
	"How long do you have to smoke cigarettes before it noticeably affects your health?"
);
console.log(keywords);
