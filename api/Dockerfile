FROM php:fpm-alpine

RUN docker-php-ext-install mysqli

COPY --from=composer/composer:latest-bin /composer /usr/local/bin/composer
