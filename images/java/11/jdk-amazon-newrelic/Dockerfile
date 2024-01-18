# Java 11 jdk image
FROM amazoncorretto:11.0.22

RUN yum update -y --security

ENV CONTAINER_PATH "/var/www"
ENV NEW_RELIC_LICENSE_KEY ""
ENV NEW_RELIC_APP_NAME ""
ENV JAVA_OPTS ""
ENV PORT 8080

WORKDIR $CONTAINER_PATH

COPY newrelic/ newrelic/

EXPOSE $PORT

CMD java $JAVA_OPTS -javaagent:$CONTAINER_PATH/newrelic/newrelic.jar -jar *.jar
