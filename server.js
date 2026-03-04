const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

/* serve assets */
app.use("/assets", express.static(path.join(__dirname, "assets")));

/* serve tools */
app.use("/tools", express.static(path.join(__dirname, "tools")));

/* serve root pages */
app.use("/", express.static(__dirname));

app.listen(PORT, () => {
  console.log(`🚀 ToolForge server running at http://localhost:${PORT}`);
});