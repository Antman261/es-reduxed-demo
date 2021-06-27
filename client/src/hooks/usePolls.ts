import {HttpClient} from "http-schemas/client";
import {ErrorBody, Poll, pollsApiSchema} from "api-schema";
import {useEffect, useState} from "react";

export type PollsStatus = 'LOADING' | 'READY';

type UpdatePollHandler = (pollId: string, poll: Poll | ErrorBody) => void;
type AddPollHandler = (poll: Poll | ErrorBody) => void;

type UsePollsReturn = [Poll[], PollsStatus, () => void, UpdatePollHandler, AddPollHandler];

export const usePolls = (apiClient: HttpClient<typeof pollsApiSchema>): UsePollsReturn => {
  const [status, setStatus] = useState<PollsStatus>('READY');
  const [polls, setPolls ] = useState<Poll[]>([]);
  const refreshPolls = async () => {
    if (status === 'LOADING') {
      return;
    }
    setStatus('LOADING');
    const result = await apiClient.get('/polls');
    setPolls(result.polls);
    setStatus('READY');
  }
  const updatePollById: UpdatePollHandler = (pollId, poll) => {
    // if (isPollResponse(result)) {
    // @ts-ignore
    if (poll.error) {
      console.error(poll);
      return;
    }
    const newPolls = [...polls];
    const pollIdx = newPolls.findIndex(p => p.id === pollId);

    // @ts-ignore
    // Something is wrong with CRA here! This usually works beautifully with a type predicate.
    newPolls[pollIdx] = poll;
    setPolls(newPolls);
  }

  const addPoll: AddPollHandler = (poll: Poll | ErrorBody) => {
    // @ts-ignore
    if (poll.error) {
      console.error(poll);
      return;
    }
    // @ts-ignore
    setPolls([...polls, poll])
  }

  useEffect(() => {
    refreshPolls();
  }, [setStatus]);
  return [polls, status, refreshPolls, updatePollById, addPoll];
}
