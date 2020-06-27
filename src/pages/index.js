import React from 'react'
import api from '../api'
import {
  ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, Label, BarChart
} from 'recharts'                         // import components

const IndexPage = () => {
    // Create state variables
    let [responseData, setResponseData] = React.useState('')
    let [ticker, setTicker] = React.useState('')
    let [message, setMessage] = React.useState('')

    // fetches stock data based on parameters
    const fetchData = (e) => {
        e.preventDefault()

        setMessage('Loading...')

        api.stockTimeSeries(ticker)               // uncomment function call
        .then((response)=>{
            setResponseData(response.data)
            setMessage('')
            console.log(response)
        })
        .catch((error) => {
            setMessage('Error')
            console.log(error)
        })
    }


    return (
        <div
            style={{
                background: '#EEE',
                padding: '5%',
                fontFamily: '"Lucida Console", Monaco, monospace'
            }}>
            <h1
                style={{
                    background: 'black',
                    color: 'white',
                    padding: '1rem',
                    display: 'inline-block'
                }}>Gatsby Stock Market App</h1>
            <h2>Analyze Stock Data</h2>
            
            <form onSubmit={fetchData}>
                <fieldset>
                    <legend>Search Stock Market</legend>
                    <label htmlFor="ticker">Enter stock ticker
                        <input
                            required
                            name="ticker"
                            id="ticker"
                            type='text'
                            placeholder='SPY'
                            value={ticker}
                            onChange={(e) => setTicker(e.target.value)}
                        />
                    </label>
                    <button type='submit'>Submit</button>
                </fieldset>
            </form>
            <p>{message}</p>
            <h3>Symbol: {responseData ? responseData.symbol : ''}</h3>
            <p>Daily Time Series with Splits and Dividend Events</p>
            <small>Last Refresh: {responseData ? responseData.refreshed : ''}</small>
           
            
            <ComposedChart
                width={900}
                height={500}
                data={responseData.priceAction}
                margin={{ top: 50, right: 20, left: 10, bottom: 5 }}
                >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis padding={{left: 5, right: 5}} tickCount={15} height={90} 
                dataKey="date" />
                <YAxis tickCount={10} type="number" width={80}>
                    <Label value="Price Action" position="insideLeft" angle={270} />
                </YAxis>
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="low" fill="#8884d8" stroke="#8884d8" />
                
                <Line type="monotone" dataKey="high" stroke="#ff7300" />
                {/* <Scatter dataKey="cnt" fill="red" /> */}
            </ComposedChart>

            <BarChart
                width={900}
                height={500}
                data={responseData.volumeDay}
                margin={{ top: 50, right: 20, left: 10, bottom: 5 }}
                >
                <YAxis tickCount={10} type="number" width={200}>
                    <Label value="Volumen" position="insideLeft" angle={270} />
                </YAxis>
                <Tooltip />
                <XAxis padding={{left: 5, right: 5}} tickCount={15} height={90} 
                dataKey="date" />
                <CartesianGrid stroke="#f5f5f5" />

                <Bar dataKey="volume" stroke="#ff7300" />
            </BarChart>
        </div>
    )
}

export default IndexPage