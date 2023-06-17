# Create a minimal image
FROM nginx:1.24.0-alpine

# Update and upgrade packages 
RUN apk update && \
    apk upgrade && \
    # Install Certificates and Timezone data
    apk --no-cache add ca-certificates && \
    apk --no-cache add tzdata
