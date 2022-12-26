import { observer } from "mobx-react";
import { useRecoilValue } from "recoil";

import { resultsDataAtom } from "../../atoms/results-data-atom";
import { loadingAtom } from "../../atoms/loading-atom";

import styles from "./ResultsView.module.css";

const ResultsView = observer(() => {

    const { results_view_container, error_message } = styles;
    const resultsData = useRecoilValue(resultsDataAtom);
    const loading = useRecoilValue(loadingAtom);

    return loading || !resultsData || (!resultsData.amount && !resultsData.error) ? null : (
        <div className={results_view_container}>
            {
                resultsData?.error ?
                    <div className={error_message}>Error: {resultsData.error}</div> :
                    <div>
                        Result: {(resultsData.amount!) / 100} {resultsData.currency_code}
                        <br />
                        <br />
                        At a rate of: {resultsData.exchange_rate}
                    </div>
            }

        </div>
    )
});

export default ResultsView;