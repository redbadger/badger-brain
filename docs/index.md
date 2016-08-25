---
layout: default
title: Badger Brain dev docs
---

# Dev docs

This is official dev documentation of the Badger Brain project.

Live GraphiQL interface: [http://brain.red-badger.com/graphql](http://brain.red-badger.com/graphql)

Staging GraphiQL interface: [http://brain-staging.red-badger.com/graphql](http://brain-staging.red-badger.com/graphql)

## Introduction and purpose

Badger Brain is a GraphQL server. It has GraphiQL interface for testing and exploring the API. It is a self documented server - you can simply browse what GraphiQL has to offer, and every query or a parameter will have a description.

Badger Brain is a public GraphQL interface providing data about Red Badger company. At the moment of writing you can request following data:

* Social events
* Company news
* Event partners
* Communities
* Event talks
* Event speakers

Purpose of the Badger Brain is to serve all public (and potentially private) information about the company to whoever might be interested to consume it. If we ever decide to include private information in the schema, that will require some sort of authentication mechanism.

## Clients

At the moment of writing, there are following client apps depending on Badger Brain:

* [Website Next](https://github.com/redbadger/website-next)
* [React.London](https://github.com/redbadger/react.london/)

New features of Badger Brain are largely dictated by the needs of clients. It should not however implement purely client based features, but instead aim at providing unified consistent interface through all features.


