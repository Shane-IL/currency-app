var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();
const port = 4000;
//I had to use this api, the other one was problematic with getting a client key
const currencyAPI = 'https://api.currencyapi.com/v3/latest';
//obviously this would be a stored as a secret in a real application
const currencyAPIKey = "UXmc5tFr8XWpyjDmdJ8QS9Ilvg3prxcJOX7iQ86M";
const currencies = ['EUR', 'USD', 'ILS'];
const cacheValidityTimeout = 1000 * 10; //10 seconds
let cacheValidityTimeoutId = null;
//helper functions;
const toMaxDecimalPlaces = (num, decimals) => {
    const factor = Math.pow(10, decimals);
    return Math.round((num + Number.EPSILON) * factor) / factor;
};
const getExchangeRate = (fromCurrencyRate, toCurrencyRate) => {
    return toMaxDecimalPlaces((1 / fromCurrencyRate) * toCurrencyRate, 3);
};
const updateCurrencyData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = `${currencyAPI}?apikey=${currencyAPIKey}&currencies=${currencies}`;
        const response = yield fetch(url);
        const data = yield response.json();
        if (response.status === 401)
            throw new Error(data.message);
        if (response.status !== 200)
            throw new Error('Currency data is not available');
        //We clear the timeout here in case the data was updated before the timeout was reached;
        if (cacheValidityTimeout !== null)
            clearTimeout(cacheValidityTimeoutId);
        const currenciesData = data.data;
        for (const currencyCode in currenciesData) {
            currenciesMapCache.set(currencyCode, currenciesData[currencyCode].value);
        }
        cacheValidityTimeoutId = setTimeout(() => {
            for (const currencyCode in currenciesData) {
                currenciesMapCache.set(currencyCode, null);
            }
        }, cacheValidityTimeout);
    }
    catch (error) {
        //Just logging service errors to the console here
        //In a real application we would want to log this to a service like Sentry
        console.error(error);
    }
});
const convertCurrency = (fromCurrency, toCurrency, amount) => __awaiter(void 0, void 0, void 0, function* () {
    let fromCurrencyRate = currenciesMapCache.get(fromCurrency);
    let toCurrencyRate = currenciesMapCache.get(toCurrency);
    //only blocking if we need to wait for a value to be updated;
    if (!fromCurrencyRate || !toCurrencyRate) {
        yield updateCurrencyData();
        fromCurrencyRate = currenciesMapCache.get(fromCurrency);
        toCurrencyRate = currenciesMapCache.get(toCurrency);
    }
    //Fallback in case the service is down or the api key is invalid
    if (!fromCurrencyRate || !toCurrencyRate)
        return { error: 'Currency data is not available' };
    const result = (amount / fromCurrencyRate) * toCurrencyRate;
    return { exchange_rate: getExchangeRate(fromCurrencyRate, toCurrencyRate), currency_code: toCurrency, amount: toMaxDecimalPlaces(result, 0), error: "" };
});
//I know there are faster ways to intialize a map with values but I prefer this way for readability
const currenciesMapCache = new Map();
currenciesMapCache.set('USD', null);
currenciesMapCache.set('EUR', null);
currenciesMapCache.set('ILS', null);
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/api', (req, res) => {
    res.send('Currency Exchange API');
});
app.get('/api/quote', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fromCode = req.query.from_currency_code;
    const toCode = req.query.to_currency_code;
    const amount = req.query.amount;
    if (!fromCode || !toCode || !amount)
        res.json({ error: 'Missing required parameters' });
    if (amount && isNaN(parseFloat(amount)))
        res.json({ error: 'Amount' });
    const responseObject = yield convertCurrency(fromCode, toCode, parseFloat(amount));
    res.json(responseObject);
}));
app.listen(port, () => {
    console.log(`Currency converter server application is running on port ${port}.`);
});
