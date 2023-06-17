# https://hub.docker.com/_/microsoft-dotnet-sdk
FROM mcr.microsoft.com/dotnet/sdk:7.0.203-alpine3.17

# Install Certificates and Timezone data
RUN apk --no-cache add ca-certificates && \
    apk --no-cache add tzdata
