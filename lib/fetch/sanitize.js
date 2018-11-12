import Prismic from 'prismic.io';
import { pathOr } from 'ramda';
import { expandTimestamp } from '../utilities/dates';
import { imageAssetsEndpoint, defaultEventImage } from '../config';

function makeGetter(json) {
  return key => pathOr(null, ['data', key, 'value'], json);
}

// TODO: move to sanitizing layer TBD.
export function reformatLinkList(linkList) {
  if (!linkList) return [];
  return linkList.map(link => {
    const newLink = {};
    newLink.title = link.label;
    newLink.url = link.link;
    newLink.type = link.type || { value: 'OTHER' };
    return newLink;
  });
}

export function eventImagePath(featureImageFilename) {
  const f = featureImageFilename || defaultEventImage;

  // Check if we already have full URL for the featured image
  if (/\/\//.test(featureImageFilename)) {
    // Check and convert http:// to https://
    return featureImageFilename.replace(/^http:\/\//, 'https://');
  }

  return imageAssetsEndpoint + f;
}

// TODO: Determine correct behaviour and split into two functions.
//       One for Event, one for News.
function sanitizeEventAndNews(item, type) {
  const get = makeGetter(item);
  const imageField = type === 'news' ? 'news-image' : 'featured-image';
  const fallbackImageField = type === 'news' ? 'featureImage' : 'event-image';
  const fallbackFeatureImageFilename = eventImagePath(get(`${type}.${fallbackImageField}`));
  const featureImageFilename = pathOr(
    fallbackFeatureImageFilename,
    ['main', 'url'],
    get(`${type}.${imageField}`)
  );

  return {
    id: item.id,
    slug: item.uid || null,
    tags: item.tags || [],
    eventType: get(`${type}.eventType`),
    title: get(`${type}.title`),
    calendarURL: get(`${type}.calendarURL`),
    strapline: get(`${type}.strapline`),
    featuredEventDescription: get(`${type}.featuredEventDescription`),
    datetime: get(`${type}.timestamp`),
    startDateTime: get(`${type}.timestamp`),
    endDateTime: pathOr(get(`${type}.timestamp`), ['data', `${type}.timestampEnd`, 'value'], item),
    ticketReleaseDate: get(`${type}.ticketReleaseDate`),
    internalLinks: reformatLinkList(get(`${type}.internalLinks`)),
    externalLinks: reformatLinkList(get(`${type}.externalLinks`)),
    tickets: get(`${type}.tickets`) || [],
    body: get(`${type}.body`) || [],
    featureImageFilename,
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
    ticketLink: get(`${type}.ticketLink`),
    streamingLink: get(`${type}.streamingLink`),
    status: get(`${type}.status`),
  };
}

export function sanitizeEvent(item) {
  return sanitizeEventAndNews(item, 'event');
}

export function sanitizeNews(item) {
  // TODO: Test me.
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

export function sanitizeOrganisation(json) {
  const get = makeGetter(json);
  const fallbackOrganisationImage = get('organisation.imageURL');
  const organisationImage = pathOr(
    fallbackOrganisationImage,
    ['main', 'url'],
    get('organisation.organisation-image')
  );
  return {
    id: json.id,
    name: get('organisation.name'),
    description: get('organisation.description'),
    careerBrief: get('organisation.careerBrief'),
    url: get('organisation.URL'),
    imageURL: organisationImage,
    jobs: get('organisation.jobs') || [],
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
    mailingListSummary: get('community.mailingListSummary'),
  };
}

export function sanitizeSpeaker(json) {
  const get = makeGetter(json);
  const fallbackProfileImageURL = get('speaker.imageURL');
  const profileImageURL = pathOr(
    fallbackProfileImageURL,
    ['main', 'url'],
    get('speaker.profile-image')
  );
  return {
    id: json.id,
    name: get('speaker.name'),
    company: get('speaker.company'),
    twitterHandle: get('speaker.twitterHandle'),
    githubHandle: get('speaker.githubHandle'),
    imageURL: profileImageURL,
    bio: get('speaker.bio'),
  };
}

export function sanitizeTicket(json) {
  const get = makeGetter(json);
  return {
    id: json.id,
    title: get('ticket.title'),
    releaseDate: expandTimestamp(get('ticket.releaseDate')),
    price: get('ticket.price'),
    available: get('ticket.available'),
  };
}

const categories = {
  Leadership: { slug: 'leadership', order: 1 },
  Strategy: { slug: 'strategy', order: 2 },
  Delivery: { slug: 'delivery', order: 3 },
  'UX & Design': { slug: 'ux-design', order: 4 },
  Engineering: { slug: 'engineering', order: 5 },
  QA: { slug: 'qa', order: 6 },
  Operations: { slug: 'operations', order: 7 },
  Marketing: { slug: 'marketing', order: 8 },
  Insights: { slug: 'insights', order: 9 },
  Adorable: { slug: 'adorable', order: 10 },
};

export function sanitizeBadger(json) {
  const get = makeGetter(json);
  const name = get('badger.name');
  const sanitizeUrl = url => url && url.replace(/^http:/, 'https:');
  const fallbackPrimaryImageUrl = get('badger.image-url');
  const fallbackSecondaryImageUrl = get('badger.secondary-image-url');
  const primaryImageUrl = pathOr(
    sanitizeUrl(fallbackPrimaryImageUrl),
    ['main', 'url'],
    get('badger.primary-image')
  );
  const secondaryImageUrl = pathOr(
    sanitizeUrl(fallbackSecondaryImageUrl),
    ['main', 'url'],
    get('badger.secondary-image')
  );
  return {
    id: json.id,
    slug: json.uid,
    firstName:
      name &&
      name
        .split(' ')
        .slice(0, -1)
        .join(' '),
    lastName:
      name &&
      name
        .split(' ')
        .slice(-1)
        .join(' '),
    order: get('badger.order'),
    jobTitle: get('badger.job-title'),
    primaryImageUrl,
    secondaryImageUrl,
    startDate: get('badger.start-date'),
    about: get('badger.about'),
    skills: get('badger.skills'),
    influence: get('badger.influence'),
    achievements: get('badger.achievements'),
    linkedin: pathOr(null, ['url'], get('badger.linkedin')),
    github: pathOr(null, ['url'], get('badger.github')),
    twitter: pathOr(null, ['url'], get('badger.twitter')),
    categories: json.tags.reduce((validCategories, category) => {
      if (categories[category]) {
        validCategories.push({ name: category, ...categories[category] });
      }
      return validCategories;
    }, []),
  };
}

export function sanitizeQnA(json) {
  const get = makeGetter(json);
  const category = {
    slug: json.uid,
    name: get('q-and-a-category.category-name'),
    topics: get('q-and-a-category.q-n-a-list'),
    order: get('q-and-a-category.order'),
  };
  return category;
}

export function sanitizeQnATopic(json) {
  const get = makeGetter(json);
  return {
    slug: json.uid,
    question: get('q-and-a.question'),
    answer: new Prismic.Fragments.StructuredText(get('q-and-a.answer')).asHtml(),
    order: get('q-and-a.order'),
  };
}

export function sanitizeWebinar(json) {
  const get = makeGetter(json);

  return {
    id: json.id,
    slug: json.uid,
    title: get('webinar.title'),
    startDateTime: get('webinar.timestamp'),
    endDateTime: pathOr(get('webinar.timestamp'), ['data', 'webinar.timestampEnd', 'value'], json),
    featureImageFilename: pathOr(null, ['main', 'url'], get('webinar.featured-image')),
    body: get('webinar.body') || [],
    speakers: get('webinar.speakers') || [],
    webinarKey: get('webinar.webinar-key'),
  };
}

export function sanitizeEventsBanner(json) {
  const get = makeGetter(json);
  return {
    url: pathOr(null, ['url'], get('event-banner.link')),
    altText: get('event-banner.alt-text') ? get('event-banner.alt-text')[0].text : null,
    campaignName: get('event-banner.campaign-name')
      ? get('event-banner.campaign-name')[0].text
      : null,
    desktopURL: pathOr(null, ['main', 'url'], get('event-banner.desktopURL')),
    tabletURL: pathOr(null, ['main', 'url'], get('event-banner.tabletURL')),
    mobileURL: pathOr(null, ['main', 'url'], get('event-banner.mobileURL')),
  };
}
