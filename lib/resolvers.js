import dateFns from 'date-fns';

export const mapDateTime = fieldName => doc => {
  const timestamp = doc[fieldName];
  const date = new Date(timestamp);

  return {
    iso: timestamp,
    date: timestamp ? dateFns.format(date, 'DD') : null,
    month: timestamp ? dateFns.format(date, 'MM') : null,
    monthSym: timestamp ? dateFns.format(date, 'MMM') : null,
    year: timestamp ? dateFns.format(date, 'YYYY') : null,
  };
};

export const mapLinkList = fieldName => doc => {
  const linkList = doc[fieldName];

  if (linkList) {
    return linkList.map((link) => {
      const linkItem = {};
      if (!link.hasOwnProperty('label') || !link.hasOwnProperty('link')) {
        return undefined;
      }
      linkItem.title = (link.label && link.label.hasOwnProperty('value')) ?
        link.label.value : '';
      linkItem.url = (link.link && link.link.hasOwnProperty('value')) ?
        link.link.value : '';
      return linkItem;
    }).filter(l => l !== undefined);
  }

  return [];
};
