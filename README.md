# dapla-user-access-admin

[![Build Status](https://dev.azure.com/statisticsnorway/Dapla/_apis/build/status/statisticsnorway.dapla-user-access-admin?branchName=master)](https://dev.azure.com/statisticsnorway/Dapla/_build/latest?definitionId=130&branchName=master)

This application is built for in-house use in Statistics Norway and it aims to create a user interface against
[dapla-user-access](https://github.com/statisticsnorway/dataset-access), somewhat supported by
[dapla-catalog](https://github.com/statisticsnorway/dapla-catalog).

Functionality includes:

* Creating, editing and listing users, groups and roles

### Try this application locally

The first time you clone the repository, remember to run `yarn` or `yarn install`.

Run `yarn start` and navigate to `http://localhost:3000/`.

`yarn test` runs all tests and `yarn coverage` calculates (rather unreliably) test coverage.

### Docker locally

* `yarn build`
* `docker build -t dapla-user-access-admin .`
* `docker run -p 8000:8180 dapla-user-access-admin:latest`
    * Alternatively with custom environment
      variables: `docker run -p 8000:8180 -e REACT_APP_API_AUTH=http://localhost:20101 dapla-user-access-admin:latest`
* Navigate to `http://localhost:8000`

**Note** that this application
requires [dapla-project localstack](https://github.com/statisticsnorway/dapla-project/blob/master/localstack/README.md)
running to function locally.

### TODO:

* Add ability to delete users/groups/roles (maybe in bulk?)
