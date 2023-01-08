import { atom, RecoilState } from "recoil";

const loadingAtom: RecoilState<boolean> = atom({
    key: "loadingAtom",
    default: false,
});

export default loadingAtom;
