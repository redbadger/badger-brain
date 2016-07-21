import { mapDateTime, mapLinkList, mapScheduleList } from './resolvers';

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

  describe('#mapLinkList', () => {
    let linkList;
    let data;
    let resolve;

    beforeEach(() => {
      linkList = [
        {
          title: 'For full details please check out the meetup page',
          url: 'http://www.meetup.com/London-React-User-Group/',
        },
      ];

      data = { internalLinks: linkList };
      resolve = mapLinkList('internalLinks');
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

  describe('#mapScheduleList', () => {
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
      resolve = mapScheduleList('schedule');
    });

    it('should correctly map list of links', () => {
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
