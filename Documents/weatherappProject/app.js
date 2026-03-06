const express = require("express");
const path = require("path");
const router = require("../weatherappProject/routes/weather");
const bodyParser = require("body-parser");
const https = require("https");
const fs = require("fs");

require("dotenv").config();
const port = process.env.PORT;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// //
// app.use(express.static(publicPath))

// app.use(express.json())
// // app.use("/api", router)
// ;
// const publicPath = path.join(__dirname, "public");
// app.use(express.static(publicPath));


// const pathFile = path.join(__dirname,"index.html")
// app.use(express.static(pathFile));
app.get("/", (req, res, next) => {
  const homeFile = fs.readFileSync("index.html", "utf-8");
  console.log("____", homeFile);

  next();
});

app.get("/", (req, res) => {
  try {
    const querry = req.query.cityName;
    console.log("=====", querry);
    const apiKey = "a823ffee10bafe7fbbe7281e85d24a35";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${querry}&appid=${apiKey}&units=metric`;

    const checkWeather = https.get(url, (response) => {
      response.on("data", (data) => {
        console.log(data);
        const weatherData = JSON.parse(data);
        console.log("====", weatherData);
        const Temp = weatherData?.main?.temp;
        console.log("------------", Temp);
        const humidity = weatherData?.main?.humidity;
        console.log("-=-=-", humidity);
        if (!Temp && humidity) {
          return res.send("try again");
        } else {
          return res.send(
            `<h2>the temperature in ${querry} is ${Temp}°C and humidity is ${humidity}%</h2>`
          );
        }
      });
    });
  } catch (error) {
    console.log("error", error);
    return res.send("server error");
  }
});

app.listen(port, () => {
  console.log(`server is running on ${port} port`);
});
