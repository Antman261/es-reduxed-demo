import * as React from "react";
import {PollCard} from "../components/Poll";
import {Card, CardBody} from "reactstrap";
import {usePolls} from "../hooks/usePolls";
import {apiClient} from "../apiClient";
import {PollsHeader} from "../components/PollsHeader";
import {PollInput} from "api-schema";
import {useEffect} from "react";

export const PollsController = () => {
  const [polls, status, refreshPolls, updatePoll, addPoll] = usePolls(apiClient);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshPolls();
    }, 10000);
    return () => clearInterval(interval);
  }, [refreshPolls]);

  const createVoteClickHandler = (pollId: string) => (choiceId: string) => () => {
    (async () => {
      const requestConfig = {params: {choiceId, id: pollId}};
      const result = await apiClient.post(`/polls/:id/choices/:choiceId/vote`, requestConfig);
      updatePoll(pollId, result);
    })();
  }

  const createChoiceSubmitHandler = (pollId: string) => (text: string) => {
    (async () => {
      const requestConfig = {
        params: {id: pollId},
        body: {text},
      };
      const result = await apiClient.post('/polls/:id/choices', requestConfig);
      updatePoll(pollId, result);
    })();
  }

  const addPollSubmitHandler = async (pollInput: PollInput): Promise<void> => {
    const result = await apiClient.post('/polls', {body: {...pollInput}});
    addPoll(result);
  }

  return (
    <>
      <PollsHeader onRefreshClick={refreshPolls}
                   onPollSubmit={addPollSubmitHandler}
                   status={status} />
      <div className='mt-5'>
        {polls.length ?
          polls.map(poll => (
            <PollCard key={poll.id}
                      {...poll}
                      onSubmit={createChoiceSubmitHandler(poll.id)}
                      createChoiceVoteClickHandler={createVoteClickHandler(poll.id)} />
          )) : (
            <Card>
              <CardBody>
                <h4>No polls found...</h4>
              </CardBody>
            </Card>
        )}
      </div>
    </>
  );
}
