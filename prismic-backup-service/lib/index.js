const fetch = require('node-fetch');
const leftPad = require('./left-pad');
const saveJson = require('./s3').saveJson;

const prismicApiURL = 'https://rb-website-stage.prismic.io/api';
const timestamp = new Date().toISOString().substring(0, 10);

function saveMetadata(bucketName, metadata, funcs) {
  const name = `${timestamp}-prismic-backup/metadata.json`;
  return funcs.saveJson(bucketName, name, metadata);
}

function savePrismicData(bucketName, json, funcs) {
  const name = `${timestamp}-prismic-backup/page-${leftPad(json.page, 3)}.json`;
  return funcs.saveJson(bucketName, name, json);
}

function updateMetadata(metadata, data) {
  return {
    totalDocuments: data.total_results_size,
    seenDocuments: (metadata.seenDocuments || 0) + data.results.length,
    totalPages: data.total_pages,
    date: timestamp,
  };
}

function getJson(url) {
  return fetch(url)
    .then(res => res.json());
}

function getDocumentReference(funcs) {
  return funcs.getJson(prismicApiURL)
    .then((res) => {
      const masterRef = res.refs.find((ref) => ref.isMasterRef).ref;
      if (!masterRef) {
        throw Error('Failed to get the master ref');
      }
      return masterRef;
    });
}

function loop(bucketName, json, metadata, funcs) {
  return savePrismicData(bucketName, json, funcs).then(() => {
    const newMetadata = updateMetadata(metadata, json);

    if (json.next_page) {
      return funcs.getJson(json.next_page)
        .then((newJson) => loop(bucketName, newJson, newMetadata, funcs));
    }
    return newMetadata;
  });
}

const defaultFuncs = {
  getJson,
  saveJson,
};

module.exports = function backupPrismic(bucketName, passedFuncs) {
  const funcs = passedFuncs || defaultFuncs;
  return getDocumentReference(funcs)
    .then(ref => `${prismicApiURL}/documents/search?ref=${ref}&page=1&pageSize=100`)
    .then(prismicURL => funcs.getJson(prismicURL))
    .then(json => loop(bucketName, json, {}, funcs))
    .then(metadata => saveMetadata(bucketName, metadata, funcs));
};
