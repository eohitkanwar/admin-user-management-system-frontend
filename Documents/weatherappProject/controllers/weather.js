const express = require("express");
const axios = require("axios");
const https = require("https");

// const weatherApp = async (req, res) => {
//   try {
    
//     const querry = "Dehradun";
//     console.log("=====",querry)
//     const apiKey = "a823ffee10bafe7fbbe7281e85d24a35";

//     const url = `https://api.openweathermap.org/data/2.5/weather?q=${querry}&appid=${apiKey}&units=metric`;

//     const checkWeather = https.get(url, (response) => {
//       response.on("data", (data) => {
//         console.log(data);
//         const weatherData = JSON.parse(data);
//         console.log("====", weatherData);
//         const Temp = weatherData.main.temp;
//         const humidity = weatherData.main.humidity;
//         res.send(
//           `<h2>the temperature in ${querry} is ${Temp} and humidity is ${humidity}</h2>`
//         );
//         console.log('==',Temp)
//         console.log("---",humidity)
//       });
//     });
//   } catch (error) {
//     console.log("error", error);
//     res.send("server error");
//   }
// };

// module.exports = weatherApp
