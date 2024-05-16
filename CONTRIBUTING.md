# Contributing

Thank you for taking the time to contribute.
Your contribution - however big or small - is greatly appreciated.

- [Developing][]
  - [First-time setup][]
    - [Environment variables][]
    - [Building][]
  - [Starting][]
    - [Watch mode][]
- [Testing][]
  - [API testing][]
  - [Client testing][]
    - [Client format testing][]
    - [Client static tests][]
    - [Client compilation tests][]
    - [Client unit tests][]
- [Source Control][]

## Developing

[Developing]: #developing

To develop on [iamcare][], you will need [Docker][] with [docker-compose][].
These two will be enough to do everything you need.

### First-time setup

[First-time setup]: #first-time-setup

#### Environment variables

[Environment variables]: #environment-variables

All configuration is stored in the root `.env` file, and these values are mapped
into the correct container(s) via [docker-compose][].

This root `.env` file needs to be created by copying the `.env.sample` file and
replacing the missing values:

```console
cp .env.sample .env
```

#### Building

[Building]: #building

Although not strictly necessary, it is useful to build the [Docker][] images
before running them the first time. This is done through [docker-compose][]:

```console
docker-compose build
```

### Starting

[starting]: #starting
[Starting]: #starting

The application can be started through the use of [docker-compose][]:

```console
docker-compose up -d client
```

The client application will then be available at [localhost:7222][].

#### Watch mode

[Watch mode]: #watch-mode

For both the API and client, watch mode can be enabled after [starting][]:

```console
docker-compose watch --no-up
```

_Currently there is an issue where the client will not rebuild when really small
changes are made. If you know how to solve this any help would be greatly
appreciated._

## Testing

[Testing]: #testing

### API testing

[API Testing]: #api-testing

The entire _API_ is tested through endpoints. Tests are only written as
_Feature Tests_ which test calling each endpoint with different inputs, and
asserting the desired output(s).

For the _Feature Tests_ to work, a database needs to be running. To not pollute
the default database with testing data, a `database-testing` service is
available through [docker-compose][]:

```console
docker-compose up -d --no-deps api database-testing
```

Once running, the tests can be run inside the running `api` container:

```console
docker exec -it iamcare-api-1 /bin/sh
```

```console
php artisan test
```

_There is an issue where you have to run `php artisan config:clear` inside the
container first before the test will connect to the database. I you know how to
fix this, help would be greatly appreciated._

### Client testing

[Client testing]: #client-testing

The _Client_ is tested in various ways, each serving a unique purpose.
All test typess can be run in sequence by using the `npm test` command.

All _Client_ tests can be run within the `client` container:

```console
docker-compose run --rm --no-deps client /bin/sh
```

or dependencies can be installed locally within the `/client` folder through
`npm install` and then running the commands locally.

#### Client format testing

[Client format testing]: #client-format-testing

_Client_ file formatting is done through [Prettier][] and can be run via:

```console
npm run test:format
```

It is also possible to let [Prettier][] attempt to automatically fix any
formatting issues it finds via:

```console
npm run test:format:fix
```

#### Client static tests

[Client static tests]: #client-static-tests

Static tests on the _Client_ are invoked through the use of [ESLint][] using the
[eslint-config-airbnb][] ruleset, and can be run via:

```console
npm run test:lint
```

#### Client compilation tests

[Client compilation tests]: #client-compilation-tests

The _Client_ is typed using [TypeScript][]. The [TypeScript][] compiler
([tsc][]) is used to check whether the application will successfully compile
when the build is created. The compilation can be tested via:

```console
npm run test:types
```

#### Client unit tests

[Client unit tests]: #client-unit-tests

_Client_ unit tests are run through [Jest][] and [React Testing Library][]. Unit
tests are built for larger components, or in many cases even full pages. Unit
test coverage is kept at 100%.

Unit tests are written slightly differently to what many are used to, but once
you understand the reasoning it will make sense why it is done like this. `test`
blocks always only contain a single assertion and zero _arranging_ or _acting_.
All test setup is done within a `beforeEach` block preceding the test. This
makes it possible to test multiple branches of the same test given the exact
same starting point.

## Source Control

[Source Control]: #source-control

A few simple rules are in place to make sure commits are clean and have reason
to exist:

- All commits follow the [Angular commit message format][], with the agreed upon
  _scopes_ being `api`, `client` and `database`.
- When updating a branch it must always be _rebased_, and never _merged_. The
  **only** time we merge is when we accept changes into `main`.
- Each commit must be properly independent.
- Each commit should only introduce a single change.
- No commit should target multiple _scopes_.

---

[Angular commit message format]: https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-format
[Docker]: https://www.docker.com/
[docker-compose]: https://docs.docker.com/compose/
[ESLint]: https://eslint.org/
[eslint-config-airbnb]: https://www.npmjs.com/package/eslint-config-airbnb
[iamcare]: https://github.com/hvolschenk/iamcare
[Jest]: https://jestjs.io/
[localhost:7222]: http://localhost:7222
[Prettier]: https://prettier.io/
[React Testing Library]: https://testing-library.com/docs/react-testing-library/intro/
[tsc]: https://www.typescriptlang.org/docs/handbook/compiler-options.html
[TypeScript]: https://www.typescriptlang.org/
