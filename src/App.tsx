import { useState } from 'react';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { displayTypes, digitalCurrencies, marketList } from './data';
import { JsonViewer } from '@textea/json-viewer'
import LoadingOverlay from 'react-loading-overlay-ts';

function App() {
  const [chartType, setChartType] = useState<listType | any>("");
  const [symbol, setSymbol] = useState<listType | any>("");
  const [market, setMarket] = useState<listType | any>("");
  const [resultObject, setResultObject] = useState({});
  const [isLoading, setIsLoading] = useState(false)
  const API_KEY = "RIBXT3XYLI69PC0Q";

  type listType = {
    code: string,
    name: string
  } | undefined

  const setSelectedChartType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const option: listType = displayTypes
      .find(option => option.code === event.target.value)

      setChartType(option)
  }

  const setSelectedSymbol = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const option = digitalCurrencies
      .find(option => option.code === event.target.value)

      setSymbol(option)
  }

  const setSelectedMarket = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const option = marketList
      .find(option => option.code === event.target.value)

      setMarket(option)
  }
  
  const resetChartData = () => {
    setChartType("");
    setSymbol("");
    setMarket("");
    setResultObject({});

    triggerInput('sel-chart-type', "");
    triggerInput('sel-symbol', "");
    triggerInput('sel-market', "");
  }

  const showChartData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (chartType !== "" && 
      symbol !== "" && 
      market !== ""
    ) callApi()
  }

  const callApi = () => {
    setIsLoading(true)
    
    fetch(`https://www.alphavantage.co/query?function=${chartType.code}&symbol=${symbol.code}&market=${market.code}&apikey=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      setIsLoading(false)
      setResultObject(data)
    });
  }

  const triggerInput = (name: string, value: string) => {
    const input = document.getElementById(name) as HTMLInputElement & {_valueTracker: any} | null;
  
    if (input != null) {
      const lastValue = input.value;
      input.value = value;
      const event = new Event("input", { bubbles: true });
    
      const tracker = input._valueTracker;
      if (tracker) tracker.setValue(lastValue);
    
      input.dispatchEvent(event);
    }
  }

  return (
    <>
      <LoadingOverlay
        active={isLoading}
        spinner
      >
        <div className="d-flex justify-content-center vh-100">
            <div className="card w-75">
              <div className="card-header p-3">
                <h3 className="mb-0">Cryptocurrency Information</h3>
              </div>
              <div className="card-body">
                <form onSubmit={showChartData} className="mb-3">
                  <div className="row">
                    <div className="col-md-4 col-sm-6 col-12 mb-3">
                      <label className="form-label fw-bold">Display Type</label>
                      <select
                        onChange={setSelectedChartType}
                        defaultValue={chartType.code}
                        id="sel-chart-type"
                        className="form-select"
                      >
                        <option value="">Select type</option>
                        {displayTypes.map(option => (
                            <option value={option.code}>{option.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4 col-sm-6 col-12 mb-3">
                      <label className="form-label fw-bold">Market Symbol</label>
                      <select 
                        onChange={setSelectedSymbol}
                        defaultValue={symbol.code}
                        id="sel-symbol"
                        className="form-select"
                      >
                        <option value="">Select symbol</option>
                        {digitalCurrencies.map(option => (
                            <option value={option.code}>{option.code}</option>
                        ))}
                      </select>
                      {symbol!=="" &&
                        <div className="form-text">Name: {symbol.name}</div>
                      }
                    </div>

                    <div className="col-md-4 col-sm-6 col-12 mb-3">
                      <label className="form-label fw-bold">Market Currency</label>
                      <select
                        onChange={setSelectedMarket}
                        defaultValue={market.code}
                        id="sel-market"
                        className="form-select"
                      >
                        <option value="">Select currency</option>
                        {marketList.map(option => (
                            <option value={option.code}>{option.code}</option>
                        ))}
                      </select>
                      {market!=="" &&
                        <div className="form-text">Name: {market.name}</div>
                      }
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12">
                      <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary me-2">Submit</button>
                        <button 
                          onClick={resetChartData} 
                          type="button" 
                          className="btn btn-outline-secondary"
                        >Reset</button>
                      </div>
                    </div>
                  </div>
                </form>
                
                <h4>Results</h4>
                <div>
                  <JsonViewer
                    className={'json-viewer-container'}
                    value={resultObject} 
                    rootName={false}
                    theme={'dark'} 
                    displayDataTypes={false}
                    enableClipboard={false}
                  />
                </div>
              </div>
            </div>
        </div>
      </LoadingOverlay>
    </>
  )
}

export default App
