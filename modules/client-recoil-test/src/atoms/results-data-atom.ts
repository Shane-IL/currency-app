import { atom } from 'recoil';

export type ConversionResult = {
    error?: string | null;
    exchange_rate?: number
    currency_code?: string
    amount?: number
} | null;


export const resultsDataAtom = atom<ConversionResult>({
    key: 'resultsDataAtom',
    default: null
});