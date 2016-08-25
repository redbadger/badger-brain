import dateFns from 'date-fns';

export const expandTimestamp = timestamp => {
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
