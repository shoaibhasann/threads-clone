import { config } from "dotenv";
import app from "./app.js";
import connectDatabase from "./config/db.js";

// load enviroment variables
config();

const port = process.env.PORT || 8000

app.listen(port, async () => {
    // connecting with DB
    await connectDatabase();
    console.log(`Server is listening on: http://localhost:${port}`);
});

