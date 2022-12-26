import { ReactNode, useEffect, useState } from "react";
import { DebounceInput } from 'react-debounce-input';
import { useRecoilState, useSetRecoilState } from "recoil";

import currencyQuoteService from "../../services/currency-quote-service";

import { currencies } from "../../constants/currency-constants";

import { loadingAtom } from "../../atoms/loading-atom";
import { resultsDataAtom } from "../../atoms/results-data-atom";

import styles from "./RequestView.module.css";

const RequestView = () => {

    const {
        request_view_container,
        inputs_container,
        validation_message
    } = styles;

    const setLoading = useSetRecoilState(loadingAtom);
    const setResultsData = useSetRecoilState(resultsDataAtom);

    const [currencyFrom, setCurrencyFrom] = useState<string>("");
    const [currencyTo, setCurrencyTo] = useState<string>("");
    const [amount, setAmount] = useState<number | null>(null);
    const [amountValid, setAmountValid] = useState<boolean>(true);
    const [currenciesValid, setCurrenciesValid] = useState<boolean>(true);

    const generateCurrencyOptions = () => {
        return currencies.map((currency) => {
            return <option key={currency} value={currency}>{currency}</option> as ReactNode;
        })
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const parsedValue = parseFloat(e.target.value);
        if (isNaN(parsedValue)) {
            setAmount(null);
            setAmountValid(false);
            return;
        }
        setAmount(parsedValue);
    };

    useEffect(() => {
        //This is the validation logic, for a real app I'd make a custom hook for this
        if (amount === null || !currencyFrom || !currencyTo) {
            return;
        }
        setAmountValid(true);
        setCurrenciesValid(true);
        if (!amount || amount < 0.01) {
            setAmountValid(false);
            return;
        }
        if (currencyFrom === currencyTo) {
            setCurrenciesValid(false);
            return;
        }

        //Could probably do more robust validation by checking the value against the array of currencies in const
        //But it's not really necessary for this project
        if (currencyFrom.length && currencyTo.length && amount > 0.01) {
            setLoading(true);
            currencyQuoteService.getCurrencyQuote(currencyFrom, currencyTo, amount * 100, response => {
                setLoading(false);
                setResultsData(response);
            });
        }

    }, [currencyFrom, currencyTo, amount]);

    return (
        <div className={request_view_container}>
            <h3>Select the currencies you wish to convert from and to and enter the amount</h3>
            <div className={inputs_container}>
                <div>
                    <label htmlFor="currency_from">From:</label>
                    <select
                        id="currency_from" value={currencyFrom} onChange={e => setCurrencyFrom(e.target.value)}>
                        <option disabled={true} value="">
                            --Choose a currency--
                        </option>
                        {generateCurrencyOptions()}
                    </select>
                </div>
                <div>
                    <label htmlFor="currency_to">To:</label>
                    <select
                        id="currency_to" value={currencyTo} onChange={e => setCurrencyTo(e.target.value)}>
                        <option disabled={true} value="">
                            --Choose a currency--
                        </option>
                        {generateCurrencyOptions()}
                    </select>
                </div>
                <div>
                    {/* External component to handle the input debounce  */}
                    {/* The requirement was to update when any of the fields changes and everything is valid  */}
                    {/* But we wouldn't want to send a request on every input change  */}
                    <DebounceInput
                        onChange={handleAmountChange}
                        value={amount?.toString()}
                        debounceTimeout={800}
                        step=".01"
                        type="number"
                        placeholder="Amount" min="0.01"
                    />

                </div>
                {
                    !amountValid || !currenciesValid ?
                        <div className={validation_message}>
                            {!amountValid ? "Amount is invalid" : !currenciesValid ? "Currencies must be different" : "Validation Error"}
                        </div>
                        : null
                }

            </div>
        </div >
    )
};

export default RequestView;