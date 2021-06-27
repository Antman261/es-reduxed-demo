# client

Similar to the server, we can utilise our `api-schema` types throughout the client code. Additionally, we can use a client api package provided by `http-schemas` to:
* Add type checking to our path parameters and json request bodies.
* Add type information to the response data returned from our API.

We initialise this api client in `src/apiClient.ts`:

```ts
import {createHttpClient} from "http-schemas/client";
import {pollsApiSchema} from "api-schema";

const baseURL = 'http://localhost:8080/api';

export const apiClient = createHttpClient(pollsApiSchema, { baseURL });

```

Now we can use it in hooks, such as this one that drives most of the client-side logic:

```ts
export const usePolls = (apiClient: HttpClient<typeof pollsApiSchema>): UsePollsReturn => {
  const [status, setStatus] = useState<PollsStatus>('READY');
  const [polls, setPolls ] = useState<Poll[]>([]);
  const refreshPolls = async () => {
    if (status === 'LOADING') {
      return;
    }
    setStatus('LOADING');
    const result = await apiClient.get('/polls'); // <= Result is { polls: Poll[] }
    setPolls(result.polls);
    setStatus('READY');
  }
  // REMAINDER TRUNCATED FOR BREVITY
```

These types can now flow through to the rest of our code, for example here's a snippet of the `Poll.tsx` component:

```tsx
import * as React from "react";
import {Button, Card, CardBody, CardHeader, Table} from "reactstrap";
import {Poll} from "api-schema";
import {ChoiceRow} from "./ChoiceRow";
import {useState} from "react";
import {ChoiceForm} from "./ChoiceForm";

type Props = Poll & {
  createChoiceVoteClickHandler: (choiceId: number) => () => void;
  onSubmit: (text: string) => void;
};

export const PollCard = ({id, text, type, choices, createChoiceVoteClickHandler, onSubmit}: Props) => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  return (
    <Card key={id} className='my-4'>
      <CardHeader>
        {type === 'OPEN' ? (
          <Button className='float-right mt-1'
                  color='primary'
                  onClick={() => setIsFormOpen(true)}>
            Add Choice
          </Button>
        ) : (
          <small className='float-right mt-4 text-muted'>This poll is fixed. You cannot add choices.</small>
        )}
        {
          // TRUNCATED FOR BREVITY
        }
```

## Conclusion

That's it! You've read through the full explanation. Feel free to start this project up and play with it yourself. I hope you find the development experience enjoyable!
