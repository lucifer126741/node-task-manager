const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const app = express();
const port = process.env.PORT || 3000;
const { formidable } = require("formidable");

app.use(express.json());
app.post("/upload", (req, res, next) => {
  const form = formidable({
    uploadDir: __dirname + "/images",
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    res.json({ fields, files });
  });
});
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
