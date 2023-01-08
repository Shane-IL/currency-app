import { useRecoilValue } from "recoil";

import loadingAtom from "../../atoms/loading-atom";

import styles from "./Loader.module.css";

function Loader() {
    const { loaderContainer, loaderTitle, ldsDualRing } = styles;

    const loading = useRecoilValue(loadingAtom);

    return loading ? (
        <div className={loaderContainer}>
            <h3 className={loaderTitle}>Getting the latest currency data...</h3>
            <div className={ldsDualRing} />
        </div>
    ) : null;
}

export default Loader;
