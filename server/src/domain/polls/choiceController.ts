import { v4 as uuidV4 } from 'uuid';
import {validateChoiceForPoll} from "./choiceValidator.js";
import {Poll} from "api-schema";
import {PollsStore, store} from "../../state/store.js";
import {getPollById} from "../../state/reducer.js";
import {esInit} from "../../state/init.js";

type CreateChoiceOutcome = {
  poll?: Poll;
  outcome: 'SUCCESSFUL' | 'POLL_NOT_FOUND' | 'INVALID_POLL_TYPE' | 'DUPLICATE_CHOICE';
}

const createChoiceCreationController = (store: PollsStore) => async (choiceText: string, pollId: string): Promise<CreateChoiceOutcome> => {
  const { raiseEvent } = await esInit;
  const { polls } = store.getState();
  const poll = polls.find(getPollById(pollId));

  if (!poll) {
    return {outcome: 'POLL_NOT_FOUND'}
  }
  const outcome = validateChoiceForPoll(choiceText, poll);
  if (outcome !== 'VALID') {
    return {outcome};
  }

  const newState = await raiseEvent({
    type: 'CHOICE_ADDED',
    version: 1,
    payload: {
      text: choiceText,
      pollId,
      uuid: uuidV4(),
    }
  });

  return {
    outcome: 'SUCCESSFUL',
    poll: newState.polls.find(getPollById(pollId)),
  }
}

export const createChoiceViaController = createChoiceCreationController(store);
