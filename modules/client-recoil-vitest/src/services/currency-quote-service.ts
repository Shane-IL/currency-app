import {serverURL} from "../constants/external-constants";

import { ConversionResult } from "../atoms/results-data-atom";

const createCurrencyQuoteService = () => {
    const currencyQuoteAPIPath = `${serverURL}/api/quote`;
    return {
        getCurrencyQuote: async (currencyFrom: string, currencyTo: string, amount: number, callback:(data:ConversionResult)=>void) => {
            try {
                const response = await fetch(`${currencyQuoteAPIPath}?from_currency_code=${currencyFrom}&to_currency_code=${currencyTo}&amount=${amount}`);
                const data = await response.json();
                if(data.error) {
                    throw new Error(`Error from server: ${data.error}`);
                }
                callback(data);
                
            } catch (error) {
                callback({error: (error as Error).message });
            }
        }
    }
}

export default createCurrencyQuoteService();