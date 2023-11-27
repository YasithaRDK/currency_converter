const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

//middlewares
app.use(express.json());
app.use(cors());

//all currencies
app.get("/getAllCurrencies", async (req, res) => {
  const namesURL =
    "https://openexchangerates.org/api/currencies.json?prettyprint=false&show_alternative=false&show_inactive=false&app_id=e88fe9e554ff4d7c8aaf29ea4cdf4ab7";

  try {
    const nameResponse = await axios.get(namesURL);
    const nameData = nameResponse.data;
    return res.json(nameData);
  } catch (err) {
    console.error(err);
  }
});

//get the target amount
app.get("/convert", async (req, res) => {
  const { date, sourceCurrency, targetCurrency, amountInSourceCurrency } =
    req.query;
  try {
    const dataURL = `https://openexchangerates.org/api/historical/${date}.json?app_id=e88fe9e554ff4d7c8aaf29ea4cdf4ab7`;
    const dataResponse = await axios.get(dataURL);
    const rates = dataResponse.data.rates;

    //rates
    const sourceRate = rates[sourceCurrency];
    const targetRate = rates[targetCurrency];

    //final target value
    const targetAmount = (targetRate / sourceRate) * amountInSourceCurrency;

    return res.json(targetAmount.toFixed(2));
  } catch (err) {}
});

//listen to a port
app.listen(5000, () => {
  console.log("SERVER STARTED");
});
