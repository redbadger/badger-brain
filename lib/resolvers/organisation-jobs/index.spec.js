import always from '../../../test/helpers/promise-always';
import organisationJobsResolver from '.';

describe('resolvers/organisation-jobs', () => {
  it('defaults if no args passed', () => {
    const result = organisationJobsResolver();
    expect(result).to.deep.equal([]);
  });

  it('defaults if no organisation.jobs passed', () => {
    const result = organisationJobsResolver({
      jobs: undefined,
    });
    expect(result).to.deep.equal([]);
  });

  it('fetches jobs', () => {
    const fetch = ({ id }) => {
      if (id !== 64) { throw new Error('Not fetching correct job'); }
      return always({ JobProperty: 'hello!' });
    };
    const organisation = {
      title: 'Red Badger',
      jobs: [
        {
          data: { value: { document: { id: 64 } } },
        },
      ],
    };
    const expectedJobs = [
      {
        JobProperty: 'hello!',
      },
    ];
    const result = organisationJobsResolver(organisation, {}, {}, {}, fetch);
    return Promise.all(result).then(resolvedPartners => {
      expect(resolvedPartners).to.deep.equal(expectedJobs);
    });
  });
});
