import { atom, RecoilState } from "recoil";

export const loadingAtom:RecoilState<boolean> = atom({
    key: 'loadingAtom',
    default: false
});