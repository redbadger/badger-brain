const fs = require('fs');
const json = require('./Dockerrun.aws.example.json');

json.Image.Name = process.argv[2];

fs.writeFileSync('Dockerrun.aws.json', JSON.stringify(json, null, 2), 'utf8');
