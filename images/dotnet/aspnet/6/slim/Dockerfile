# https://hub.docker.com/_/microsoft-dotnet-aspnet/
FROM mcr.microsoft.com/dotnet/aspnet:6.0.16-bullseye-slim

# Update and upgrade packages
RUN apt-get update && \
    apt-get -y upgrade && \
    # Install Certificates and Timezone data
    apt-get -y install ca-certificates tzdata

# Create and use a non-root user
RUN groupadd -r app && \
    useradd -r -g app -s /sbin/nologin -c "Docker image user" app && \
    mkdir /app && chown -R app:app /app/
USER app


