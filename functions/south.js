var purpleairHandler = require('../handlers/purpleAirHandler');
exports.handler = async function (event, context) {
  var data = await purpleairHandler.getUpdatedsouthCountySensorsData();
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
