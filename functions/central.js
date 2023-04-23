var purpleairHandler = require('../handlers/purpleairDataHandler.js');
exports.handler = async function (event, context) {
  var data = await purpleairHandler.getUpdatedCentralCountySensorsData();
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
