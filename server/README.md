# server

Here we define our API server. This is a pretty typical, mostly production ready web server running express. The interesting part is this:

```ts
const pollsApi = decorateExpressRouter({
  schema: pollsApiSchema,
  onValidationError: validationErrorHandler,
});
```

We create a special express router for the `pollsApiSchema` by providing the schema, and in this case overriding the default error handler.

Now we can mount the pollsApi router and provide handlers:

```ts
app.use('/api', pollsApi);
pollsApi.get('/polls', getPollsRouteHandler);
pollsApi.post('/polls', postPollsRouteHandler);
pollsApi.get('/polls/:id', getPollByIdRouteHandler);
pollsApi.post('/polls/:id/choices', postChoiceRouteHandler);
pollsApi.post('/polls/:id/choices/:choiceId/vote', postVoteRouteHandler);
```

The type checking on `.get` and `.post` will not allow me to provide handlers for routes I have not defined. It will also provide type hints and autocomplete suggestions for the available routes.

We import the route handlers from `src/routes/polls.ts` where we define them as follows:

```ts
export const getPollsRouteHandler = createRequestHandler(
  pollsApiSchema,
  'GET',
  '/polls',
  async (req, res) => {
    res.json({ polls: await pollsRepo.getPolls() });
  }
);
```

We use the `createRequestHandler` to return a well typed route handler. It also strictly enforces the types we provide in the handling function for the last argument, based on the previous three.

The enhanced request handler provides the following benefits:
* It does not compile when we miss any properties in the object provided to `res.json`.
* It removes any additional properties provided to `res.json`. This mitigates against leaking sensitive information.

Throughout our code we use the types from `shared/http` such as:

* In the persistence layer:
```ts
import { Choice, ChoiceInput, Poll, PollInput } from 'api-schema';

export type PollsRepo = {
  getPolls: () => Promise<Poll[]>;
  getPollById: (id: number) => Promise<Poll | undefined>;
  getChoicesByPollId: (pollId: number) => Promise<Choice[]>;
  createPoll: (poll: PollInput) => Promise<Poll>;
  createChoiceForPoll: (choice: ChoiceInput, pollId: number) => Promise<Choice>;
  addVoteForChoice: (pollId: number, choiceId: number) => Promise<Poll>;
};
```

* In the domain layer:
```ts
import {Poll} from 'api-schema';

type ValidateChoiceOutcome = 'VALID' | 'INVALID_POLL_TYPE' | 'DUPLICATE_CHOICE';

export const validateChoiceForPoll = (choiceText: string, poll: Poll): ValidateChoiceOutcome => {
  if (poll.type === 'OPEN') {
    if (poll.choices.map(c => c.text).includes(choiceText)) {
      return 'DUPLICATE_CHOICE';
    }
    return 'VALID';
  }
  return 'INVALID_POLL_TYPE';
}
```

### Read next:

1. [`client`](https://github.com/Antman261/http-schemas-webserver-demo/tree/main/client)

