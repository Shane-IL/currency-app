import './App.css'
import Loader from './components/Loader';

import RequestView from './components/RequestView';
import ResultsView from './components/ResultsView';

import { RecoilRoot } from 'recoil'

const App = () => {

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
  )
}

export default App
