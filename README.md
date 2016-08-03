Badger Brain
============

[![CircleCI](https://circleci.com/gh/redbadger/badger-brain.svg?style=shield)](https://circleci.com/gh/redbadger/badger-brain)
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

## Releasing to live

Few easy steps:

* Create and push a new release tag. You can do it [here][releases].
* Generate updated [CHANGELOG][changelog] file and push it to `master` branch.
  Use [Github Changelog Generator][generator] for this. Don't forget to pull
  the latest tags from Github before generating updates to the changelog.
* Navigate to AWS console, EB => Badger Brain => App versions. The idea is
  that we're only promoting app versions that are already deployed to staging
  env. Find a current version that is on staging right now and deploy it to
  LIVE.
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
