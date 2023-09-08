# Create a minimal image
FROM golang:1.19.13-bullseye

# Update and upgrade packages
RUN apt-get update && \
    apt-get -y upgrade && \
    # Install Certificates and Timezone data
    apt-get -y install ca-certificates tzdata
