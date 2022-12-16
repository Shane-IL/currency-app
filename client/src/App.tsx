import './App.css'
import Loader from './components/Loader';

import RequestView from './components/RequestView';
import ResultsView from './components/ResultsView';

import { ResultsDataStoreProvider } from './stores/results-data-store';

const App = () => {

  return (
    <div className="App">

      <h1>Currency converter</h1>
      <div className="card">
        <ResultsDataStoreProvider>
          <div>
            <RequestView />
          </div>
          <Loader />
          <div>
            <ResultsView />
          </div>
        </ResultsDataStoreProvider>
      </div>
    </div>
  )
}

export default App
