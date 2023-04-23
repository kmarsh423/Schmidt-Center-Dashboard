var purpleairHandler = require('../handlers/purpleairDataHandler.js');
exports.handler = async function (event, context) {
  var data = await purpleairHandler.getUpdatedNorthCountySensorsData();
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*' // Allow from anywhere
    },
    body: JSON.stringify(data)
  };
};
