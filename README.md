# I Am Care

_And now you are, too._

* [Introduction][]
* [Setup][]

## Introduction
[Introduction]: #introduction

[I Am Care] is an application designed for giving away you unwanted goods to
someone else who would/could still put it to good use.

## Setup
[Setup]: #setup

All the configuration values required to run the application are mad available
through an `.env` file in the root. To create this file, copy the sample
`.env.sample` file and fill in the missing values:

```sh
$ cp ./.env.sample .env
```

The application can now be started through [docker-compose][]:

```sh
$ docker-compose up -d
```

---

[docker-compose]: https://docs.docker.com/compose/
[I Am Care]: https://github.com/hvolschenk/iamcare
