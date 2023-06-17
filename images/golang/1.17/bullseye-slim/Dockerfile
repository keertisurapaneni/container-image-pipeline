# Create a minimal image
FROM debian:bullseye-slim

ENV PATH /usr/local/go/bin:$PATH

# Install Certificates and Timezone data
RUN set -ex && \
  apt-get update && \
  apt-get -y install ca-certificates tzdata curl && \
  echo "export PATH=$PATH:/usr/local/go/bin" >> /etc/profile.d/go.sh && \
  curl -vLO https://golang.org/dl/go1.17.linux-amd64.tar.gz && \
  tar -C /usr/local -xzf go1.17.linux-amd64.tar.gz && \
  rm go1.17.linux-amd64.tar.gz && \
  apt-get -y remove curl && \
  apt-get clean && \
  apt-get -y autoremove && \
  groupadd -r app && \
  # this is a build image, so the user needs to have a shell
  useradd -r -g app -s /sbin/nologin -c "Docker image user" app && \
  mkdir /app && chown -R app:app /app/

ENV GOPATH /go
ENV PATH $GOPATH/bin:$PATH
RUN mkdir -p "$GOPATH/src" "$GOPATH/bin" && chmod -R 777 "$GOPATH"
WORKDIR $GOPATH

USER app