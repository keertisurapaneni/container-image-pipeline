[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Container image pipeline provides us scanned Docker images with fewer high-severity vulnerabilities. The images are continually scanned and new images are released if a better recommendation is found by Snyk. Also, when new version of an image is released and you are using the old version created by the pipeline; it automatically creates a PR in your repo to update the version of the image. All you have to do is review and merge it! :)

**Note: Below is the old architecture for the pipeline, we are using Dockerhub in the new code instead of Snyk**

Here is the complete flow of the legacy pipeline:

![container_image_pipeline_cicd-a7a2137a91841329623c9ec110adaece](https://github.com/keertisurapaneni/container-image-pipeline/assets/1882178/470396f0-b587-4bc3-8dc0-d9487752cdc0)


Github Actions
Github Actions handles the CI/CD portion of the pipeline. We have 3 different workflows setup in RedVentures/container-image-pipeline repo which get triggered based on the below Github events:

**Pull request**

Everytime a PR is opened/edited/reopened/synchronized in the repo (including Snyk PRs) and a Dockerfile is getting modified, Github Actions will run a workflow to build the new image and test this new image. It gets triggered for both modified or completely new Dockerfiles. If the workflow fails, it is recommended you fix your PR code.

For Snyk PRs, it also verifies if the base image that is getting changed in a certain Dockerfile is within the scope of the image version in the folder structure. For example, Let's say Snyk wants to upgrade the image present in images/golang/1.15/alpine/Dockerfile, here are two scenarios based on the PR change:

- Valid PR scenario: If Snyk PR wants to upgrade from golang-1.15.6-alpine to golang-1.15.9, it is a valid PR since the version in folder structure (1.15) seems to be present in the base image (golang-1.15.9). The workflow then proceeds to the build and test steps.

- Invalid PR scenaio: If Snyk PR wants to upgrade from golang-1.15.6-alpine to golang-1.16.0, it is an invalid PR since the version in folder structure (1.15) doesn't seem to be present in the base image (golang-1.16.0). The workflow closes the PR and deletes the PR branch for us. 🎉

**Push**

Once we review and merge the PR to the master branch, it will trigger a Github Actions workflow which looks at all modifed/new Dockerfiles and for each Dockerfile, it creates a new Git tag+release. The versioning is handled by Semantic release for mono repo.

**Release**

Once a Git release is created, the final Github actions workflow is triggered. This workflow builds the image, pushes the image to Artifactory and ECR, creates automatic PRs in all repos using the image to replace any image tag with latest image tag, updates README.md with latest image info and sends Slack notifications.

You can find more details on the sequence of this workflow below:

![container_image_pipeline_flowchart-739c1896d1282e3158ffbe4908d99369](https://github.com/keertisurapaneni/container-image-pipeline/assets/1882178/7f3ddd9c-1f4b-4e3c-84fd-4825ffbb4e18)



Latest released images:
-----------------

| Image          | Latest released image   | Base image          | Release Date   |
| :------------- | :-----------------------| :------------------ |:---------------|
| Alpine 3 base      | rv-alpine-3:1.2.12 | alpine:3.18.0 | 05-16-2023 19:19:03 |
| Dotnet aspnet 6 alpine | rv-dotnet-aspnet-6-alpine:1.1.6 | dotnet/aspnet:6.0.16-alpine3.17 | 04-25-2023 10:59:40 |
| Dotnet aspnet 6 slim | rv-dotnet-aspnet-6-slim:1.1.6 | dotnet/aspnet:6.0.16-bullseye-slim | 04-25-2023 11:00:13 |
| Dotnet aspnet 7 alpine | rv-dotnet-aspnet-7-alpine:1.0.5 | dotnet/aspnet:7.0.5-alpine3.17 | 04-25-2023 11:00:41 |
| Dotnet aspnet 7 slim | rv-dotnet-aspnet-7-slim:1.0.5 | dotnet/aspnet:7.0.5-bullseye-slim | 04-25-2023 11:01:16 |
| Dotnet runtimedeps 6 alpine | rv-dotnet-runtimedeps-6-alpine:1.0.6 | dotnet/runtime-deps:6.0.16-alpine3.17 | 04-25-2023 11:01:39 |
| Dotnet runtimedeps 6 slim | rv-dotnet-runtimedeps-6-slim:1.0.5 | dotnet/runtime-deps:6.0.16-bullseye-slim | 04-25-2023 11:02:18 |
| Dotnet runtimedeps 7 alpine | rv-dotnet-runtimedeps-7-alpine:1.0.5 | dotnet/runtime-deps:7.0.3-alpine3.17 | 03-09-2023 15:18:02 |
| Dotnet runtimedeps 7 slim | rv-dotnet-runtimedeps-7-slim:1.0.5 | dotnet/runtime-deps:7.0.5-bullseye-slim | 04-25-2023 11:02:48 |
| Dotnet sdk 6 alpine | rv-dotnet-sdk-6-alpine:1.1.5 | dotnet/sdk:6.0.408-alpine3.17 | 04-25-2023 11:04:08 |
| Dotnet sdk 6 slim | rv-dotnet-sdk-6-slim:1.1.4 | dotnet/sdk:6.0.408-bullseye-slim | 04-25-2023 11:04:37 |
| Dotnet sdk 7 alpine | rv-dotnet-sdk-7-alpine:1.0.3 | dotnet/sdk:7.0.203-alpine3.17 | 04-25-2023 11:04:50 |
| Dotnet sdk 7 slim | rv-dotnet-sdk-7-slim:1.0.5 | dotnet/sdk:7.0.203-bullseye-slim | 04-25-2023 11:04:53 |
| Golang 1.15 alpine | rv-golang-1.15-alpine:1.0.5 | golang:1.15.15-alpine | 03-08-2023 19:54:43 |
| Golang 1.15 buster | rv-golang-1.15-buster:1.0.3 | golang:1.15.15-buster | 03-08-2023 20:12:01 |
| Golang 1.16 alpine | rv-golang-1.16-alpine:1.0.7 | golang:1.16.15-alpine | 03-08-2023 20:27:30 |
| Golang 1.16 buster | rv-golang-1.16-buster:1.0.6 | golang:1.16.15-buster | 03-08-2023 21:07:50 |
| Golang 1.17 alpine | rv-golang-1.17-alpine:1.0.3 | golang:1.17.13-alpine | 03-08-2023 20:43:51 |
| Golang 1.17 bullseye-slim | rv-golang-1.17-bullseye-slim:1.0.1 | debian:bullseye-slim | 03-09-2023 16:59:37 |
| Golang 1.17 buster | rv-golang-1.17-buster:1.0.2 | golang:1.17.13-buster | 03-08-2023 21:04:56 |
| Golang 1.19 alpine | rv-golang-1.19-alpine:1.0.10 | golang:1.19.10-alpine | 06-14-2023 13:10:21 |
| Golang 1.19 bullseye | rv-golang-1.19-bullseye:1.0.10 | golang:1.19.10-bullseye | 06-14-2023 13:10:26 |
| Golang 1.19 buster | rv-golang-1.19-buster:1.0.9 | golang:1.19.9-buster | 05-03-2023 16:42:56 |
| Java 11 jdk-buster-newrelic | rv-java-11-jdk-buster-newrelic:1.0.4 | openjdk:11.0.16-jdk-buster | 03-07-2023 18:18:50 |
| Java 15 jdk-buster-newrelic | rv-java-15-jdk-buster-newrelic:1.0.3 | openjdk:15.0.2-jdk-buster | 03-07-2023 18:06:48 |
| Java 16 jdk-buster-newrelic | rv-java-16-jdk-buster-newrelic:1.0.3 | openjdk:16.0.2-jdk-buster | 03-07-2023 17:47:21 |
| Java 17 jdk-buster-newrelic | rv-java-17-jdk-buster-newrelic:1.0.3 | openjdk:17.0.2-jdk-buster | 03-07-2023 17:37:19 |
| Java 18 jdk-buster-newrelic | rv-java-18-jdk-buster-newrelic:1.0.3 | openjdk:18.0.2-jdk-buster | 03-07-2023 18:13:59 |
| Node 12 alpine     | rv-node-12-alpine:1.0.5 | node:12.22.12-alpine | 03-03-2023 16:15:38 |
| Node 12 buster     | rv-node-12-buster:1.0.3 | node:12.22.12-buster | 03-03-2023 20:51:35 |
| Node 14 alpine     | rv-node-14-alpine:1.0.13 | node:14.21.3-alpine | 03-03-2023 20:01:19 |
| Node 14 buster     | rv-node-14-buster:1.0.12 | node:14.21.3-buster | 03-03-2023 19:53:47 |
| Node 15 alpine     | rv-node-15-alpine:1.0.5 | node:15.14.0-alpine | 03-03-2023 19:57:18 |
| Node 15 buster     | rv-node-15-buster:1.0.3 | node:15.14.0-buster | 03-03-2023 20:58:53 |
| Node 16 alpine | rv-node-16-alpine:1.0.11 | node:16.20.0-alpine | 04-06-2023 19:32:59 |
| Node 16 buster | rv-node-16-buster:1.0.11 | node:16.20.0-buster | 04-06-2023 19:58:21 |
| Node 18 alpine | rv-node-18-alpine:1.0.9 | node:18.16.0-alpine | 04-21-2023 11:15:36 |
| Node 18 bullseye | rv-node-18-bullseye:1.0.10 | node:18.15.0-bullseye | 03-08-2023 19:01:02 |
| Php 7.4 buster-minimal | rv-php-7.4-buster-minimal:1.0.10 | php:7.4.33-buster | 03-06-2023 21:18:43 |
| Php 7.4 fpm-alpine | rv-php-7.4-fpm-alpine:1.0.12 | php:7.4.26-fpm-alpine | 06-07-2023 17:49:08 |
| Php 7.4 fpm-buster-minimal | rv-php-7.4-fpm-buster-minimal:1.0.10 | php:7.4.33-fpm-buster | 03-06-2023 19:05:12 |
| Php 8.0 buster-minimal | rv-php-8.0-buster-minimal:1.0.13 | php:8.0.29-buster | 06-14-2023 11:23:07 |
| Php 8.0 fpm-alpine | rv-php-8.0-fpm-alpine:1.0.11 | php:8.0.28-fpm-alpine | 03-03-2023 20:38:28 |
| Php 8.0 fpm-buster-minimal | rv-php-8.0-fpm-buster-minimal:1.0.14 | php:8.0.29-fpm-buster | 06-14-2023 10:45:36 |
| Php 8.1 buster-minimal | rv-php-8.1-buster-minimal:1.0.12 | php:8.1.20-buster | 06-14-2023 09:46:02 |
| Php 8.1 fpm-alpine | rv-php-8.1-fpm-alpine:1.0.18 | php:8.1.20-fpm-alpine | 06-14-2023 10:47:18 |
| Php 8.1 fpm-buster-minimal | rv-php-8.1-fpm-buster-minimal:1.0.12 | php:8.1.20-fpm-buster | 06-14-2023 09:45:57 |
| Python 3.10 buster  | rv-python-3.10-buster:1.0.7 | python:3.10.12-buster | 06-14-2023 11:31:38 |
| Python 3.10 slim    | rv-python-3.10-slim:1.0.7 | python:3.10.12-slim | 06-14-2023 11:31:13 |
| Python 3.7 buster  | rv-python-3.7-buster:1.0.9 | python:3.7.17-buster | 06-14-2023 11:24:06 |
| Python 3.7 slim    | rv-python-3.7-slim:1.0.11 | python:3.7.17-slim | 06-07-2023 19:37:49 |
| Python 3.8 buster  | rv-python-3.8-buster:1.0.8 | python:3.8.16-buster | 03-03-2023 19:10:26 |
| Python 3.8 slim    | rv-python-3.8-slim:1.0.11 | python:3.8.17-slim | 06-14-2023 11:35:06 |
| Python 3.9 buster  | rv-python-3.9-buster:1.0.12 | python:3.9.17-buster | 06-14-2023 11:32:12 |
| Python 3.9 slim    | rv-python-3.9-slim:1.0.13 | python:3.9.17-slim | 06-14-2023 11:31:58 |
| Golang 1.16 bullseye | rv-golang-1.16-bullseye:1.0.1 | golang:1.16.15-bullseye | 03-08-2023 20:36:25 |
| Golang 1.17 bullseye | rv-golang-1.17-bullseye:1.0.1 | golang:1.17.13-bullseye | 03-08-2023 20:49:58 |
| Java 11 jdk-alpine-newrelic | rv-java-11-jdk-alpine-newrelic:1.0.3 | amazoncorretto:11.0.18-alpine | 03-06-2023 20:12:38 |
| Java 11 jdk-amazon-newrelic | rv-java-11-jdk-amazon-newrelic:1.0.4 | amazoncorretto:11.0.19 | 04-21-2023 11:12:20 |
| Java 15 jdk-alpine-newrelic | rv-java-15-jdk-alpine-newrelic:1.0.2 | amazoncorretto:15.0.2-alpine | 03-06-2023 20:22:31 |
| Java 15 jdk-amazon-newrelic | rv-java-15-jdk-amazon-newrelic:1.0.1 | amazoncorretto:15.0.2 | 03-06-2023 20:18:21 |
| Java 16 jdk-alpine-newrelic | rv-java-16-jdk-alpine-newrelic:1.0.2 | amazoncorretto:16.0.2-alpine | 03-06-2023 20:33:18 |
| Java 16 jdk-amazon-newrelic | rv-java-16-jdk-amazon-newrelic:1.0.1 | amazoncorretto:16.0.2 | 03-06-2023 20:28:53 |
| Java 17 jdk-alpine-newrelic | rv-java-17-jdk-alpine-newrelic:1.0.3 | amazoncorretto:17.0.6-alpine | 03-06-2023 20:44:00 |
| Java 17 jdk-amazon-newrelic | rv-java-17-jdk-amazon-newrelic:1.0.3 | amazoncorretto:17.0.7 | 04-21-2023 11:06:19 |
| Java 18 jdk-alpine-newrelic | rv-java-18-jdk-alpine-newrelic:1.0.2 | amazoncorretto:18.0.2-alpine | 03-06-2023 20:56:30 |
| Java 18 jdk-amazon-newrelic | rv-java-18-jdk-amazon-newrelic:1.0.1 | amazoncorretto:18.0.2 | 03-06-2023 20:50:53 |
| Java 19 jdk-alpine-newrelic | rv-java-19-jdk-alpine-newrelic:1.0.3 | amazoncorretto:19.0.2-alpine | 03-06-2023 21:11:47 |
| Java 19 jdk-amazon-newrelic | rv-java-19-jdk-amazon-newrelic:1.0.2 | amazoncorretto:19.0.2 | 03-06-2023 21:07:51 |
| Java 19 jdk-bullseye-newrelic | rv-java-19-jdk-bullseye-newrelic:1.0.1 | openjdk:19-jdk-bullseye | 03-09-2023 16:01:30 |
| Php 8.2 fpm-alpine | rv-php-8.2-fpm-alpine:1.0.8 | php:8.2.7-fpm-alpine3.17 | 06-14-2023 11:26:03 |
| Nginx 1.24 alpine | rv-nginx-1.24-alpine:1.0.0 | nginx:1.24.0-alpine | 04-19-2023 12:13:49 |
| Nginx 1.24 bullseye | rv-nginx-1.24-bullseye:1.0.0 | nginx:1.24.0 | 04-19-2023 12:15:39 |
| Golang 1.20 alpine | rv-golang-1.20-alpine:1.0.1 | golang:1.20.5-alpine | 06-14-2023 13:09:43 |



Image info:
-------------------

**Alpine image**
- Base image: Contains updates, certs and tzdata, uses a non-root user "app"

**Golang image**
- Buster image: Contains certs and tzdata
- Alpine image: Contains updates, certs and tzdata, uses a non-root user "app"

**Node image**
- Buster image: Contains certs and tzdata
- Alpine image: Contains updates, certs and tzdata, uses a non-root user "app"

**Python image**
- Buster image: Contains certs and tzdata
- Slim image: Contains updates, certs and tzdata, uses a non-root user "app"

**Dotnet image**
- sdk image: Contains certs and tzdata
- aspnet image: Contains updates, certs and tzdata, uses a non-root user "app"
- runtimedeps image (**RECOMMENDED**): Contains updates, certs and tzdata, uses a non-root user "app"

**Php image**
- Buster image (cli distribution): Minimal image, contains certs and tzdata
- fpm-buster image: Minimal image, contains certs and tzdata
- fpm-alpine image (**RECOMMENDED**): A fully featured image for production php web applications with optimized defaults for fpm, nginx, and supervisor and other RV standards such as New Relic built in.

**Jave image**
- jdk-buster image: Image includes the default new relic deployment


