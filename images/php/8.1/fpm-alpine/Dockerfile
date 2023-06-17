# fpm-alpine
FROM php:8.1.20-fpm-alpine

ENV stdout /dev/stdout
ENV stderr /dev/stderr
ENV NEW_RELIC_AGENT_VERSION 10.5.0.317
ENV PHP_EXTRA_CONFIGURE_ARGS --enable-fpm --with-fpm-user=www-data --with-fpm-group=www-data

# Required for supervisor to run, actual process runs as nobody
USER root

# Update and upgrade packages
RUN apk update && \
  apk upgrade && \
  # Install Certificates, Timezone data, and other Packages
  apk --no-cache add ca-certificates && \
  update-ca-certificates && \
  apk --no-cache add tzdata openssl wget nginx supervisor curl

# Easy php package installations via: https://github.com/mlocati/docker-php-extension-installer
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

RUN install-php-extensions gd gettext mysqli odbc opcache pdo_pgsql zip bcmath

# Configure nginx
RUN mkdir -p /etc/nginx/conf.d
COPY nginx/conf.d/vhosts.conf /etc/nginx/conf.d/
COPY nginx/* /etc/nginx/
# Remove default server definition
# RUN rm -rf /etc/nginx/conf.d/default.conf

# Configure PHP-FPM
COPY php-fpm/global.conf /usr/local/etc/php-fpm.d/global.conf
COPY php-fpm/www.conf /usr/local/etc/php-fpm.d/www.conf
# COPY php-fpm/opcache.ini /usr/local/etc/php7/conf.d/opcache.ini
RUN mkdir -p /var/log/php-fpm && \
  mkdir -p /run/php-fpm && \
  chown -R nobody:nobody /run/php-fpm && \
  chown -R nobody:nobody /var/log/php-fpm

# Configure supervisord
COPY supervisor/conf.d/* /etc/supervisor/conf.d/
COPY supervisor/supervisord.conf /etc/supervisor/
RUN mkdir -p /var/log/supervisor && \
  touch /var/log/supervisor/supervisord.log && \
  chown -R nobody:nobody /var/log/supervisor

# Setup document root
RUN mkdir -p /var/www/php

# Make sure files/folders needed by the processes are accessable when they run under the nobody user
RUN chown -R nobody:nobody /var/www/php && \
  chown -R nobody:nobody /run && \
  chown -R nobody:nobody /var/lib/nginx && \
  chown -R nobody:nobody /var/log/nginx

# Make sure that logs are redirected to stderr
RUN ln -sf $stdout /var/log/nginx/access.log && \
  ln -sf $stderr /var/log/nginx/error.log && \
  ln -sf $stderr /var/log/php-fpm/www-error.log

# Install Required glibc library for New Relic
# RUN wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
#   wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.31-r0/glibc-2.31-r0.apk && \
#   apk add glibc-2.31-r0.apk

# Install New Relic
# ARG NEW_RELIC_AGENT_VERSION
RUN curl -L "https://download.newrelic.com/php_agent/archive/${NEW_RELIC_AGENT_VERSION}/newrelic-php5-${NEW_RELIC_AGENT_VERSION}-linux-musl.tar.gz" | tar -C /tmp -zx \
  && export NR_INSTALL_USE_CP_NOT_LN=1 \
  && export NR_INSTALL_SILENT=1 \
  && /tmp/newrelic-php5-*/newrelic-install install \
  && rm -rf /tmp/newrelic-php5-* /tmp/nrinstall*

WORKDIR /var/www/php

# Expose the port nginx is reachable on
EXPOSE 80 443

COPY ./start.sh /start.sh
RUN chmod +x /start.sh

# Let supervisord start nginx & php-fpm
CMD ["/bin/sh", "-c", "/start.sh"]


