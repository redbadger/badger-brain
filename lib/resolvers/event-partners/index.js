import R from 'ramda';
import { DEFAULT_PARTNER_LEVEL } from '../../event-partner';
import { fetchOrganisation } from '../../fetch';

const getID = R.pathOr('', ['data', 'value', 'document', 'id']);

const getLevel = R.pathOr(DEFAULT_PARTNER_LEVEL, ['level', 'value']);

export default function eventPartnersResolver(
  event,
  args,
  ctx,
  info,
  fetch = fetchOrganisation,
) {
  if (!event || !Array.isArray(event.partners)) { return []; }
  return event.partners.map(partner => {
    const id = getID(partner);
    const level = getLevel(partner);
    return fetch({ id }).then(partnerData => ({ ...partnerData, level }));
  });
}
