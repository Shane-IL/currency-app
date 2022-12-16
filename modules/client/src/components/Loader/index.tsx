import { observer } from "mobx-react";
import { useResultsDataStore } from "../../stores/results-data-store";

import styles from "./Loader.module.css";

const Loader = observer(() => {
    const {
        loader_container,
        loader_title,
        lds_dual_ring
    } = styles;

    const _resultsDataStore = useResultsDataStore();

    //I'm handling the component showing or not showing by the "isFetching" here, but I could have done it in the parent component
    //It would have just meant adding another subcomponent to the parent component so everything would sit in the same context provicer
    //So I did this to save time.

    return _resultsDataStore.isFetching ? (
        <div className={loader_container}>
            <h3 className={loader_title}>Getting the latest currency data...</h3>
            <div className={lds_dual_ring}></div>
        </div>
    ) : null
});

export default Loader;