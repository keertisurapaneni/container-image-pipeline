# Create a minimal image.
FROM python:3.10.12-buster

# Update and upgrade packages
RUN apt-get update && \
    apt-get -y upgrade && \
    # Install Certificates and Timezone data
    apt-get -y install ca-certificates tzdata

# Install Certificates and Timezone data.
RUN apt-get -y install ca-certificates tzdata


