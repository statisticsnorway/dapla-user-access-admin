# user-access-admin
[![Build Status](https://drone.prod-bip-ci.ssb.no/api/badges/statisticsnorway/user-access-admin/status.svg)](https://drone.prod-bip-ci.ssb.no/statisticsnorway/user-access-admin)

This application aims to create a user interface for interacting with [dapla-user-access-service](https://github.com/statisticsnorway/dataset-access).

Functionality includes:
* Creating and editing users
* Creating, ediding and listing groups
* Creating, editing and listing roles
* Checking different access rights on datasets for any given user with any given group/role

The project makes limited use of the [Component library for SSB](https://github.com/statisticsnorway/ssb-component-library)
and is based upon [react-reference-app](https://github.com/statisticsnorway/fe-react-reference-app).

### Try this application locally
The first time you clone the repository, remember to run `yarn install`.

Run `yarn start` and navigate to `http://localhost:3000`.

`yarn test` runs all tests and `yarn coverage` calculates (rather unreliably) test coverage.

### Docker locally
* `yarn build`
* `docker build -t user-access-admin .`
* `docker run -p 8000:80 user-access-admin:latest`
* Navigate to `http://localhost:8000`

**Note** that this application requires [dapla-project localstack](https://github.com/statisticsnorway/dapla-project/blob/master/localstack/README.md)
running to function locally.
