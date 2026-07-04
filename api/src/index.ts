import express from "express";
const app = express();
const port = Number(process.env.PORT) || 3000;

app.get("/", (req, res) => {
  res.send("Hello World prashant");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

