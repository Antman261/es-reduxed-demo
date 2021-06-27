# shared/http

Here we define the API schema for consumption for both the client and the server. Because it is used by both client and server, we have to build it like a client-side npm package.

We include this package in each project's `package.json` as follows:
```json
  "dependencies": {
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "helmet": "^4.6.0",
    "api-schema": "file:../shared/http", // <= this bit here
    "http-schemas": "^0.9.1",
    "morgan": "^1.10.0"
  }
```

Install the shared schema package via the filesystem with this command `npm i ../shared/http`.

## Important files
* [src/schema.ts](https://github.com/Antman261/http-schemas-webserver-demo/blob/main/shared/http/src/schema.ts) defines the API Schema.
* [src/types.ts](https://github.com/Antman261/http-schemas-webserver-demo/blob/main/shared/http/src/types.ts) defines the types.
* [src/index.ts](https://github.com/Antman261/http-schemas-webserver-demo/blob/main/shared/http/src/index.ts) prepares the parts we need to export for the client and server.

### The types

We've defined separate input and output (request and response) types for each idea we are modelling. So while the data model simple put, contains `Poll` objects with contain an array of `Choice`s which themselves contain a count of votes, we don't necessarily have or need all the data when creating an object.

Let's consider the poll object. Let's model it fully, representing how we might store it in a database:

```ts
export const Poll = t.object({
  text: t.string,
  type: PollTypes,
  choices: t.array(Choice),
  id: t.number,
});
```

While this might look right at first, lets consider a `POST` request to `/polls` to create this object. 

``` 
POST /api/polls HTTP/1.1
Content-Type: application/json
Host: localhost:8080
Content-Length: 97

{
  "text": "Is this poll good?",
  "type": "OPEN",
  "choices": [
    "Yes", "No", "Maybe"
  ]
}
```

We can't supply the ID for the poll since it doesn't exist yet, nor does it make sense to provide a choice id or a vote count when creating a poll.

Instead we create a simplified input type:

```ts
export const PollInput = t.object({
  text: t.string,
  type: PollTypes,
  choices: t.array(ChoiceInput),
});
```

Now we only specify the minimum required data for the request. But what about ensuring consistency for the types we do share between input and output? This is why we use the spread operator to reuse these types in the real `Poll` definition:

```ts
export const Poll = t.object({
  ...PollInput.properties,
  choices: t.array(Choice),
  id: t.number,
});
```

It only specifies what is different between input and output.

### Read next:

1. [`server`](https://github.com/Antman261/http-schemas-webserver-demo/tree/main/server)
1. [`client`](https://github.com/Antman261/http-schemas-webserver-demo/tree/main/client)
