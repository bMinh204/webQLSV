const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api", require("./routes/api.route"));

// Serve frontend (educhain2/dist)
const clientPath = path.join(__dirname, "../../educhain2/dist");
app.use(express.static(clientPath));
app.get("*", (req, res) => {
res.sendFile(path.join(clientPath, "index.html"));
});
module.exports = app;