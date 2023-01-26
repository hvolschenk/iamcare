# I Am Care

_And now you are, too._

* [Introduction][]
* [Setup][]
  * [Environment variables][]
  * [Startup][]

## Introduction
[Introduction]: #introduction

[I Am Care] is an application designed for giving away you unwanted goods to
someone else who would/could still put it to good use.

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

[docker-compose]: https://docs.docker.com/compose/
[I Am Care]: https://github.com/hvolschenk/iamcare
[Laravel]: https://laravel.com/
