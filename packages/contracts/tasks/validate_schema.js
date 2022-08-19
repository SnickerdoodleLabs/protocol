const fs = require('fs');
const Ajv = require("ajv")
const ajv = new Ajv()

var schema = './data/queries/schema.json';
var instance = './data/queries/avalanche_transfer_15+.json';

instance = JSON.parse(fs.readFileSync(instance, 'utf8'));
schema = JSON.parse(fs.readFileSync(schema, 'utf8'));

const valid = ajv.validate(schema, instance)
if (!valid) console.log(ajv.errors)