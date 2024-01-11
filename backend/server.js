const express = require("express");
require('dotenv').config();
const bodyParser = require('body-parser');
const { ConnectDB } = require("./utils/ConnectDB");
const cors = require("cors")
ConnectDB();

const PORT = process.env.PORT || 5000;
const app = express();

// Import Routers
const StudentRouter = require("./api/StudentAPI");

app.use(cors())
app.use(bodyParser.json());
app.use("/student", StudentRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
