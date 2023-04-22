
// List of the sensors
//let sensorIDs = [];
// let sensorIDs = [

//     102898, // PGCPS_Schmidt_CenterBldg (outside) ID 102898
//     104786, // PGCPS_Schmidt_Orme (outside) ID 104786 currently offline
//     102830, // PGCPS_LargoIntl_Rm125 (outside)
//     102890, // PGCPS_GwynnPHS_Temp3 (outside)
//     131815, // Riverdale Park (outside)
//     114799, // Cheverly (outside)
//     57841,  // CheverlyAQM_W3_1 (outside)
//     52833,  // CheverlyAQM_W1_2 (outside)
//     53677,  // CheverlyAQM_W1_1 (outside)
//     53663,  // CheverlyAQM_W1_3 (outside)
//     53775  // CheverlyAQM_W2_2 (outside)
//     //54259   // CheverlyAQM_W2_3 (outside)
// ];

let sensorIdsLabel = {

    102898: { Name: 'PGCPS_Schmidt_CenterBldg (outside)', Region: 'North County', Status: 'online'},
    104786: { Name: 'PGCPS_Schmidt_Orme (outside)', Region: 'North County', Status: 'online'},
    102830: { Name: 'PGCPS_LargoIntl_Rm125 (outside)', Region: 'North County', Status: 'online'},
    102890: { Name: 'PGCPS_GwynnPHS_Temp3 (outside)', Region: 'North County', Status: 'online'},
    131815: { Name: 'Riverdale Park (outside)', Region: 'North County', Status: 'online'},
    114799: { Name: 'Cheverly (outside)', Region: 'Inner Beltsway', Status: 'online'},
    57841: { Name: 'CheverlyAQM_W3_1 (outside)', Region: 'Inner Beltsway', Status: 'online'}, 
    52833: { Name: 'CheverlyAQM_W1_2 (outside)', Region: 'Inner Beltsway', Status: 'online'},
    53677: { Name: 'CheverlyAQM_W1_1 (outside)', Region: 'Inner Beltsway', Status: 'online'},
    53663: { Name: 'CheverlyAQM_W1_3 (outside)', Region: 'Inner Beltsway', Status: 'online'},
    53775: { Name: 'CheverlyAQM_W2_2 (outside)', Region: 'Inner Beltsway', Status: 'online'},

}

// // North county: 39.019989, -76.879418
// const northCounty = [
//     102898, // PGCPS_Schmidt_CenterBldg (outside) ID 102898
//     104786, // PGCPS_Schmidt_Orme (outside) ID 104786 currently offline
//     102830, // PGCPS_LargoIntl_Rm125 (outside)
//     102890, // PGCPS_GwynnPHS_Temp3 (outside)
//     131815 // Riverdale Park (outside)
// ];

// // Inner Beltway: 38.859444,-76.889167
// const innerBeltsway = [
//     114799, // Cheverly (outside)
//     57841,  // CheverlyAQM_W3_1 (outside)
//     52833,  // CheverlyAQM_W1_2 (outside)
//     53677,  // CheverlyAQM_W1_1 (outside)
//     53663,  // CheverlyAQM_W1_3 (outside)
//     53775,  // CheverlyAQM_W2_2 (outside)
//     //54259   // CheverlyAQM_W2_3 (outside)
// ];

// // Central County: 38.8275,-76.751111
// const centralCounty = [];

// // Rural Tier: 38.698611,-76.849167
// const ruralTier = [];

// // South County: 38.810556,-76.946389
// const southCounty = [];

// Add or overwrite a sensor
exports.addSensorInfo = function (sensorID, name, region, status) {
    const element = {};
    element[sensorID] = { Name: name, Region: region, Status: status}
    Object.assign(sensorIdsLabel, element)
}

exports.removeSensorInfo = function (params) {
    // Unimplemented
}

exports.getSensorsLists = function () {
    return sensorIdsLabel;
}
// exports.addSensorByID = function (ID)
// {
//     console.log("Sensor id to add", ID);
//     sensorIDs.push.apply(ID);
//     console.log("New list", sensorIDs)
// }

// exports.addNorthCountySensorByID = function (ID)
// {
//     northCounty.push.apply(ID);
// }

// exports.addInnerBeltswaySensorByID = function (ID)
// {
//     innerBeltsway.push.apply(ID);
// }

// exports.addCentralCountySensorByID = function (ID)
// {
//     centralCounty.push.apply(ID);
// }

// exports.addRuralTierSensorByID = function (ID)
// {
//     ruralTier.push.apply(ID);
// }

// exports.addSouthCountySensorByID = function (ID)
// {
//     southCounty.push.apply(ID);
// }

// List of the sensors ids
const sensorIDsList = function() {

    const sensorIDslist = [];
    for(let key in sensorIdsLabel){

        if(sensorIdsLabel.hasOwnProperty(key)){
            sensorIDslist.push(parseInt(key))
        }
    }
    return sensorIDslist;
}

exports.getSensorsIDs = function(){
    return sensorIDsList();
}

const getsensorIDsbyregion = function(region) {

    const sensorIDslist = [];
    for(let key in sensorIdsLabel){

        if(sensorIdsLabel.hasOwnProperty(key)){
            if(sensorIdsLabel[key].Region === region){
                sensorIDslist.push(parseInt(key))
            }
        }
    }
    return sensorIDslist;
}

exports.getInnerBeltwaySensorsIds = function(){
    return getsensorIDsbyregion('Inner Beltsway');
}

exports.getNorthCountySensorsIds = function(){
    return getsensorIDsbyregion('North County');
}

exports.getCentralCountySensorsIds = function(){
    return getsensorIDsbyregion('Central County');
}

exports.getRuralTierSensorsIds = function(){
    return getsensorIDsbyregion('Rural Tier');
}

exports.getSouthCountySensorsIds = function(){
    return getsensorIDsbyregion('South County');
}