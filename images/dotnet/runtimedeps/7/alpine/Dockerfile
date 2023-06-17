# https://hub.docker.com/_/microsoft-dotnet-runtime-deps/
FROM mcr.microsoft.com/dotnet/runtime-deps:7.0.5-alpine3.17

# Update and upgrade packages
RUN apk update && \
    apk upgrade && \
    # Install Certificates and Timezone data
    apk --no-cache add ca-certificates && \
    apk --no-cache add tzdata

# Create and use a non-root user
RUN apk add shadow && \
    groupadd -r app && \
    useradd -r -g app -s /sbin/nologin -c "Docker image user" app && \
    mkdir /app && chown -R app:app /app/
USER app


