import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://alpha-vantage.p.rapidapi.com',
    headers: {
        'content-type':'application/octet-stream',
        'x-rapidapi-host':'alpha-vantage.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY
    }
});

export default {
    stockTimeSeries: (symbol) =>
    instance({
        'method':'GET',
        'url':'/query',
        'params': {
            'outputsize':'compact',
            'datatype':'json',
            'interval':'5min',
            'function':'TIME_SERIES_INTRADAY',
            'symbol': symbol.toUpperCase()
        },

        transformResponse: [function (data) {
            // Do whatever you want to transform the data
            console.log('Transforming data...')
            const json = JSON.parse(data)
            const dates = Object.keys(json['Time Series (5min)']).reverse()
            // Construct response data for chart input
            const volumeDay = dates.map(date => date = {
                date,
                volume: Number(json['Time Series (5min)'][date]['5. volume']),
            })
            const priceAction = dates.map(date => date = {
                date,
                open: Number(json['Time Series (5min)'][date]['1. open']),
                low: Number(json['Time Series (5min)'][date]['3. low']),
                high: Number(json['Time Series (5min)'][date]['2. high'])
            })
            const symbol = json['Meta Data']['2. Symbol']
            const refreshed = json['Meta Data']['3. Last Refreshed']
            data = {
                symbol,
                refreshed,
                volumeDay,
                priceAction
            }
            console.log(JSON.stringify(data))
            
            return data;
            }],
    })
}