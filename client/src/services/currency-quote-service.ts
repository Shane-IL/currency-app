import {serverURL} from "../constants/external-constants";

//I would have exported this to a types folder and not have it sitting in a different logical entity
//But it's the only case for a shared type in the app so I left it here.
import { ConversionResult } from "../stores/results-data-store";

const createCurrencyQuoteService = () => {
    const currencyQuoteAPIPath = `${serverURL}/api/quote`;
    return {
        getCurrencyQuote: async (currencyFrom: string, currencyTo: string, amount: number, callback:(data:ConversionResult)=>void) => {
            try {
                const response = await fetch(`${currencyQuoteAPIPath}?from_currency_code=${currencyFrom}&to_currency_code=${currencyTo}&amount=${amount}`);
                const data = await response.json();
                if(data.error) {
                    throw new Error(`Error from server`, data.error);
                }
                callback(data);
                
            } catch (error) {
                callback({error: (error as Error).message });
            }
        }
    }
}

export default createCurrencyQuoteService();