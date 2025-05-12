import express from "express";
import cors from "cors";
import router from "./routes/route.js";

const app = express();
const PORT = 6900;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
	res.send(`Welcome to the backend for the "Hmm, let's see... 🤔" project!`);
});
app.use("/analysis", router);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});