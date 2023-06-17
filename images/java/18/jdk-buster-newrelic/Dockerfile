# Java jdk buster iamge with newrelic.
FROM openjdk:18.0.2-jdk-buster

ENV CONTAINER_PATH "/var/www"
ENV NEW_RELIC_LICENSE_KEY ""
ENV NEW_RELIC_APP_NAME ""
ENV JAVA_OPTS ""
ENV PORT 8080

# Update and upgrade packages
RUN apt-get update && \
    apt-get -y upgrade && \
    # Install Certificates and Timezone data
    apt-get -y install ca-certificates tzdata

WORKDIR $CONTAINER_PATH

COPY newrelic/ newrelic/

EXPOSE $PORT

CMD java $JAVA_OPTS -javaagent:$CONTAINER_PATH/newrelic/newrelic.jar -jar *.jar
