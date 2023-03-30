//import { aqiFromPM, getAQIDescription, getAQIMessage } from "./AQIcalculator.js";
//import { getSensorIDs } from "./listOfSensorsIDs.js";
var fetch = require('node-fetch');

var AQICalculator = require('../handlers/AQIcalculator');
var sensorsList = require('../handlers/listOfSensorsIDs');
// import sensor list from file
var sensors = require('../handlers/listOfSensorsIDs');

/**
 *
 * @returns A promise. When Resolve contains the data, when Rejected contains data until rejection
 */
const rawData = async () => {
  return new Promise((resolve, reject) => {
    // Lists of sensors IDs
    const sensorIDs = sensors.getSensorsIDs();

    // Format the sensor list to match purple air call for multiple entries.
    // More info here: https://docs.google.com/document/d/15ijz94dXJ-YAZLi9iZ_RaBwrZ4KtYeCy08goGBwnbCU/edit
    const formattedSensorIds = sensorIDs.reduce(
      (finalString, currentValue, index, source) => {
        return index < source.length
          ? finalString + '|' + currentValue.toString()
          : finalString + currentValue;
      }
    );

    fetch(`https://api.purpleair.com/v1/sensors?show=${formattedSensorIds}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        'api_key': 'put key here'
      }
    })
      .then((fromServer) => fromServer.json())
      .then((jsonFromServer) => {
        if (jsonFromServer.code) {
          if (jsonFromServer.code !== 200) {
            throw new Error(jsonFromServer.message);
          }
        }
        resolve({
          error: false,
          data: jsonFromServer
        });
      })
      .catch((err) => {
        reject({
          error: true,
          message: err.message
        });
        console.log(err);
      });
  });
};

/* Process data for each sensors using the result
from the purpleair api call and the list of sensor ids.
The stats variable from the Json result holds all the 
sensors measurements */
const processedData = (inputData, sensor_IDs) => {
  const processedData = {};
  sensor_IDs.forEach((sensor_ID) => {
    let results = inputData.results.find((read) => read.ID === sensor_ID);
    if (results !== undefined) {
      let stats = JSON.parse(results['Stats']);
      let calculatedAQI = AQICalculator.aqiFromPM(parseFloat(stats['v5']));

      processedData[sensor_ID] = {
        Primary_Channel_ID: results['THINGSPEAK_PRIMARY_ID'],
        Primary_KEY: results['THINGSPEAK_PRIMARY_ID_READ_KEY'],
        Secondary_Channel_ID: results['THINGSPEAK_SECONDARY_ID'],
        Secondary_KEY: results['THINGSPEAK_SECONDARY_ID_READ_KEY'],
        pm2_5_current: parseFloat(results['pm2_5_atm']),
        pm2_5_24h_average: stats['v5'],
        Label: results['Label'],
        Latitude: results['Lat'],
        Longitude: results['Lon'],
        AQI: calculatedAQI,
        AQIDescription: AQICalculator.getAQIDescription(calculatedAQI),
        AQIMessage: AQICalculator.getAQIMessage(calculatedAQI)
      };
    } else {
      console.log('could not find sensor data for ID', sensor_ID);
    }
  });
  return processedData;
};

/**
 * Update the sensors data to be displayed on the map
 *
 */
const updateSensorData = async () => {
  const northCountySensors = sensorsList.getNorthCountySensorsIds(); //getNorthCountySensors();
  const CentralCounty = sensorsList.getCentralCountySensorsIds(); //getCentralCountySensors();
  const ruralTierSensors = sensorsList.getRuralTierSensorsIds(); //getRuralTiersSensors();
  const innerBeltwaySensors = sensorsList.getInnerBeltwaySensorsIds(); //getInnerBeltwaySensors();
  const southCountySensors = sensorsList.getSouthCountySensorsIds(); //getSouthCountySensors();
  const allSensors = sensorsList.getSensorsIDs();

  let allSensorsData = {};
  let northSensorsData = {};
  let centralSensorData = {};
  let ruralSensorsData = {};
  let innerBeltwayData = {};
  let southSensorData = {};

  try {
    const serverJson = await rawData();
    const sensorData = serverJson.data;
    allSensorsData = processedData(sensorData, allSensors);
    northSensorsData = processedData(sensorData, northCountySensors);
    centralSensorData = processedData(sensorData, CentralCounty);
    ruralSensorsData = processedData(sensorData, ruralTierSensors);
    innerBeltwayData = processedData(sensorData, innerBeltwaySensors);
    southSensorData = processedData(sensorData, southCountySensors);
  } catch (error) {
    console.log(error);
  }

  console.log('Updating data ...');

  const recentSensorData = {
    timestamp: Date.now(),
    schmidtSensorsData: allSensorsData,
    northCountySensorsData: northSensorsData,
    centralCountySensorsData: centralSensorData,
    ruralTierSensorsData: ruralSensorsData,
    innerBeltwaySensorsData: innerBeltwayData,
    southCountySensorsData: southSensorData
  };

  return recentSensorData;
};

exports.getUpdatedSensorsData = async function () {
  return await updateSensorData();
};

exports.getUpdatedschmidtSensorsData = async function () {
  return (await updateSensorData()).schmidtSensorsData;
};

exports.getUpdatedNorthCountySensorsData = async function () {
  return (await updateSensorData()).northCountySensorsData;
};

exports.getUpdatedCentralCountySensorsData = async function () {
  return (await updateSensorData()).centralCountySensorsData;
};

exports.getUpdatedRuralTierSensorsData = async function () {
  return (await updateSensorData()).ruralTierSensorsData;
};

exports.getUpdatedInnerBeltwaySensorsData = async function () {
  return (await updateSensorData()).innerBeltwaySensorsData;
};

exports.getUpdatedsouthCountySensorsData = async function () {
  return (await updateSensorData()).southCountySensorsData;
};


// For testing
// async function logData()
// {
//     const sensorData = await getUpdatedSensorsData()
//     console.log(JSON.stringify(sensorData))
//     const div = document.createElement('div');
//     div.innerHTML = `<h2>What we have</h2> <br />${JSON.stringify(sensorData)}<br /><br />`;
//     $('body').append(div);
// }

// window.onload = logData;
