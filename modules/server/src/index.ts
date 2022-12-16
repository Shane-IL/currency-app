import express, { Express, Request, Response }  from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

type Currency = "USD" | "EUR" | "ILS";

const app:Express = express();
const port:number = 4000;
//I had to use this api, the other one was problematic with getting a client key
const currencyAPI:string = 'https://api.currencyapi.com/v3/latest';
//obviously this would be a stored as a secret in a real application
const currencyAPIKey:string = "UXmc5tFr8XWpyjDmdJ8QS9Ilvg3prxcJOX7iQ86M";

const currencies:string[] = ['EUR', 'USD', 'ILS'];

const cacheValidityTimeout:number = 1000 * 10; //10 seconds

let cacheValidityTimeoutId:NodeJS.Timeout | null = null;

//helper functions;
const toMaxDecimalPlaces = (num:number, decimals:number):number => {
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}
const getExchangeRate = (fromCurrencyRate:number, toCurrencyRate:number):number => {
  return toMaxDecimalPlaces((1 / fromCurrencyRate) * toCurrencyRate, 3);
};

const updateCurrencyData = async () => {
  try {
    const url = `${currencyAPI}?apikey=${currencyAPIKey}&currencies=${currencies}`;
    const response = await fetch(url);
    const data = await response.json();

    if (response.status === 401) throw new Error(data.message);
    if (response.status !== 200) throw new Error('Currency data is not available');

    //We clear the timeout here in case the data was updated before the timeout was reached;
    if(cacheValidityTimeout !== null) clearTimeout(cacheValidityTimeoutId as NodeJS.Timeout);

    const currenciesData = data.data;
    for (const currencyCode in currenciesData) {
      currenciesMapCache.set(currencyCode, currenciesData[currencyCode].value);
    }
    cacheValidityTimeoutId = setTimeout(() => {
      for (const currencyCode in currenciesData) {
        currenciesMapCache.set(currencyCode, null);
      }
    }, cacheValidityTimeout);
  } catch (error) {
    //Just logging service errors to the console here
    //In a real application we would want to log this to a service like Sentry
    console.error(error);
  }
};

const convertCurrency = async (fromCurrency:Currency, toCurrency:Currency, amount:number) => {
  let fromCurrencyRate = currenciesMapCache.get(fromCurrency);
  let toCurrencyRate = currenciesMapCache.get(toCurrency);

  //only blocking if we need to wait for a value to be updated;
  if (!fromCurrencyRate || !toCurrencyRate) {
    await updateCurrencyData();
    fromCurrencyRate = currenciesMapCache.get(fromCurrency);
    toCurrencyRate = currenciesMapCache.get(toCurrency);
  }

  //Fallback in case the service is down or the api key is invalid
  if (!fromCurrencyRate || !toCurrencyRate) return { error: 'Currency data is not available' };

  const result = (amount / fromCurrencyRate) * toCurrencyRate;
  return { exchange_rate: getExchangeRate(fromCurrencyRate, toCurrencyRate), currency_code: toCurrency, amount: toMaxDecimalPlaces(result, 0), error: "" };
};

//I know there are faster ways to intialize a map with values but I prefer this way for readability
const currenciesMapCache:Map<string, number | null> = new Map();
currenciesMapCache.set('USD', null);
currenciesMapCache.set('EUR', null);
currenciesMapCache.set('ILS', null);

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api', (req: Request, res:Response) => {
  res.send('Currency Exchange API');
});

app.get('/api/quote', async (req: Request, res:Response) => {
  const fromCode = req.query.from_currency_code as Currency;
  const toCode = req.query.to_currency_code as Currency;
  const amount = req.query.amount as string;

  if (!fromCode || !toCode || !amount) res.json({ error: 'Missing required parameters' });

  if(amount && isNaN(parseFloat(amount))) res.json({ error: 'Amount' });


  const responseObject = await convertCurrency(fromCode, toCode, parseFloat(amount));
  res.json(responseObject);

});

app.listen(port, () => {
  console.log(`Currency converter server application is running on port ${port}.`);
});