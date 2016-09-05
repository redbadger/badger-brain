const fetch = require('node-fetch');
const leftPad = require('./left-pad');

const prismicURL = 'https://rb-website-stage.prismic.io/api/documents/search?ref=V80_SyMAAKhGWsDT&page=1&pageSize=100';
const timestamp = new Date().toISOString().substring(0, 10);

function saveMetadata(metadata, funcs) {
  console.log('metadata', metadata);
}

function updateMetadata(metadata, json) {
  return metadata;
}

function makeName(json) {
  return `prismic-data-${timestamp}-page-${leftPad(json.page, 3)}.json`;
}

function save(json, funcs) {
  funcs.saveJson(makeName(json), json);
  return new Promise(resolve => {
    resolve(json);
  });
}

function saveJson(name, data) {
  console.log('saved', name);
}

function getJson(url) {
  return fetch(url)
    .then(res => res.json());
}

function loop(json, metadata, funcs) {
  console.log(json);
  return save(json, funcs).then(() => {
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
