import express from "express";
import { getAnalysis } from "../controllers/controller.js";

const router = express.Router();

router.get("/", (req, res) => {
	res.send(`Welcome to the backend for the "Hmm, let's see... 🤔" project!`);
});

router.post("/analysis", async (req, res) => {
	const { prompt } = req.body;
	const response = await getAnalysis(prompt);

	res.status(200).json({
		message: "Analysis successful, returning answer.",
		data: response,
	});
});

export default router;