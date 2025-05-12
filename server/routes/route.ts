import express from "express";
import { getAnalysis } from "../controllers/controller.js";

const router = express.Router();

router.post("/", async (req, res) => {
	const { prompt } = req.body;
	const response = await getAnalysis(prompt);

	res.status(200).json({
		message: "Analysis successful, returning answer.",
		data: response,
	});
});

export default router;