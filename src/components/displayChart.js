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


import { getProcessedData } from './dataHandler.js';

/*
These hold the data passed through from the helper api file ./dataHandler.js
*/

const labels = {};
const pm_1_atms = {};
const temperatures = {};
const humidities = {};
const aqis = {};
const pm_2_5_atms = {};
const pm_10_atms = {};
const aqi_descriptions = {};

/**
 * This funciton takes the data from the datahandler and puts them into the variables above.
 * @param {*} inputs 
 */
export async function chartData(inputs){


    let sensorids = [inputs.sensorid];
    // This if you want to implement another sensorid so that you have two concurrent sensorids
    // if(inputs.sensorid2){
    //     sensorids.push(inputs.sensorid2);
    // }
    const startdate = inputs.startdate;
    const enddate = inputs.enddate;
    // Initialize the values with the sensor id as the key
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
    // Gets the data from datahandler. This function is found in /dataHandler
    const data = await getProcessedData(sensorids, startdate, enddate);

    // The next two nested functions sort the data by time
    function combine(a1, a2) {
        for(let i =0; i<a1.length; i++){
            a1[i].push(a2[i])
        }
        return a1
    }
    function sortFunction(a, b) {
        if (a[0] === b[0]) {
            return 0;
        }
        else {
            return (a[0] < b[0]) ? -1 : 1;
        }
    }
    // calls the order functions
    let n_data = combine(data[0].feeds.data, data[0].feeds.AQI)
    n_data = combine(n_data, data[0].feeds.AQIDescription)
    n_data = n_data.sort(sortFunction)
    
    // For testing:
    // console.log(data[0].feeds.data)
    // console.log(n_data)

    // populates the dictionaries that will hold the data
    n_data.forEach(element => {
        const date = new Date(element[0] * 1000);
        const day = date.getDate()
        const month = date.getMonth() + 1
        const year = date.getFullYear()
        const hours = date.getHours();
        const minutes = "0" + date.getMinutes()
        const formattedTime = month + '/' + day + '/' + year + ' ' + hours + ':' + minutes.slice(-2)
        labels[data[0].sensor_ID].push(formattedTime);
        temperatures[data[0].sensor_ID].push(element[2]);
        humidities[data[0].sensor_ID].push(element[1]);
        pm_2_5_atms[data[0].sensor_ID].push(element[4]);
        pm_10_atms[data[0].sensor_ID].push(element[6]);
        pm_1_atms[data[0].sensor_ID].push(element[5]);
        aqis[data[0].sensor_ID].push(element[7]);
        aqi_descriptions[data[0].sensor_ID].push(element[8]);
    })
    
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
 * The title of the dashboard chart
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
 * Unused title for two concurrent sensor id functions
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
 * Initializes the data for the graph from the input data.
 * @param {*} inputs 
 * @returns data with randomly generated colors
 */
export const data = (inputs) => {
    const data = {
        labels: labels[inputs.sensorid],
        datasets: [] 
    };

    console.log('inputs:',inputs)
    const sensor = inputs.sensorid;
    let label = 'Sensor ';
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
 * Function is designed to display the chart to the front end
 * @param {*} inputs 
 * @returns 
 */
export function ShowChart(inputs){

    const [error, setError] = useState(null);   
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {

        const getdata = async () => {

            try {
                await chartData(inputs);
                setIsLoaded(true);
            }
            catch(err) {
                console.log('error:', err)
                setError(true);
            }
        };
        getdata();
    });

    if (error) {

        return <div>Error: {error.message}</div>;

    } if (!isLoaded) {

        return <div>Loading...</div>;

    } 

    return (
        <div>
            <Line options={options} data={data(inputs)} />
        </div>
    );

    

}

/**
 * Get's the randomly generated colors
 * @returns random color
 */
function getColor() {

    var o = Math.round, r = Math.random, s = 255;
    return 'rgb(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ')';

}

/**
 * Gets the background color for each variable
 * @param {*} color 
 * @returns background color
 */
function getBackgroundColor(color){
    return (color.replace(')', '').replace('rgb', 'rgba') + ',0.5)');
}