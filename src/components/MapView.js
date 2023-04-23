import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  FeatureGroup
} from 'react-leaflet';
import aqiGradeRGB from '../helpers/AQI';
import './aqi.css';

import React, { useState, useEffect } from 'react';
import WeatherWidget from '../components/Weather-Widget.js';
var all_sensors;
//import { data } from './displayChart';

//https://api.thingspeak.com/channels/1344510/feeds.json?api_key=VJ570KKB1RMDD6NU

function calcAvgAQI(sensors) {
  let sum = 0;
  for (const sensorID in sensors) {
    if (sensors.hasOwnProperty(sensorID)) {
      let sensor = sensors[sensorID];
      sum += sensor.AQI;
    }
  }

  let avg = Math.round(sum / Object.keys(sensors).length);
  return avg;
}

function showLabelMap(sensorData) {
  const dataArray = [];
  for (const sensorKey in sensorData) {
    if (sensorData.hasOwnProperty(sensorKey)) {
      let sensor = sensorData[sensorKey];
      dataArray.push(
        <Marker position={[sensor.Latitude, sensor.Longitude]} key={sensorKey}>
          <Popup>
            <div
              className='container mx-auto p-2 text-center rounded-md'
              id={aqiGradeRGB(sensor.AQI)[0]}
              key={sensorKey}
            >
              <h1 className='font-sans font-bold '>Label: {sensor.Label}</h1>
              <h1 className='font-sans font-bold '>Sensor ID: {sensorKey}</h1>
              <h1 className='font-sans font-bold'>AQI: {sensor.AQI}</h1>
              <h1 className='font-sans font-bold p-1'>
                AQI Description: {sensor.AQIDescription}
              </h1>
              <p className='font-sans p-1'>{sensor.AQIMessage}</p>
            </div>
          </Popup>
        </Marker>
      );
    }
  }

  return dataArray;
}

function MapView() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sensors, setSensorData] = useState({
    allSensors: null,
    north: null,
    central: null,
    inner: null,
    south: null,
    rural: null
  });
  const center = [38.906334, -76.882176];
  // const centralCounty = [38.8275, -76.751111];
  // const northCounty = [39.019989, -76.879418];
  // const innerBeltway = [38.85944, -76.889167];
  // const southCounty = [38.810556, -76.946389];
  // const rural = [38.698611, -76.849167];
  useEffect(() => {
    const fetchData1 = async () => {
      try {
        let data = await fetch('/.netlify/functions/processed');
        data = await data.json();
        console.log(data)
        setSensorData({
          allSensors: data.schmidtSensorsData,
          north: data.northCountySensorsData,
          central: data.centralCountySensorsData,
          inner: data.innerBeltwaySensorsData,
          south: data.southCountySensorsData,
          rural: data.ruralTierSensorsData
        });
        all_sensors = data.schmidtSensorsData;
        setIsLoaded(true);
      } catch (err) {
        setError(true);
      }
    };
    fetchData1();
  }, []);
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    const northCountySensorsMarkers = [...showLabelMap(sensors.north)];
    const centralCountySensorsMarkers = [...showLabelMap(sensors.central)];
    const innerBeltwaySensorsMarkers = [...showLabelMap(sensors.inner)];
    const southCountySensorsMarkers = [...showLabelMap(sensors.south)];
    const ruralTierSensorsMarkers = [...showLabelMap(sensors.rural)];
    const avg = calcAvgAQI(all_sensors);
    return (
      <div className='grid grid-cols-3'>
        <div className='col-span-2 pr-6'><MapContainer center={center} zoom={10} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
            <LayersControl position='topright'>
              <LayersControl.Overlay checked name='North'>
                <FeatureGroup>{northCountySensorsMarkers}</FeatureGroup>
              </LayersControl.Overlay>
              <LayersControl.Overlay checked name='Central'>
                <FeatureGroup>{centralCountySensorsMarkers}</FeatureGroup>
              </LayersControl.Overlay>
              <LayersControl.Overlay checked name='Rural'>
                <FeatureGroup>{ruralTierSensorsMarkers}</FeatureGroup>
              </LayersControl.Overlay>
              <LayersControl.Overlay checked name='Inner'>
                <FeatureGroup>{innerBeltwaySensorsMarkers}</FeatureGroup>
              </LayersControl.Overlay>
              <LayersControl.Overlay checked name='South'>
                <FeatureGroup>{southCountySensorsMarkers}</FeatureGroup>
              </LayersControl.Overlay>
            </LayersControl>
          </MapContainer></div>
          <div className='w-3/5'>
            <div>
              <p className='text-2xl text-gray-600'><span className='font-bold'>County AQI: </span>{avg}</p>
            </div>
            <div
              className='mt-3 py-4 rounded-md text-center'
              id={aqiGradeRGB(avg)[0]}
            >
              <h2>
                {aqiGradeRGB(avg)[0]}
              </h2>
            </div>
            <div className='flex'>
              <div className='py-1 font-medium text-gray-600'>{aqiGradeRGB(avg)[1]}</div>
              <div>
                <img
                  src='/arrow.jpg'
                  alt='Double Sided Arrow' />
              </div>
              <div className='py-1 font-medium text-gray-600'>{aqiGradeRGB(avg)[2]}</div>
            </div>
            <div className='col-start-2 col-end-3 mt-4'>
              <WeatherWidget />
            </div>
          </div>
        </div>
    );
  }
}

/*function AQIView() {
  let avg = 0;
  const [sensors, setSensorData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setSensorData(all_sensors);
    console.log('TestingBBBB', all_sensors);
    setIsLoaded(true);
    //avg = calcAvgAQI(sensors);
  }, [])
   if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <div className='flex-col'>
          <div>
            <p className='text-2xl text-gray-600'><span className='font-bold'>County AQI: </span>{avg}</p>
          </div>
          <div
            className='mt-3 py-4 rounded-md text-center'
            id={aqiGradeRGB(avg)}
          >
            <h2>
              <stong>{aqiGradeRGB(avg)}</stong>
            </h2>
          </div>
          <div className='flex'>
           <div className='py-1 font-medium'>0</div>
            <div>
              <img
                src='/arrow.jpg'
                alt='Double Sided Arrow' 
              />
            </div>
            <div className='py-1 font-medium'>50</div>
          </div>
        </div>
      </>
    );
  }
}*/

export default MapView;
