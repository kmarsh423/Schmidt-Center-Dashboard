//import { aqiFromPM, getAQIDescription, getAQIMessage } from "./AQIcalculator.js";
//import { getUpdatedSensorsData } from "./purpleairDataHandler.js";

var fetch = require('node-fetch');
var AQICalculator = require('./AQIcalculator.js');

/**
 * This function get the data from thingspeak after retreiving the sensor's channel id and API from
 * purpleair data.
 * @param {*} sensor_IDs: array of sensor ids to retreive the data for. Could be an array of one value 
 * @param {*} channel_id: Thingspeak api key for the sensor.
 * @param {*} channel_id : Thingspeak channel id for the sensor.
 * @param {*} start_date: The start date for which to retreive the data. 
 * @param {*} end_date: The End date for which to retreive the data. 
 * @returns: Returns a Promise. When resolved contains the data retreived for a single sensor. 
 */

const fetchData = (sensor_ID, start_date, endDate => {
    return new Promise((resolve, reject) => {
        const apiUrl = `https://api.purpleair.com/v1/sensors/${sensor_ID}`;
        const params = {
            start: start_date,
            end: endDate,
            fields: 'pm1.0,pm2.5,pm10.0,pressure,humidity,temperature',
            key: '1182661F-CF65-11ED-B6F4-42010A800007'
        };

        const url = new URL(apiUrl);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

        fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok')
                }
                return res.json()
            })
            .then(data => {

                const sensorData = { ...sensorData[sensorId], historicalData: data}
                resolve(sensorData);
            })
            .catch(error => {
                reject(error);
            });
    });
        
});

/**
 * This function process the data from thingspeak ensuring proper field name
 * @param {*} data_to_process : Raw sensor data to be processed
 * @returns : The processed sensor data
 */
const processData = (data_to_process) =>
{
    const processedData = [];
    try {
        for(let element of data_to_process){
            // Reprocessing the fields to their correct names indicated in the channels of the data
            const reg = /[^a-zA-Z\d:\u00C0-\u00FF]/g
            let processed = element.Feeds.map(el => JSON.parse(JSON.stringify(el)
                .replaceAll("field1", element.Channel.field1.replace(reg,""))
                .replaceAll("field2", element.Channel.field2.replace(reg,""))
                .replaceAll("field3", element.Channel.field3.replace(reg,""))
                .replaceAll("field4", element.Channel.field4.replace(reg,""))
                .replaceAll("field5", element.Channel.field5.replace(reg,""))
                .replaceAll("field6", element.Channel.field6.replace(reg,""))
                .replaceAll("field7", element.Channel.field7.replace(reg,""))
                .replaceAll("field8", element.Channel.field8.replace(reg,""))
            ))

            // Adding AQI values and message to results
            processed.forEach(el => {
                let calculatedAQI = AQICalculator.aqiFromPM(parseFloat(el['PM25ATM']));
                el.AQI = calculatedAQI;
                el.AQIDescription = AQICalculator.getAQIDescription(calculatedAQI);
                el.AQIMessage = AQICalculator.getAQIMessage(calculatedAQI);
            });

            // Save processed data to new array
            processedData.push({
                sensor_ID: element.ID,
                channel: element.Channel,
                feeds: processed
            });
        
        }
    }
    catch (err) {
        console.log(err.message);
    }
    return processedData;
}

// Get the processed data
exports.getProcessedData =  async function(sensor_IDs, start_date, end_date)
{
    return processData((await fetchData(sensor_IDs, start_date, end_date)));
}

// Get the raw data
exports.getRawData =  async function(sensor_IDs, start_date, end_date)
{
    return (await fetchrData(sensor_IDs, start_date, end_date));
}
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
