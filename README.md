# iamcare

_A place for sharing._

- [Introduction][]
- [Setup][]
  - [Environment variables][]
  - [Startup][]

## Introduction

[Introduction]: #introduction

[iamcare] is an application designed for giving away you unwanted goods to
someone else who would/could still put it to good use, and for finding and
taking things you are interested in.

## Availability

[AVailability]: #availability

[iamcare][] is currently available in the following countries:

- South Africa ([iamcare.co.za][])

Adding more countries are always possible. If you'd like it in your country,
[create an issue][] and then we can talk about the logistics of doing so.

## Setup

[Setup]: #setup

### Environment variables

[Environment variables]: #environment-variables

Most configuration values required to run the application are made available
through an `.env` file in the root. To create this file, copy the sample
`.env.sample` file and fill in the missing values:

```sh
$ cp ./.env.sample .env
$ cp ./api/.env.example ./api/.env
$ cp ./api/.env.example ./api/.env.testing
```

In `./api/.env.testing` the `DB_HOST` needs to be set, but `DB_PASSWORD` should
be the same as the normal database so should not need to be touched.

### Startup

[Startup]: #startup

The application can now be started through [docker-compose][]:

```sh
$ docker-compose up -d
```

---

[create an issue]: https://github.com/hvolschenk/iamcare/issues/new
[docker-compose]: https://docs.docker.com/compose/
[iamcare]: https://github.com/hvolschenk/iamcare
[iamcare.co.za]: https://iamcare.co.za
[Laravel]: https://laravel.com/
