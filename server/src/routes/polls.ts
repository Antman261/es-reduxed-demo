import { v4 as uuidV4 } from 'uuid';
import { createRequestHandler } from 'http-schemas/server.js';
import { pollsApiSchema } from 'api-schema';
import {createChoiceViaController} from "../domain/polls/choiceController.js";
import {isNever} from "../never.js";
import {addVoteViaController} from "../domain/polls/voteController.js";
import {store} from "../state/store.js";
import {esInit} from "../state/init.js";
import {getPollById} from "../state/reducer.js";

export const getPollsRouteHandler = createRequestHandler(
  pollsApiSchema,
  'GET',
  '/polls',
  async (req, res) => {
    res.json({ polls: store.getState().polls });
  }
);

export const postPollsRouteHandler = createRequestHandler(
  pollsApiSchema,
  'POST',
  '/polls',
  async (req, res) => {
    const { raiseEvent } = await esInit;
    const pollInput = req.body;
    const uuid = uuidV4();
    const newState = await raiseEvent({
        type: 'POLL_CREATED',
        version: 1,
        payload: {
            text: pollInput.text,
            type: pollInput.type,
            uuid,
            choices: pollInput.choices.map(choiceText => ({
                text: choiceText,
                uuid: uuidV4(),
            }))
        }
    });
    res.json(newState.polls.find(getPollById(uuid)));
  }
);

export const getPollByIdRouteHandler = createRequestHandler(
  pollsApiSchema,
  'GET',
  '/polls/:id',
  async (req, res) => {
    const pollId = req.params.id;
    const poll = store.getState().polls.find(getPollById(pollId));
    if (!poll) {
      res.status(404).json({error: "Poll not found"});
      return;
    }
    res.json(poll);
  }
);

export const postChoiceRouteHandler = createRequestHandler(
  pollsApiSchema,
  'POST',
  '/polls/:id/choices',
  async (req, res) => {
    const pollId = req.params.id;
    const {text} = req.body;
    const {outcome, poll} = await createChoiceViaController(text, pollId);
    switch (outcome) {
      case "DUPLICATE_CHOICE":
        res.status(400).json({error: "That choice already exists in this poll"});
        return;
      case "INVALID_POLL_TYPE":
        res.status(400).json({error: "Cannot add choices to a fixed poll"});
        return;
      case "POLL_NOT_FOUND":
        res.status(404).json({error: "Poll not found"});
        return;
      case "SUCCESSFUL":
        if (!poll) {
          throw new Error('Somehow succeeded without a poll object')
        }
        res.json(poll);
        return;
      default:
        return isNever(outcome);
    }
  }
);

export const postVoteRouteHandler = createRequestHandler(
  pollsApiSchema,
  'POST',
  '/polls/:id/choices/:choiceId/vote',
  async (req, res) => {
    const {id: pollId, choiceId} = req.params;
    const {outcome, poll} = await addVoteViaController(pollId, choiceId);
    switch (outcome) {
      case "POLL_NOT_FOUND":
        res.status(404).json({error: "Poll not found"});
        return;
      case "CHOICE_NOT_FOUND":
        res.status(404).json({error: "Choice not found"});
        return;
      case "SUCCEEDED":
        if (!poll) {
          throw new Error('Somehow succeeded without a poll object')
        }
        res.json(poll);
        return;
      default:
        return isNever(outcome);
    }
  }
)
