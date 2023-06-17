# Create a minimal image
FROM node:12.22.12-buster

# Update and upgrade packages
RUN apt-get update && \
    apt-get -y upgrade

# Install Certificates and Timezone data
RUN apt-get -y install ca-certificates tzdata
