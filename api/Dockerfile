FROM php:fpm-alpine

RUN apk update && \
  apk add --no-cache \
    freetype freetype-dev \
    git \
    libjpeg-turbo libjpeg-turbo-dev \
    libpng libpng-dev \
    libwebp libwebp-dev \
    zlib-dev

RUN docker-php-ext-configure gd --enable-gd --with-freetype --with-jpeg --with-webp
RUN docker-php-ext-install gd pdo pdo_mysql

COPY --from=composer/composer:latest-bin /composer /usr/local/bin/composer

COPY composer.json composer.lock .
RUN composer install --no-autoloader

COPY . .
RUN composer dump-autoload

CMD ["php", "artisan", "serve", "--host=0.0.0.0"]
