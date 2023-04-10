import { useEffect } from "react";
import { useState } from "react";
import React from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';


var thingspeakHandler = require('./dataHandler');

const labels = {};
const pm_1_atms = {};
const temperatures = {};
const humidities = {};
const aqis = {};
const pm_2_5_atms = {};
const pm_10_atms = {};
const aqi_descriptions = {};

/**
 * 
 * @param {*} inputs 
 */
export async function chartData(inputs){

    let sensorids = [inputs.sensorid];
    if(inputs.sensorid2){
        sensorids.push(inputs.sensorid2);
    }
    const startdate = inputs.startdate;
    const enddate = inputs.enddate;
    // Initialize
    sensorids.forEach(sensor => {
        if(sensor !== ""){
            labels[sensor] = [];
            pm_1_atms[sensor] = [];
            temperatures[sensor] = [];
            humidities[sensor] = [];
            aqis[sensor] = [];
            pm_2_5_atms[sensor] = [];
            pm_10_atms[sensor] = [];
            aqi_descriptions[sensor] = [];
        }
    })

    console.log("received id:"+ sensorids)
    const data = await thingspeakHandler.getThingspeakProcessedData(sensorids, startdate, enddate);
    console.log('DATA: ', data);
    console.log("SENSOR ID: ", sensorids)
    data.forEach(element => {
        console.log("Feed of:" + element.sensor_ID + "Feeds:" + element.feeds);

        element.feeds.forEach(feed => {
            labels[element.sensor_ID].push(feed.created_at);
            temperatures[element.sensor_ID].push(feed.Temperature);
            humidities[element.sensor_ID].push(feed.Humidity);
            aqis[element.sensor_ID].push(feed.AQI);
            pm_2_5_atms[element.sensor_ID].push(feed.PM25ATM);
            pm_10_atms[element.sensor_ID].push(feed.PM100ATM);
            pm_1_atms[element.sensor_ID].push(feed.PM10ATM);
            aqi_descriptions[element.sensor_ID].push(feed.AQIDescription);
        });

        console.log("Humidities" + JSON.stringify(humidities))
        
    });
    
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/**
 * 
 */
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Sensor Data Data Chart',
    },
  },
};

/**
 * 
 */
export const options2 = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Sensor Data Line Chart - Multi Axis',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
}

/**
 * 
 * @param {*} inputs 
 * @returns 
 */
export const data = (inputs) => {
    const data = {
        labels: labels[inputs.sensorid],
        datasets: [] 
    };

    
    const sensor = inputs.sensorid;
    let label = 'Primary Sensor ';
        // Sensor Temperature data
    if(inputs.temperature) {
        const color = getColor();
        const backgroundColor = getBackgroundColor(color);
        data.datasets.push(
            {
                label: label.concat('Temperature'),
                data: temperatures[sensor],
                borderColor: color,
                backgroundColor: backgroundColor,
            }
        )
    }

    if(inputs.humidity) {
        const color = getColor();
        const backgroundColor = getBackgroundColor(color);
        data.datasets.push(
            {
                label: label.concat('Humidity'),
                data: humidities[sensor],
                borderColor: color,
                backgroundColor: backgroundColor,
                
            }
        )
    }

    if(inputs.aqi) {
        const color = getColor();
        const backgroundColor = getBackgroundColor(color);
        data.datasets.push(
            {
                label: label.concat('AQI (Air Quality Index)'),
                data: aqis[sensor],
                borderColor: color,
                backgroundColor: backgroundColor,
                
            }
        )
    }

    if(inputs.pm_25) {
        const color = getColor();
        const backgroundColor = getBackgroundColor(color);
        data.datasets.push(
            {
                label: label.concat('PM 2.5 ATM'),
                data: pm_2_5_atms[sensor],
                borderColor: color,
                backgroundColor: backgroundColor,
                
            }
        )
    }

    if(inputs.pm_1) {
        const color = getColor();
        const backgroundColor = getBackgroundColor(color);
        data.datasets.push(
            {
                label: label.concat('PM 1.0 ATM'),
                data: pm_1_atms[sensor],
                borderColor: color,
                backgroundColor: backgroundColor,
                
            }
        )
    }

    if(inputs.pm_10) {
        const color = getColor();
        const backgroundColor = getBackgroundColor(color);
        data.datasets.push(
            {
                label: label.concat('PM 10 ATM'),
                data: pm_10_atms[sensor],
                borderColor: color,
                backgroundColor: backgroundColor,
            }
        )
    }

    return data;

}

/**
 * 
 * @param {*} inputs 
 * @returns 
 */
export const data2 = (inputs) => {
    const data = {
        labels: labels[inputs.sensorid],
        datasets: [] 
    };


    const sensorids = [inputs.sensorid, inputs.sensorid2];
    sensorids.forEach(sensor => {
        let label = '';
        let yaxis = '';
        if(sensor === inputs.sensorid){
            label = 'Primary Sensor ';
            yaxis = 'y';
        }else{
            label = 'Secondary Sensor ';
            yaxis = 'y1';
        }
        // Sensor Temperature data
        if(inputs.temperature) {
            const color = getColor();
            const backgroundColor = getBackgroundColor(color);
            data.datasets.push(
                {
                    label: label.concat('Temperature'),
                    data: temperatures[sensor],
                    borderColor: color,
                    backgroundColor: backgroundColor,
                    yAxisID: yaxis,
                }
            )
        }

        if(inputs.humidity) {
            const color = getColor();
            const backgroundColor = getBackgroundColor(color);
            data.datasets.push(
                {
                    label: label.concat('Humidity'),
                    data: humidities[sensor],
                    borderColor: color,
                    backgroundColor: backgroundColor,
                    yAxisID: yaxis,
                }
            )
        }

        if(inputs.aqi) {
            const color = getColor();
            const backgroundColor = getBackgroundColor(color);
            data.datasets.push(
                {
                    label: label.concat('AQI (Air Quality Index)'),
                    data: aqis[sensor],
                    borderColor: color,
                    backgroundColor: backgroundColor,
                    yAxisID: yaxis,
                }
            )
        }

        if(inputs.pm_25) {
            const color = getColor();
            const backgroundColor = getBackgroundColor(color);
            data.datasets.push(
                {
                    label: label.concat('PM 2.5 ATM'),
                    data: pm_2_5_atms[sensor],
                    borderColor: color,
                    backgroundColor: backgroundColor,
                    yAxisID: yaxis,
                }
            )
        }

        if(inputs.pm_1) {
            const color = getColor();
            const backgroundColor = getBackgroundColor(color);
            data.datasets.push(
                {
                    label: label.concat('PM 1.0 ATM'),
                    data: pm_1_atms[sensor],
                    borderColor: color,
                    backgroundColor: backgroundColor,
                    yAxisID: yaxis,
                }
            )
        }

        if(inputs.pm_10) {
            const color = getColor();
            const backgroundColor = getBackgroundColor(color);
            data.datasets.push(
                {
                    label: label.concat('PM 10 ATM'),
                    data: pm_10_atms[sensor],
                    borderColor: color,
                    backgroundColor: backgroundColor,
                    yAxisID: yaxis,
                }
            )
        }

        

    });

    return data;

}

/**
 * 
 * @param {*} inputs 
 * @returns 
 */
export function ShowChart(inputs){

    console.log("Here we are");

    const [error, setError] = useState(null);   
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {

        const getdata = async () => {

            try {
                await chartData(inputs);
                setIsLoaded(true);
            }
            catch(err) {
                setError(true);
            }
        };

        getdata();

    });

    if (error) {

        return <div>Error: {error.message}</div>;

    } else if (!isLoaded) {

        return <div>Loading...</div>;

    } else {

        if(inputs.sensorid2 !== ""){
            return (
                <div>
                    <Line options={options2} data={data2(inputs)} />
                </div>
            );
        }

        return (
            <div>
                <Line options={options} data={data(inputs)} />
            </div>
        );

    }

}

/**
 * 
 * @returns 
 */
function getColor() {

    var o = Math.round, r = Math.random, s = 255;
    return 'rgb(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ')';

}

/**
 * 
 * @param {*} color 
 * @returns 
 */
function getBackgroundColor(color){
    return (color.replace(')', '').replace('rgb', 'rgba') + ',0.5)');
}