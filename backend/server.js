const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());
const dbConfig = require("./config/dbConfig");
const port = process.env.PORT || 5000;
//adding Route file
const usersRoute = require("./routes/usersRoute");
const coursesRoute = require("./routes/coursesRoute");
const tasksRoute = require("./routes/tasksRoute");

app.use("/api/users", usersRoute);
app.use("/api/courses", coursesRoute);
app.use("/api/tasks", tasksRoute);

// deployment config
const path = require("path");
__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
  });
}

app.listen(port, () => console.log(`Nodes server listening on port ${port}`));
