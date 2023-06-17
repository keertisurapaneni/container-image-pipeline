# https://hub.docker.com/_/microsoft-dotnet-sdk
FROM mcr.microsoft.com/dotnet/sdk:6.0.408-alpine3.17

# Update and upgrade packages
RUN apk update && \
    apk upgrade && \
    # Install Certificates and Timezone data
    apk --no-cache add ca-certificates && \
    apk --no-cache add tzdata