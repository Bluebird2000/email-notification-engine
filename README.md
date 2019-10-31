# Notification Engine As A Microservice

Notification engine as a microservices is an architectural style that describes software design as independently deployable, loosely coupled services which are modelled around particular business domain

## Install (Non Docker)

Install the node packages via:

`$ npm install`

And then run the grunt task to compile the TypeScript:

`$ npm run grunt`

## Starting

Install PM2 if not yet installed
`$ npm install pm2 -g`

To start the server run:

`$ pm2 start boot.json`