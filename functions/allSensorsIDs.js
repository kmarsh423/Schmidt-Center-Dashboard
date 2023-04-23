var sensors_controller = require('../handlers/listOfSensorsIDs.js');

exports.handler = async function (event, context) {
  const data = sensors_controller.getSensorsLists();
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
