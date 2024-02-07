import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";
import env from 'dotenv';
import { OpenAI } from "openai";
 
const app = express()

env.config()

app.use(cors())
app.use(bodyParser.json())

const openai = new OpenAI({
  apiKey: process.env.API_KEY // This is also the default, can be omitted
});

app.listen("8080", () => {
    console.log("Listening on port 8080");
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/", async (req, res) => {
    const { message } = req.body;

    try {
        const response = await openai.completions.create({
            model: "gpt-3.5-turbo-instruct", // Use a supported enginec
           prompt: `${message}`,
          max_tokens:200,
            temperature: 0.5
        });
        // res.json({ message: response.choices[0].text});
        const aiResponse = response.choices[0].text;
        // console.log("AI Response:", aiResponse);

        const usage = response.usage.total_tokens;
        console.log("Total tokens used:", usage);


        res.json({ message: aiResponse });
    } catch (e) {
        console.error(e);
        res.status(400).send(e.message);
    }
});
