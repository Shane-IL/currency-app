import { observer } from "mobx-react";
import { useRecoilValue } from "recoil";

import { loadingAtom } from "../../atoms/loading-atom";

import styles from "./Loader.module.css";

const Loader = observer(() => {
    const {
        loader_container,
        loader_title,
        lds_dual_ring
    } = styles;

    const loading = useRecoilValue(loadingAtom);

    return loading ? (
        <div className={loader_container}>
            <h3 className={loader_title}>Getting the latest currency data...</h3>
            <div className={lds_dual_ring}></div>
        </div>
    ) : null
});

export default Loader;