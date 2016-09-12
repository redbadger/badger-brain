import always from '../../../test/helpers/promise-always';
import eventPartnersResolver from '.';

describe('resolvers/event-partners', () => {
  it('defaults if no args passed', () => {
    const result = eventPartnersResolver();
    expect(result).to.deep.equal([]);
  });

  it('defaults if no event.partners passed', () => {
    const result = eventPartnersResolver({
      partners: undefined,
    });
    expect(result).to.deep.equal([]);
  });

  it('fetches partners and merges in level', () => {
    const fetch = ({ id }) => {
      if (id !== 64) { throw new Error('Not fetching correct partner'); }
      return always({ aProperty: 'hello!' });
    };
    const event = {
      partners: [
        {
          level: { value: 'Bronze' },
          data: { value: { document: { id: 64 } } },
        },
      ],
    };
    const expectedPartners = [
      {
        aProperty: 'hello!',
        level: 'Bronze',
      },
    ];
    const result = eventPartnersResolver(event, {}, {}, {}, fetch);
    return Promise.all(result).then(resolvedPartners => {
      expect(resolvedPartners).to.deep.equal(expectedPartners);
    });
  });
});
