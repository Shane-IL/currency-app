import "./App.css";
import { RecoilRoot } from "recoil";
import Loader from "./components/Loader";

import RequestView from "./components/RequestView";
import ResultsView from "./components/ResultsView";

function App() {
    return (
        <div className="App">
            <RecoilRoot>
                <h1>Currency Converter</h1>
                <div className="card">
                    <div>
                        <RequestView />
                    </div>
                    <Loader />
                    <div>
                        <ResultsView />
                    </div>
                </div>
            </RecoilRoot>
        </div>
    );
}

export default App;
