//import { aqiFromPM, getAQIDescription, getAQIMessage } from "./AQIcalculator.js";
//import { getUpdatedSensorsData } from "./purpleairDataHandler.js";
var fetch = require('node-fetch');
var purpleairHandler = require('../handlers/purpleairDataHandler.js')
var AQICalculator = require('../handlers/AQIcalculator.js');

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

const getSingleSensorData = async(sensor_ID, channel_id, API_key, start_date, end_date) =>
{
    return new Promise((resolve, reject) => {
        const url = `https://api.thingspeak.com/channels/${channel_id}/feeds.json?api_key=${API_key}&start=${start_date}&end=${end_date}`;
        console.log(url)
        fetch(url).then(res => res.json())
        .then(response => {
            //console.log(response)
            if(response.status) {
                if(response.status !== 200) {throw new Error(response.message)}
            }
 
            const singleSensorData = {
                ID: sensor_ID,
                Channel: response.channel,
                Feeds: response.feeds
            }
 
            resolve({
                error: false,
                data: singleSensorData
            })
 
        })
        .catch(err => {
            const singleSensorData = {}
            reject({
                error: true,
                message: err.message,
                data: singleSensorData
            })
        })
    })
}

/**
 * This function returns thingspeak data for multiple sensors, a start date and an end date
 * @param {*} sensor_IDs : List of sensors for which to retreive the data
 * @param {*} start_date : The start date for which to retreive the data. 
 * @param {*} end_date: The End date for which to retreive the data. 
 * @returns : A list of object containing the sensors data.
 */
 
const getMultipleSensorData = async(sensor_IDs, start_date, end_date) =>
{
    const multipleSensorsData = [];
    try {
        // Retreive updated sensor data from purpleair
        const purpleairData = await purpleairHandler.getUpdatedSensorsData();
        const purpleairSchmidtSensorsData = purpleairData.schmidtSensorsData;
 
        for(let sensor_ID of sensor_IDs) {
            // Get sensor data from purpleair
            let sensorData = purpleairSchmidtSensorsData[sensor_ID];
            // Get channel id and api key for the sensor
            let channel_id = sensorData.Primary_Channel_ID;
            let API_key = sensorData.Primary_KEY;
            let thisSensorData = await getSingleSensorData(sensor_ID, channel_id, API_key, start_date, end_date);
            multipleSensorsData.push(thisSensorData.data);
        }
 
    }
    catch (err){
        console.log(err.message);
    }
 
    return multipleSensorsData;
 
}


/**
 * This function process the data from thingspeak ensuring proper field name
 * @param {*} data_to_process : Raw sensor data to be processed
 * @returns : The processed sensor data
 */
const processThingspeakData = (data_to_process) =>
{
    const thingspeakProcessedData = [];
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
            thingspeakProcessedData.push({
                sensor_ID: element.ID,
                channel: element.Channel,
                feeds: processed
            });
        
        }
    }
    catch (err) {
        console.log(err.message);
    }
    return thingspeakProcessedData;
}

// Get the processed data
exports.getThingspeakProcessedData =  async function(sensor_IDs, start_date, end_date)
{
    return processThingspeakData((await getMultipleSensorData(sensor_IDs, start_date, end_date)));
}

// Get the raw data
exports.getThingspeakRawData =  async function(sensor_IDs, start_date, end_date)
{
    return (await getMultipleSensorData(sensor_IDs, start_date, end_date));
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