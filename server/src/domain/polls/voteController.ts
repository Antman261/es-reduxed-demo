import {Poll} from "api-schema";
import {PollsStore, store} from "../../state/store.js";
import {esInit} from "../../state/init.js";
import {getChoiceById, getPollById} from "../../state/reducer.js";

type AddVoteOutcome = {
  poll?: Poll;
  outcome: 'SUCCEEDED' | 'POLL_NOT_FOUND' | 'CHOICE_NOT_FOUND';
}

const createVoteAdderController = (store: PollsStore) => async (pollId: string, choiceId: string): Promise<AddVoteOutcome> => {
  const { raiseEvent } = await esInit;
  const { polls } = store.getState();
  const poll = polls.find(getPollById(pollId));
  if (!poll) {
    return { outcome: 'POLL_NOT_FOUND' };
  }
  const choice = poll.choices.find(getChoiceById(choiceId));
  if (!choice) {
    return { outcome: 'CHOICE_NOT_FOUND' };
  }
  const newState = await raiseEvent({
    type: 'VOTE_CAST',
    version: 1,
    payload: {
      pollId,
      choiceId,
    }
  });
  return {
    outcome: 'SUCCEEDED',
    poll: newState.polls.find(getPollById(pollId)),
  }
};

export const addVoteViaController = createVoteAdderController(store);
