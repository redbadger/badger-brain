import R from 'ramda';
import { DEFAULT_PARTNER_LEVEL } from '../../event-partner';
import { fetchPartner } from '../../fetch';

const getID = R.pathOr('', ['data', 'value', 'document', 'id']);

const getLevel = R.pathOr(DEFAULT_PARTNER_LEVEL, ['level', 'value']);

export default function communityPartnersResolver(
  event,
  args,
  ctx,
  info,
  fetch = fetchPartner,
) {
  if (!event || !Array.isArray(event.partners)) { return []; }
  return event.partners.map(partner => {
    const id = getID(partner);
    const level = getLevel(partner);
    return fetch({ id }).then(partnerData => ({ ...partnerData, level }));
  });
}
