const express = require("express");
const mongoose = require("mongoose");
const router = require("../nodepractice/routes/user");
const nodemailer = require("nodemailer");
const fs = require('fs') 

// const slugify = require("slugify");
// const { doesNotMatch } = require("assert");

require("dotenv").config();
const port = process.env.PORT;

const app = express();
app.use(express.json());

app.use("/api", router);

mongoose
  .connect(process.env.URL)
  .then(() => {
    console.log("mongodb connected successfully");
  })
  .catch((error) => {
    console.log("-------", error);
  });
//   fs.writeFileSync("index.txt","hlo world")
//   console.log()

// fs.appendFile("index.txt","hey what are you doing", ()=>{
//   console.log("done")
//   fs.readFile("index.txt",(error,data)=>{
//     console.log(data.toString())
//   })
// })
try {
  app.listen(port, (req, res) => {
    console.log(`server is running on ${port} port`);
  });
} catch (error) {
  console.log("----error", error);
}
