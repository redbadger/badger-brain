# Badger Brain

GraphQL server for all Red Badger related data.

This project is public. No sensitive data should be committed to the repository.

## Releasing to live

Few easy steps:

* Create and push a new release tag. You can do it [here](https://github.com/redbadger/badger-brain/releases)
* Generate updated [CHANGELOG](https://github.com/redbadger/badger-brain/blob/master/CHANGELOG.md) file and push it to `master` branch. Use [Github Changelog Generator](https://github.com/skywinder/github-changelog-generator) for this. Don't forget to pull the latest tags from Github before generating updates to the changelog.
* Navigate to AWS console, EB => Badger Brain => App versions. The idea is that we're only promoting app versions that are already deployed to staging env. Find a current version that is on staging right now and deploy it to LIVE.
* Job done

## Ideas

This server will provide GraphQL endpoint for fetching and consuming company related data. Much like in the famous [Stevey's Google Platforms Rant](https://gist.github.com/chitchcock/1281611) we should be able to have an interface for communicating company data for whoever decides to consume it.

List of consumers so far:

* red-badger.com site

List of data providers:

* Workable
* Prismic.io

```
​                    .oys:
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
