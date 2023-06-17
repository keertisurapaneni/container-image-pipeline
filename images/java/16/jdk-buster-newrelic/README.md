# Java 16 Base Image

The base image includes the default new relic deployment:

* New Relic APM support using the Java agent configuration.

## Usage

Example usage:

```
FROM your-registry.company.com/java-16

ENV NEW_RELIC_LICENSE_KEY "<YOUR LICENSE KEY>"
ENV NEW_RELIC_APP_NAME "<APPLICATION NAME>"
ENV JAVA_OPTS "" # Any additional java opts you would like to include
ENV PORT 8080 # If your application port differs from the default 8080

WORKDIR $CONTAINER_PATH

COPY . $CONTAINER_PATH
```

## Environment Variables

### New Relic Specific

To enable New Relic, you simply add 2 environment variables to the runtime of the app using this image:

* `NEW_RELIC_APP_NAME`
* `NEW_RELIC_LICENSE_KEY`

If those variables are provided, you should see metrics start flowing into New Relic within minutes.

## Overriding New Relic configuration

If you have a complete configuration you want to overwrite, you will need to copy your custom `newrelic.yml` into the docker image.

```
COPY some-stuff/newrelic.yml newrelic/newrelic.yml
```
