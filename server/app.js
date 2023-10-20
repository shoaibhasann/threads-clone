import express from "express";

// create an server instance of express
const app = express();

app.use(express.json());

app.all("*", (req, res) => {
    res.status(404).json("OOPS! Page Not Found")
});

export default app;