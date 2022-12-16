import { observer } from "mobx-react";

import { useResultsDataStore } from "../../stores/results-data-store";

import styles from "./ResultsView.module.css";

const ResultsView = observer(() => {
    const _resultsDataStore = useResultsDataStore();

    const { results_view_container, error_message } = styles;

    //I'm handling the component showing or not showing by the "isFetching" here, but I could have done it in the parent component
    //It would have just meant adding another subcomponent to the parent component so everything would sit in the same context provicer
    //So I did this to save time.

    return _resultsDataStore.isFetching || !_resultsDataStore.currentResult || (!_resultsDataStore.currentResult.amount && !_resultsDataStore.currentResult.error) ? null : (
        <div className={results_view_container}>
            {
                _resultsDataStore.currentResult?.error ?
                    <div className={error_message}>Error: {_resultsDataStore.currentResult?.error}</div> :
                    <div>
                        Result: {(_resultsDataStore.currentResult.amount!) / 100} {_resultsDataStore.currentResult?.currency_code}
                        <br />
                        <br />
                        At a rate of: {_resultsDataStore.currentResult?.exchange_rate}
                    </div>
            }

        </div>
    )
});

export default ResultsView;