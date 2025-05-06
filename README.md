# iamcare

An online marketplace for giving items away for free.
* [Application][]
* [Development][]
  * [First-time setup][]
    * [Set up environment variables][]
    * [Build development environment][]
    * [Migrate database][]
  * [Starting development environment][]
* [Deploying][]
  * [Prerequisites][]
    * [Domain and hosting][]
    * [Database users][]
    * [FTP account][]
    * [Environment creation][]
    * [Privacy policy][]
  * [First upload][]
    * [Post-upload configuration][]
      * [Set document root][]
      * [Create storage symbolic link][]

## Application
[Application]: #application

The application is hosted on a per-country basis. Currently the following
countries are supported:

| Country      | Domain                |
| ------------ | --------------------- |
| Netherlands  | https://ikbenzorg.nl  |
| South Africa | https://iamcare.co.za |

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

## Deploying
[Deploying]: #deploying

### Prerequisites
[Prerequisites]: #prerequisites

Before being able to deploy, a few things need to be in place:

#### Domain and hosting
[Domain and hosting]: #domain-and-hosting

A domain needs to be purchased for the country in question, plus a shared
hosting package with at least one database and as much storage space as
possible. It's also possible to start with less space and see how fast it grows
with regards to user uploaded images.

#### Database users
[Database users]: #database-users

Two database users need to be created. One for the deployment/migration, and one
as the application database user. They need the following permissions:

* Deployment:
  * `ALTER`
  * `CREATE`
  * `DELETE`
  * `DROP`
  * `INDEX`
  * `INSERT`,
  * `REFERENCES`
  * `SELECT`
  * `UPDATE`
* Application:
  * `DELETE`
  * `INSERT`
  * `SELECT`
  * `UPDATE`

#### FTP account
[FTP account]: #ftp-account

An FTP user should be created which connects to the server user home, which will
connect to the `public_html` (or web root) directory. The application will be
uploaded to this directory.

#### Environment creation
[Environment creation]: #environment-creation

Once all the above setup is complete a [GitHub environment][] needs to be
created. Only repository owners will have access to this, so you can open a
[GitHub issue][] asking for a new environment to be created.
**DO NOT PUT ANY SECRETS IN THE GITHUB ISSUE**

After the environment has been created, a new job needs to be added to the
`/.github/workflows/cd.yml` script to run the given environment during
_continuous delivery_ tasks.

#### Privacy policy
[Privacy policy]: #privacy-policy

A privacy policy for the new region needs to be created and added to the
application in all supported languages.

### First upload
[First upload]: #first-upload

Because of the rather large amount of files it is possible that the first upload
fails. In that case it is recommended that an existing application is manualy
copied over first before letting the deployment script run again.

#### Post-upload configuration
[Post-upload configuration]: post-upload-configuration

After the code is on the server for the first time a few housekeeping tasks need
to be done to get the server ready for first requests.

##### Set document root
[Set document root]: #set-document-root

The document root for your domain needs to be set to the `public/` directory in
order to function properly. If you can set this on your hosting provider that
would be best, otherwise add the following to the `.htaccess` file at the root:

```apacheconf
RewriteEngine on

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

##### Create storage symbolic link
[Create storage symbolic link]: #create-storage-symbolic-link

A symbolic link needs to be created from the `public/` directory to the storage
directory, which lives outside/above the `public/` directory. Run the following
PHP script from the `public/` directory once to create the symbolic link, and
then remove the script:

```php
<?php
    $targetFolder = $_SERVER['DOCUMENT_ROOT'] . '/storage/app/public';
    $linkFolder = $_SERVER['DOCUMENT_ROOT'] . '/public/storage';
    symlink($targetFolder, $linkFolder);
    echo 'Symlink process successfully completed';
```

---

[compose watch]: https://docs.docker.com/compose/how-tos/file-watch/
[Docker]: https://www.docker.com/
[docker compose]: https://docs.docker.com/compose/
[GitHub environment]: https://github.com/hvolschenk/iamcare/settings/environments
[GitHub issue]: https://github.com/hvolschenk/iamcare/issues
[http://localhost:2991/]: http://localhost:2991/
