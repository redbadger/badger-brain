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

function extractEventbriteId(url) {
  /* Extract a string of digets that is preceeded by a -
     and is not followed by a - or letter
     look behinds are not supported so I extract
     a substring without the - */
  const regex = /-\d*(?!-|\d|\w)/;
  const extracted = regex.exec(url)[0];
  return extracted.substr(1, extracted.length - 1);
}

function isEventbriteUrl(url) {
  // Does the url contain eventbrite followed by a .
  const regex = /eventbrite\./;
  return regex.test(url);
}
// TODO: Determine correct behaviour and split into two functions.
//       One for Event, one for News.
function sanitizeEventAndNews(item, options) {
  const get = makeGetter(item);
  const { type } = options;
  const imageField = type === 'news' ? 'news-image' : 'featured-image';
  const fallbackImageField = type === 'news' ? 'featureImage' : 'event-image';
  const fallbackFeatureImageFilename = eventImagePath(
    get(`${type}.${fallbackImageField}`)
  );
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
    endDateTime: pathOr(
      get(`${type}.timestamp`),
      ['data', `${type}.timestampEnd`, 'value'],
      item
    ),
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
    eventbriteId: isEventbriteUrl(get(`${type}.ticketLink`))
      ? extractEventbriteId(get(`${type}.ticketLink`))
      : null,
    streamingLink: get(`${type}.streamingLink`),
    status: get(`${type}.status`),
  };
}

export function sanitizeEvent(item) {
  return sanitizeEventAndNews(item, { type: 'event' });
}

export function sanitizeNews(item) {
  // TODO: Test me.
  return sanitizeEventAndNews(item, { type: 'news' });
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
    blogURL: get('speaker.blogURL'),
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
  'advisory board': { slug: 'advisory-board', order: 2 },
  Strategy: { slug: 'strategy', order: 3 },
  Delivery: { slug: 'delivery', order: 4 },
  'UX & Design': { slug: 'ux-design', order: 5 },
  Engineering: { slug: 'engineering', order: 6 },
  QA: { slug: 'qa', order: 7 },
  Operations: { slug: 'operations', order: 8 },
  Marketing: { slug: 'marketing', order: 9 },
  Insights: { slug: 'insights', order: 10 },
  Adorable: { slug: 'adorable', order: 11 },
};

function hasBlogPosts(slug, authors) {
  return authors.includes(slug);
}

export function sanitizeBadger(json, options) {
  const { blogAuthors } = options;
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
    hasBlogPosts: hasBlogPosts(json.uid, blogAuthors),
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
    answer: new Prismic.Fragments.StructuredText(
      get('q-and-a.answer')
    ).asHtml(),
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
    endDateTime: pathOr(
      get('webinar.timestamp'),
      ['data', 'webinar.timestampEnd', 'value'],
      json
    ),
    featureImageFilename: pathOr(
      null,
      ['main', 'url'],
      get('webinar.featured-image')
    ),
    body: get('webinar.body') || [],
    speakers: get('webinar.speakers') || [],
    webinarKey: get('webinar.webinar-key'),
  };
}

export function sanitizeEventsBanner(json) {
  const get = makeGetter(json);
  return {
    url: pathOr(null, ['url'], get('event-banner.link')),
    altText: get('event-banner.alt-text')
      ? get('event-banner.alt-text')[0].text
      : null,
    campaignName: get('event-banner.campaign-name')
      ? get('event-banner.campaign-name')[0].text
      : null,
    desktopURL: pathOr(null, ['main', 'url'], get('event-banner.desktopURL')),
    tabletURL: pathOr(null, ['main', 'url'], get('event-banner.tabletURL')),
    mobileURL: pathOr(null, ['main', 'url'], get('event-banner.mobileURL')),
  };
}

export function sanitizeBlogPosts(json) {
  if (json) {
    let blogAuthor = {};
    if (json.blog_author) {
      blogAuthor = {
        id: json.blog_author.id,
        displayName: json.blog_author.display_name,
        email: json.blog_author.email,
        gravatarUrl: json.blog_author.gravatar_url,
        slug: json.blog_author.slug,
      };
    }
    return {
      id: json.id,
      name: json.title,
      state: json.state,
      slug: json.slug,
      url: json.url,
      author: json.author,
      authorAt: json.author_at,
      authorEmail: json.author_email,
      authorName: json.author_name,
      blogAuthor,
      campaign: json.campaign,
      campaignName: json.campaign_name,
      metaDescription: json.meta_description,
      postBody: json.post_body,
      postListContent: json.post_list_content,
      postSummary: json.post_summary,
      tagIds: json.tag_ids,
    };
  }
  return null;
}

function sanitizeHubspotFormFields(fields) {
  return fields.map(field => {
    const richTextContent = field.richText.content
      ? field.richText.content
      : null;
    let result;
    if (field.fields.length) {
      const fieldData = field.fields[0];
      result = {
        name: fieldData.name,
        label: fieldData.label,
        fieldType: fieldData.fieldType,
        description: fieldData.description ? fieldData.description : null,
        defaultValue: fieldData.defaultValue ? fieldData.defaultValue : null,
        placeholder: fieldData.placeholder ? fieldData.placeholder : null,
        required: fieldData.required,
        enabled: fieldData.enabled,
        hidden: fieldData.hidden,
        labelHidden: fieldData.labelHidden,
        richText: richTextContent,
      };
    } else {
      result = {
        name: null,
        label: null,
        fieldType: null,
        description: null,
        defaultValue: null,
        placeholder: null,
        required: false,
        enabled: false,
        hidden: false,
        labelHidden: false,
        richText: richTextContent,
      };
    }

    return result;
  });
}

export function sanitizeHubspotForm(json) {
  if (json) {
    return {
      portalId: json.portalId,
      guid: json.guid,
      name: json.name,
      cssClass: json.cssClass,
      submitText: json.submitText,
      inlineMessage: json.inlineMessage,
      formFields: sanitizeHubspotFormFields(json.formFieldGroups),
    };
  }
  return null;
}
