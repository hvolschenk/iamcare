# iamcare

An online marketplace for giving items away for free.

* [Development][]
  * [First-time setup][]
    * [Set up environment variables][]
    * [Build development environment][]
    * [Migrate database][]
  * [Starting development environment][]

## Development
[Development]: #development

### First-time setup
[First-time setup]: #first-time-setup

#### Set up environment variables
[Set up environment variables]: #set-up-environment-variables

Copy the `/.env.sample` file to `/.env` and fill in the missing values:

```sh
cp ./.env.sample ./.env
```

#### Build development environment
[Build development environment]: #build-development-environment

Build the [Docker][] containers using [docker compose][]:

```sh
docker compose build
```

#### Migrate database
[Migrate database]: #migrate-database

To run the database migrations,
the `database` and the `app` services have to be started first.

```sh
docker compose up -d --no-deps app database
```

Check that the database is running and started up with:

```sh
docker compose logs -f database
```

Once started you can run the migrations through the `app` service:

```sh
docker exec {app_container_name} php artisan migrate
```

Where `{app_container_name}` can be obtained through:

```sh
docker compose ps
```

After the migrations have run you can kill the `database` and `app` services:

```sh
docker compose down
```

### Starting development environment
[Starting development environment]: #starting-development-environment

The development environment can be started through [docker compose][]:

```sh
docker compose up -d
```

After which the application is available on [http://localhost:2991/][].

Because the application runs inside a [Docker][] container, changes you make
will not be available inside the container until the container is rebuilt. To
synchronise local changes into the running container you can make use of
[compose watch][]:

```sh
docker compose watch --no-up
```

---

[compose watch]: https://docs.docker.com/compose/how-tos/file-watch/
[Docker]: https://www.docker.com/
[docker compose]: https://docs.docker.com/compose/
[http://localhost:2991/]: http://localhost:2991/
