import R from 'ramda';
import { fetchJob } from '../../fetch';

const getID = R.pathOr('', ['data', 'value', 'document', 'id']);

export default function organisationJobsResolver(
  organisation,
  args,
  ctx,
  info,
  fetch = fetchJob,
) {
  if (!organisation || !Array.isArray(organisation.jobs)) { return []; }
  return organisation.jobs.map(job => {
    const id = getID(job);
    return fetch({ id });
  });
}
