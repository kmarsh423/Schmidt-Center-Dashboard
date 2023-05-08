
var fetch = require('node-fetch');
var AQICalculator = require('./AQIcalculator.js');
//PUT NEW KEY BELOW
const api_key = ''
/**
 * This function get the data from purple air's historical data
 * @param {*} sensor_IDs: array of sensor ids to retreive the data for. Could be an array of one value 
 * @param {*} start_date: The start date for which to retreive the data. 
 * @param {*} end_date: The End date for which to retreive the data. 
 * @returns: Returns a Promise. When resolved contains the data retreived for a single sensor. 
 */

const fetchData = async (sensor_ID, start_date, end_date) => {
    return new Promise(async (resolve, reject) => {
        try {
            const apiUrl = `https://api.purpleair.com/v1/sensors/${sensor_ID}/history` ;
            const params = {
                start: start_date,
                end: end_date,
                fields: 'pm1.0_atm,pm2.5_alt,pm10.0_atm,pressure,humidity,temperature'
            };

            const url = new URL(apiUrl);
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

            const headers = new Headers();
            headers.append('X-API-Key', api_key); // Replace with your API key

            const request = new Request(url, {
                method: 'GET',
                headers: headers,
                mode: 'cors',
                cache: 'default'
            });

            const response = await fetch(request);
            if (!response.ok) {
                reject(new Error('Network response was not ok'));
                return;
            }
            const data = await response.json();
            // Process the retrieved historical data here

            resolve(data);
        } catch (e) {
            // Handle any errors that occurred during fetch
            console.error(e);
            reject(e);
        }
    });
};

/**
 * This function process the data from purpleair ensuring proper field name
 * @param {*} data_to_process : Raw sensor data to be processed
 * @returns : The processed sensor data
 */
const processData = (data_to_process) =>
{
    console.log(data_to_process)
    const processedData = [];
    try {
        
        // Reprocessing the fields to their correct names indicated in the channels of the data
        // const reg = /[^a-zA-Z\d:\u00C0-\u00FF]/g
        const processed = data_to_process
        // Adding AQI values and message to results
        
        let calculatedAQI = [];
        processed.data.forEach(element => calculatedAQI.push(AQICalculator.aqiFromPM(parseFloat(element[4]))));
        processed.AQI = calculatedAQI;
        processed.AQIDescription = [];
        calculatedAQI.forEach(element => processed.AQIDescription.push(AQICalculator.getAQIDescription(element)));
        processed.AQIMessage = []
        calculatedAQI.forEach(element => processed.AQIMessage.push(AQICalculator.getAQIMessage(element)));
        // Save processed data to new array
        processedData.push({
            sensor_ID: data_to_process.sensor_index,
            feeds: processed
        });
    
        
    }
    catch (err) {
        console.log(err.message);
    }
    return processedData;
}

// Get the processed data
export async function getProcessedData( sensor_IDs, start_date, end_date) {
    return processData((await fetchData(sensor_IDs, start_date, end_date)));
}
