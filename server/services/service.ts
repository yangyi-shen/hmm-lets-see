import { DeepInfraLLM } from "@langchain/community/llms/deepinfra";
import "dotenv/config";

export async function getAIResponse() {
	const llm = new DeepInfraLLM({
		temperature: 0.7,
		model: "Qwen/Qwen3-235B-A22B",
		apiKey: process.env.DEEPINFRA_API_KEY,
		maxRetries: 5,
	});

	const res = await llm.invoke(
		"What is the next step in the process of making a good game?"
	);

	console.log(res);
}
