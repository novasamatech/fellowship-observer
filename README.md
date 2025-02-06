# Fellowship observer
This project is a TypeScript application that automates Fellowship members and Salary cycles bump on Polkadot Collective chain.

## Configuration
The application requires a configuration file located at [src/config/conf.ts](src/config/conf.ts). This file contains the necessary configuration options for the application to run.

## Required Environment Variables
The following environment variable is required for the application to function:

`BUMP_ACCOUNT_MNEMONIC` - the mnemonic for the account that will be used to make bumps.

## Running the Application
The application is designed to be run on a schedule using GitHub Actions.

Install dependency:
```bash
yarn install
```

Run the app:
```bash
yarn start:fellowship
```

## License
Fellowship Observer is available under the Apache 2.0 license. See the LICENSE file for more info.
© Novasama Technologies GmbH 2025