# Create a minimal image
FROM golang:1.20.12-alpine

ENV PATH /usr/local/go/bin:$PATH

# Update and upgrade packages 
RUN apk update && \
    apk upgrade && \
    # Install Certificates and Timezone data
    apk --no-cache add ca-certificates && \
    apk --no-cache add tzdata

# Create and use a non-root user
RUN apk add shadow && \
    groupadd -r app && \
    useradd -r -g app -s /sbin/nologin -c "Docker image user" app && \
    mkdir /app && chown -R app:app /app/

ENV GOPATH /go
ENV PATH $GOPATH/bin:$PATH
RUN mkdir -p "$GOPATH/src" "$GOPATH/bin" && chmod -R 777 "$GOPATH"
WORKDIR $GOPATH

USER app

