import { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import "dotenv/config";

const model = new ChatGroq({
	model: "llama-3.3-70b-versatile",
	temperature: 0.2,
});

const joke = z.object({
	setup: z.string().describe("The setup of the joke"),
	punchline: z.string().describe("The punchline to the joke"),
	rating: z
		.number()
		.optional()
		.describe("How funny the joke is, from 1 to 10"),
});

const structuredLlm = model.withStructuredOutput(joke);

export async function getAIResponse() {
	const res = await structuredLlm.invoke("Tell me a joke about cats");

	console.log(res);
}
