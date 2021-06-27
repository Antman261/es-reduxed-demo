# Event Sourcing Reduxified Demo

This repository serves as a demonstration of using server-side redux to implement a simplified [event sourcing](https://martinfowler.com/eaaDev/EventSourcing.html) model.

It demonstrates:
* Using redux to build an in-memory read model built from a sequence of events
* Using pg-listen to receive events in response to newly persisted events
* Using a single push multiple subscriber model to create high available eventually consistent read models that scales horizontally

## Getting started

First clone the repo:

```bash
git clone https://github.com/Antman261/event-sourcing-reduxified-demo
```

then run the bootstrap script to install all dependencies:

```bash
cd event-sourcing-reduxified-demo
npm run bootstrap
```

To start all repos in watch mode:
```bash
npm run start
```

This will start the local client on port 3000 and the API on port 8080. This lets you use create-react-app's hot-reloading development server while working on the client.

To serve the client from the webserver, run `npm run build` inside the `client` directory. This will place a production build of the *client* in `server/build/client` for the webserver to serve.
