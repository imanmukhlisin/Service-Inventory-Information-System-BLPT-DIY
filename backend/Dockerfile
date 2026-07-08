FROM php:8.2-fpm

# Install dependensi sistem & PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Expose port (biasanya artisan serve pake 8000, atau pakai fpm di 9000)
# Biar gampang buat development, kita jalankan artisan serve
CMD php artisan serve --host=0.0.0.0 --port=8000
