import { pathOr } from 'ramda';

function makeGetter(json) {
  return key => pathOr(null, ['data', key, 'value'], json);
}

// TODO: move to sanitizing layer TBD.
export function reformatLinkList(linkList) {
  if (!linkList) return [];
  return linkList.map((link) => {
    const newLink = {};
    newLink.title = link.label;
    newLink.url = link.link;
    newLink.type = link.type || { value: 'OTHER' };
    return newLink;
  });
}

// TODO: Determine correct behaviour and split into two functions.
//       One for Event, one for News.
function sanitizeEventAndNews(item, type) {
  const get = makeGetter(item);
  const imageField = (type === 'news') ? 'featureImage' : 'event-image';
  return {
    id: item.id,
    slug: item.slug || null,
    tags: item.tags || [],
    eventType: get(`${type}.eventType`),
    title: get(`${type}.title`),
    strapline: get(`${type}.strapline`),
    datetime: get(`${type}.timestamp`),
    startDateTime: get(`${type}.timestamp`),
    endDateTime: pathOr(get(`${type}.timestamp`),
      ['data', `${type}.timestampEnd`, 'value'], item),
    ticketReleaseDate: get(`${type}.ticketReleaseDate`),
    ticketsAvailable: get(`${type}.ticketsAvailable`) || false,
    waitingListOpen: get(`${type}.waitingListOpen`) || false,
    internalLinks: reformatLinkList(get(`${type}.internalLinks`)),
    externalLinks: reformatLinkList(get(`${type}.externalLinks`)),
    body: get(`${type}.body`) || [],
    featureImageFilename: get(`${type}.${imageField}`),
    talks: get('event.talks') || [],
    schedule: get(`${type}.schedule`) || [],
    sponsors: get(`${type}.sponsors`) || [],
    partners: get(`${type}.partners`) || [],
    location: {
      address: get('event.address'),
      coordinates: {
        longitude: pathOr(null, ['longitude'], get('event.location')),
        latitude: pathOr(null, ['latitude'], get('event.location')),
      },
    },
  };
}

export function sanitizeEvent(item) {
  return sanitizeEventAndNews(item, 'event');
}

export function sanitizeNews(item) { // TODO: Test me.
  return sanitizeEventAndNews(item, 'news');
}

export function sanitizeTalk(json) {
  const get = makeGetter(json);
  return {
    id: json.id,
    title: get('talk.title'),
    summary: get('talk.summary'),
    speakers: get('talk.speakers'),
  };
}

export function sanitizePartner(json) {
  const get = makeGetter(json);
  return {
    id: json.id,
    name: get('partner.name'),
    level: get('partner.level'),
    description: get('partner.description'),
    partnerURL: get('partner.partnerURL'),
    imageURL: get('partner.imageURL'),
    jobs: get('partner.jobs') || [],
  };
}

export function sanitizeCommunity(json) {
  const get = makeGetter(json);
  return {
    id: json.id,
    title: get('community.title'),
    summary: get('community.summary'),
    mailingListTitle: get('community.mailingListTitle'),
    events: get('community.events'),
    featuredEvent: get('community.featuredEvent'),
    mailingListSummary: get('community.mailingListSummary'),
  };
}

export function sanitizeSpeaker(json) {
  const get = makeGetter(json);
  return {
    id: json.id,
    name: get('speaker.name'),
    company: get('speaker.company'),
    twitterHandle: get('speaker.twitterHandle'),
    githubHandle: get('speaker.githubHandle'),
    blogURL: get('speaker.blogURL'),
    imageURL: get('speaker.imageURL'),
  };
}
