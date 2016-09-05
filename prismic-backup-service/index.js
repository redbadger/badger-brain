const fetch = require('node-fetch');
const leftPad = require('./left-pad');
const { saveJson } = require('./s3');

const prismicURL = 'https://rb-website-stage.prismic.io/api/documents/search?ref=V80_SyMAAKhGWsDT&page=1&pageSize=100';
const timestamp = new Date().toISOString().substring(0, 10);

function saveMetadata(metadata, funcs) {
  const name = `${timestamp}-prismic-backup/metadata.json`;
  return funcs.saveJson(name, metadata);
}

function savePrismicData(json, funcs) {
  const name = `${timestamp}-prismic-backup/page-${leftPad(json.page, 3)}.json`;
  return funcs.saveJson(name, json);
}

function updateMetadata(metadata, json) {
  return metadata;
}

function getJson(url) {
  return fetch(url)
    .then(res => res.json());
}

function loop(json, metadata, funcs) {
  console.log(json);
  return savePrismicData(json, funcs).then(() => {
    const newMetadata = updateMetadata(metadata, json);

    if (json.next_page) {
      return funcs.getJson(json.next_page)
        .then((newJson) => loop(newJson, newMetadata, funcs));
    }
    return newMetadata;
  });
}

function handleError(err) {
  console.error(err);
}

const defaultFuncs = {
  getJson,
  saveJson,
};

module.exports = function backupPrismic(passedFuncs) {
  const funcs = passedFuncs || defaultFuncs;
  return funcs.getJson(prismicURL)
    .then(json => loop(json, {}, funcs))
    .then(saveMetadata)
    .catch(handleError);
};

// backupPrismic();
