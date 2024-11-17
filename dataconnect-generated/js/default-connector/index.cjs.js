const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'PlanMyTrip-AI-Travel-Planner-Website',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

