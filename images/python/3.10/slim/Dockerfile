# Create a minimal image.
FROM python:3.10.13-slim

# Update and upgrade packages
RUN apt-get update && \
    apt-get upgrade -y && \
    # Install Certificates and Timezone data
    apt-get -y install  ca-certificates tzdata

# Create and use a non-root user
RUN groupadd -r app && \
    useradd -r -g app -s /sbin/nologin -c "Docker image user" app && \
    mkdir /app && chown -R app:app /app/
USER app


