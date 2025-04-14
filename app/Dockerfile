FROM php:8.4-fpm-alpine

RUN apk update && \
  apk add --no-cache \
    autoconf \
    freetype freetype-dev \
    g++ \
    git \
    libjpeg-turbo libjpeg-turbo-dev \
    imagemagick-dev \
    libpng libpng-dev \
    libwebp libwebp-dev \
    make \
    zlib-dev

RUN pecl install imagick

RUN docker-php-ext-enable imagick
RUN docker-php-ext-configure gd --enable-gd --with-freetype --with-jpeg --with-webp
RUN docker-php-ext-install exif gd pdo pdo_mysql

COPY --from=composer/composer:latest-bin /composer /usr/local/bin/composer

COPY composer.json composer.lock .
RUN composer install --no-autoloader

COPY . .
RUN composer dump-autoload

CMD ["php", "artisan", "serve", "--host=0.0.0.0"]
