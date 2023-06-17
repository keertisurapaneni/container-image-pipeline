# https://hub.docker.com/_/microsoft-dotnet-sdk
FROM mcr.microsoft.com/dotnet/sdk:7.0.203-bullseye-slim

# Update and upgrade packages
RUN apt-get update && \
    apt-get -y upgrade && \
    # Install Certificates and Timezone data
    apt-get -y install ca-certificates tzdata