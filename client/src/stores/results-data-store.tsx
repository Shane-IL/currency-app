import { useLocalObservable } from 'mobx-react';
import React, { createContext } from 'react';
import { action } from 'mobx';

//Types
export type ConversionResult = {
    error?: string | null;
    exchange_rate?: number
    currency_code?: string
    amount?: number
} | null;


type StoreProviderProps = {
    children: React.ReactNode
};

type ResultsStore = {
    result: ConversionResult;
    addResult: (newResult: ConversionResult) => void;
    currentResult: ConversionResult;
    fetching: boolean;
    isFetching: boolean;
    toggleFetching: (newValue: boolean) => void;
}

//Store factory function
const createResultsDataStore = () => {
    return {
        result: null as ConversionResult,
        fetching: false,
        addResult: function (newResult: ConversionResult) {
            this.result = newResult
        },
        toggleFetching: function (newValue: boolean) {
            this.fetching = newValue;
        },
        get currentResult() {
            return this.result
        },
        get isFetching() {
            return this.fetching
        }
    }
}

//Context
export const ResultsDataStoreContext = createContext<ResultsStore | null>(null);

//Context Provider
export const ResultsDataStoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
    const store = useLocalObservable(createResultsDataStore)
    return (
        <ResultsDataStoreContext.Provider value={store}>{children}</ResultsDataStoreContext.Provider>
    );
}

//Context consumer hook
export const useResultsDataStore = () => {
    const store = React.useContext(ResultsDataStoreContext)
    if (!store) {
        throw new Error('useResultsDataStore must be used within a ResultsDataStoreProvider.')
    }
    return store
}

