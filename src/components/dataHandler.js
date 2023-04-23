//import { aqiFromPM, getAQIDescription, getAQIMessage } from "./AQIcalculator.js";
//import { getUpdatedSensorsData } from "./purpleairDataHandler.js";

var fetch = require('node-fetch');
var AQICalculator = require('./AQIcalculator.js');
const api_key = '1182661F-CF65-11ED-B6F4-42010A800007'
/**
 * This function get the data from thingspeak after retreiving the sensor's channel id and API from
 * purpleair data.
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
 * This function process the data from thingspeak ensuring proper field name
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
        
        let calculatedAQI = AQICalculator.aqiFromPM(parseFloat(processed["pm2.5"]));
        processed.AQI = calculatedAQI;
        processed.AQIDescription = AQICalculator.getAQIDescription(calculatedAQI);
        processed.AQIMessage = AQICalculator.getAQIMessage(calculatedAQI);
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

// Get the raw data
// async function getRawData(sensor_IDs, start_date, end_date) {
//     return (await fetchData(sensor_IDs, start_date, end_date));
// }
// For testing 
// async function logData()
// {
//     const sensor_IDs = [131815, 102898];
//     console.log("testing", sensor_IDs)
//     const start_date = "2021-10-01";
//     const end_date = "2021-11-01";
//     //const singleSensorData = (await getThingspeakRawData(sensor_IDs, start_date, end_date))
//     const singleSensorData = (await getThingspeakProcessedData(sensor_IDs, start_date, end_date))
//     console.log('Inside load data', singleSensorData);
//     console.log(JSON.stringify(singleSensorData))
//     const div = document.createElement('div');
//     div.innerHTML = `<h2>What we have</h2> <br />${JSON.stringify(singleSensorData)}<br /><br />`;
//     $('body').append(div);
// }

// window.onload = logData;
