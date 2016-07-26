import { mapDateTime, mapItemList, isValidItem, transformItem } from './resolvers';

describe('Resolvers', () => {
  describe('#mapDateTime', () => {
    it('maps the date field into the expected shape', () => {
      const resolve = mapDateTime('datetime');
      const data = { datetime: '2016-06-08T13:00:00+0100' };

      expect(resolve(data)).to.deep.equal({
        iso: data.datetime,
        date: '08',
        month: '06',
        monthSym: 'June',
        year: '2016',
      });
    });

    it('maps all fields to null when the date field is null', () => {
      const resolve = mapDateTime('datetime');
      const data = { datetime: null };

      expect(resolve(data)).to.deep.equal(data.datetime);
    });
  });

  describe('#isValidItem', () => {
    it('returns true if all fields are truthy', () => {
      const item = {
        foo: {
          type: 'String',
          value: 'foobar',
        },
        bar: {
          type: 'String',
          value: 'barfoo',
        },
      };
      expect(isValidItem(item)).to.equal(true);
    });

    it('returns false with one falsy value', () => {
      const item = {
        foo: {
          text: 'bar',
          value: undefined,
        },
      };
      expect(isValidItem(item)).to.equal(false);
    });

    it('returns false with undefined value', () => {
      const item = {
        foo: undefined,
      };
      expect(isValidItem(item)).to.equal(false);
    });

    it('returns false with an empty object', () => {
      const item = {};
      expect(isValidItem(item)).to.equal(false);
    });
  });

  describe('#transformItem', () => {
    it('handles correctly formatted item', () => {
      const validItem = {
        foo: {
          type: 'Text',
          value: 'FOO',
        },
      };
      const expectedItem = {
        foo: 'FOO',
      };
      expect(transformItem(validItem)).to.deep.equal(expectedItem);
    });

    it('handles and returns an empty object', () => {
      const emptyObject = {};
      expect(transformItem(emptyObject)).to.deep.equal(emptyObject);
    });

    it('handles item with no value property', () => {
      const initialItem = {
        foo: {
          type: 'Text',
        },
      };
      const expectedItem = {
        foo: undefined,
      };
      expect(transformItem(initialItem)).to.deep.equal(expectedItem);
    });
  });

  describe('#mapItemList: "links"', () => {
    let linkList;
    let data;
    let resolve;

    beforeEach(() => {
      linkList = [
        {
          title: {
            value: 'For full details please check out the meetup page',
          },
          url: {
            value: 'http://www.meetup.com/London-React-User-Group/',
          },
        },
      ];

      data = { internalLinks: linkList };
      resolve = mapItemList('internalLinks');
    });

    it('should correctly map list of links', () => {
      expect(resolve(data)).to.deep.equal([{
        title: 'For full details please check out the meetup page',
        url: 'http://www.meetup.com/London-React-User-Group/',
      }]);
    });

    it('should correctly omit empty link document', () => {
      data.internalLinks.push({});

      expect(resolve(data)).to.deep.equal([{
        title: 'For full details please check out the meetup page',
        url: 'http://www.meetup.com/London-React-User-Group/',
      }]);
    });
  });

  describe('#mapItemList: "schedules"', () => {
    let scheduleList;
    let data;
    let resolve;

    beforeEach(() => {
      scheduleList = [
        {
          datetime: { type: 'Timestamp', value: '2016-07-27T23:00:00+0000' },
          text: { type: 'Text', value: 'Pizza' },
        },
        {
          datetime: { type: 'Timestamp', value: '2016-08-27T23:00:00+0012' },
          text: { type: 'Text', value: 'Drinks' },
        },
      ];

      data = { schedule: scheduleList };
      resolve = mapItemList('schedule');
    });

    it('should correctly map list of schedule items', () => {
      expect(resolve(data)).to.deep.equal([
        {
          datetime: '2016-07-27T23:00:00+0000',
          text: 'Pizza',
        },
        {
          datetime: '2016-08-27T23:00:00+0012',
          text: 'Drinks',
        },
      ]);
    });
  });
});
