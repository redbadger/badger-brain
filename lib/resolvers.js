import dateFns from 'date-fns';
import { pathOr } from 'ramda';

export const mapDateTime = fieldName => doc => {
  const timestamp = doc[fieldName];
  if (!timestamp) { return timestamp; }

  const d = new Date(timestamp);

  return {
    iso: timestamp,
    date: dateFns.format(d, 'DD'),
    month: dateFns.format(d, 'MM'),
    monthSym: dateFns.format(d, 'MMMM'),
    year: dateFns.format(d, 'YYYY'),
  };
};

export const mapLinkList = fieldName => doc => {
  const linkList = doc[fieldName];

  if (!linkList) { return []; }
  return linkList.map((link) => {
    if (!link.title || !link.url) {
      return undefined;
    }
    const linkItem = {};
    linkItem.title = link.title || '';
    linkItem.url = link.url || '';
    return linkItem;
  }).filter(l => l !== undefined);
};

export const mapScheduleList = fieldName => doc => {
  const schedule = doc[fieldName];

  if (!schedule) { return []; }
  return schedule.map((item) => {
    const datetime = pathOr('', ['datetime', 'value'], item);
    const text = pathOr('', ['text', 'value'], item);
    if (!datetime || !text) {
      return undefined;
    }
    return { datetime, text };
  }).filter(l => l !== undefined);
};
