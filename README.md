Badger Brain
============

[![CircleCI](https://circleci.com/gh/redbadger/badger-brain.svg?style=shield)](https://circleci.com/gh/redbadger/badger-brain)
[![Test Coverage](https://coveralls.io/repos/github/redbadger/badger-brain/badge.svg?branch=master)](https://coveralls.io/github/redbadger/badger-brain?branch=master)
[![Code Climate](https://codeclimate.com/github/redbadger/badger-brain/badges/gpa.svg)](https://codeclimate.com/github/redbadger/badger-brain)

GraphQL server for all Red Badger related data.

This project is public, so it's even more important that no sensitive data is
committed to the repository.


## Usage

```sh
npm run start      # Start the dev server
npm run lint       # Run the style linter
npm run test       # Run the tests
npm run test-watch # Run the tests and watch for changes
```

## Secrets
While Prismic integration with Badger Brain is open and will work without any authentication, Hubspot requires an API key.

### To set up the environment variables for Hubspot integration, Follow the instructions of this command:
`make keyrings`

### Go to https://github.com/redbadger/blackbox-secrets/blob/master/README.md and follow instructions to:
- "Getting Blackbox"
- "Get access to existing blackbox secrets"

## Releasing to live

Few easy steps:

* Create and push a new release tag. You can do it [here][releases].
* Generate updated [CHANGELOG][changelog] file and push it to `master` branch.
  Use [Github Changelog Generator][generator] for this. Don't forget to pull
  the latest tags from Github before generating updates to the changelog.
* Navigate to the Red Badger AWS console (Ireland region), Elastic Beanstalk =>
  Badger Brain => Application versions. The idea is that we're only promoting
  app versions that are already deployed to staging env. Select the version
  that is currently deployed to `badger-brain-staging`. Now deploy, choosing
  `badger-brain-live` as the target environment.
* Job done.

[releases]: https://github.com/redbadger/badger-brain/releases
[changelog]: https://github.com/redbadger/badger-brain/blob/master/CHANGELOG.md
[generator]: https://github.com/skywinder/github-changelog-generator

## Ideas

This server will provide GraphQL endpoint for fetching and consuming company
related data. Much like in the famous [Stevey's Google Platforms Rant][rant]
we should be able to have an interface for communicating company data for
whoever decides to consume it.

[rant]: https://gist.github.com/chitchcock/1281611

List of consumers so far:

* red-badger.com site
* React.London

List of data providers:

* Workable
* Prismic.io

## Prismic backup

We send a backup of Prismic data to S3; see the detailed docs [here](prismic-backup-service/README.md).

We also store the Prismic content types as JSON in [`prismic/custom-types`](prismic/custom-types/) (for documentation and potential backup purposes).

```
                    .oys:
                  .:dmmmmmmmddhyo+:.
               -oddy+:-.`` ``..:/ohmdy+-
             -hmmyosyyhhhhyyso+:.   -+ymd+`
        :ydmmmmmmmmmmmmmmmmmmmmmmds`  -hmmd.
       +mmmmmmmmmmmmmmmmmdhyso++/:.   smmmd.
       ymmmmmmmmmdyo/:.`           `:odmy/
       -dmmmmh+-`             `-/ohmds:`
         hms.          `-/oshdmmmmmms
        -mh        ./shmmmmmmmmmmmmmm+
        sm:     .ohmmmmmmmmmmmmmmmmmmm:
        hd`   :ymmmmmmmmmmmmmmmmmmmmmmm:
       `dh  .ymmmmmmmmmmmmmmmmmmmmmmmmmmo`
       `dh :mmmmmmmmmmmmmmmmmmmmmmmmmmmmmms:`
        hmsmmmmmmmmmmmmmmmmmmmmmmmmmmmmmhss+.
        ommmmmmmmmmmmmmmmmmmmmmmmmmmmmmd`
        .mmmmmmmmmmmmmmmmmmmmmmmmmmmmmm/
         ommmmmmmmmmmmmmmmmmmmmmmmmmmm/
         `ymmmmmmmmmmmmmmmmmmmmmmmmmy.
          `ymmmmmmmmmmmmmmmmmmmmmmmy
            +mmmmmmmmm/::mmmmmmmmms`
             .smmmmmmm- .mmmmmmmd:
               `/osyys. `oyyyso-
```

## Licence

Apache Licence. See LICENCE for details.
