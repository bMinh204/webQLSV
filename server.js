require("dotenv").config();
const app = require("./config/src/app.js");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
console. log(' Server running at http://localhost:${PORT}');
});