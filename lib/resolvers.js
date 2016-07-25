import dateFns from 'date-fns';

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

/*
  Checks the validity of an item in a list before transforming.
    1.) Must have keys.
    2.) All keys must have values.
 */
export const isValidItem = item => {
  const itemKeys = Object.keys(item);
  if (itemKeys.length === 0
      || itemKeys.some(key => !item[key] || !item[key].value)) {
    return false;
  }
  return true;
};

export const transformItem = item =>
  Object.keys(item).reduce((obj, key) =>
    Object.assign({}, obj, { [key]: item[key].value })
  , {});

export const mapItemList = fieldName => doc => {
  const itemList = doc[fieldName];
  if (!itemList) return [];
  return itemList.reduce((list, item) => {
    if (!isValidItem(item)) return list;
    return list.concat(transformItem(item));
  }, []);
};
