import { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import "dotenv/config";

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

export async function fetchSearchKeywords(text: string) {
	const res = await structuredLlm.invoke(text);

    res.keywords = res.keywords.map((keyword: string) => encodeURIComponent(keyword));

	return res.keywords;
}
