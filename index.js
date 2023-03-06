const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());

// process.env тепер містить ключі та значення, які визначили у .env файлі
const PORT = process.env.PORT || 8081;
const KEY = process.env.WEATHER_API_KEY;

// усі middleware пишемо разом
app.use(morgan("tiny"));

app.get("/weathers", async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    if (!latitude) {
      return res
        .status(400)
        .json({ message: "latitude parameter is mandatory" });
    }
    if (!longitude) {
      return res
        .status(400)
        .json({ message: "longitude parameter is mandatory" });
    }
    const response = await axios.get(
      `http://api.weatherbit.io/v2.0/current?key=${KEY}&lat=${latitude}&lon=${longitude}`
    );
    const { data } = response.data;
    const {
      city_name,
      temp,
      weather: { description },
    } = data[0];
    return res.json({ city_name, temp, description });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`Сервер запущено на порту ${PORT}!`);
});
