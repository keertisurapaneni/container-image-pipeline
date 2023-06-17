# Create a minimal image.
FROM node:15.14.0-buster

# Update and upgrade packages
RUN apt-get update && \
    apt-get -y upgrade

# Install Certificates and Timezone data
RUN apt-get -y install ca-certificates tzdata 
