#### This project was created using [themetalfleece/nodejs-typescript-template](https://github.com/themetalfleece/nodejs-typescript-template)

# A Node.js API client for [BrightSkyAPI](https://brightsky.dev)

[![CD/CI](https://github.com/mplabs/bright-sky-api/actions/workflows/test-and-build.yml/badge.svg)](https://github.com/mplabs/bright-sky-api/actions/workflows/test-and-build.yml)

This library provides a Node.js API interface to [BrightSkyAPI](https://brightsky.dev).

## Install

1. Install [node.js](https://nodejs.org/en/download/).
2. Clone this repository, and using a terminal navigate to its directory.
3. Run `npm ci` to install the dependencies.

## Build & Run

1. Run `npm build` to build the files.
2. Run `npm test` to test the library.

## Usage

```
import BrightSkyAPI from 'bright-sky-api'
import fetch from 'node-fetch'

const api = BrightSkyAPI({ fetch })
const weather = await api.currentWeather({ lat: '50.51', lon: '13.42' })

```

## Developing

### Visual Studio Code

-   Installing the Eslint (`dbaeumer.vscode-eslint`) and Prettier - Code formatter (`esbenp.prettier-vscode`) extensions is recommended.

## Linting & Formatting

-   Run `npm lint` to lint the code.
-   Run `npm format` to format the code.

## Testing

-   Run `npm test` to execute all tests.
-   Run `npm run test:watch` to run tests in watch (loop) mode.
-   Run `npm run test:coverage` to see the tests coverage report.
