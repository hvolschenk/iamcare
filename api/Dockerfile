FROM php:fpm-alpine

RUN apk update && apk add --no-cache git

RUN docker-php-ext-install pdo pdo_mysql

COPY --from=composer/composer:latest-bin /composer /usr/local/bin/composer
COPY . .
RUN composer install

CMD ["php", "artisan", "serve", "--host=0.0.0.0"]
