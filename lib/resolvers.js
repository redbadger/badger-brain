import dateFns from 'date-fns';

export const mapDateTime = fieldName => doc => {
  const timestamp = doc[fieldName];
  if (!timestamp) { return timestamp; }

  const d = new Date(timestamp);

  return {
    iso: timestamp,
    date: dateFns.format(d, 'DD'),
    month: dateFns.format(d, 'MM'),
    monthSym: dateFns.format(d, 'MMM'),
    year: dateFns.format(d, 'YYYY'),
  };
};

export const mapLinkList = fieldName => doc => {
  const linkList = doc[fieldName];

  if (!linkList) { return []; }
  return linkList.map((link) => {
    if (!link.hasOwnProperty('title') || !link.hasOwnProperty('url')) {
      return undefined;
    }
    const linkItem = {};
    linkItem.title = link.title || '';
    linkItem.url = link.url || '';
    return linkItem;
  }).filter(l => l !== undefined);
};
