var purpleairHandler = require('../handlers/purpleAirHandler.js');
exports.handler = async function (event, context) {
  var data = await purpleairHandler.getUpdatedsouthCountySensorsData();
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
