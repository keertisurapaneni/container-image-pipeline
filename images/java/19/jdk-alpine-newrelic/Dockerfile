# Java 19 jdk alpine image
FROM amazoncorretto:19.0.2-alpine

# Update and upgrade packages
RUN apk update && \
    apk upgrade && \
    # Install Certificates and Timezone data
    apk --no-cache add ca-certificates && \
    apk --no-cache add tzdata

ENV CONTAINER_PATH "/var/www"
ENV NEW_RELIC_LICENSE_KEY ""
ENV NEW_RELIC_APP_NAME ""
ENV JAVA_OPTS ""
ENV PORT 8080

WORKDIR $CONTAINER_PATH

COPY newrelic/ newrelic/

EXPOSE $PORT

CMD java $JAVA_OPTS -javaagent:$CONTAINER_PATH/newrelic/newrelic.jar -jar *.jar
