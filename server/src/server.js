require("dotenv").config();
const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Leads API is running");
});

app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
        return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
    console.log("Webhook received:");
    console.log(JSON.stringify(req.body, null, 2));

    const leadgenId =
        req.body?.entry?.[0]?.changes?.[0]?.value?.leadgen_id;

    if (!leadgenId) {
        return res.sendStatus(200);
    }

    try {
        const response = await fetch(
            `https://graph.facebook.com/v26.0/${leadgenId}?access_token=${process.env.PAGE_ACCESS_TOKEN}`
        );

        const lead = await response.json();

        console.log("Lead data from Meta:");
        console.log(JSON.stringify(lead, null, 2));
    } catch (error) {
        console.error("Failed to retrieve lead:", error);
    }

    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});