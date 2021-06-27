import { EventBase } from "es-reduxed";
import { Choice, Poll } from "api-schema";
import { Reducer } from "redux";

interface PollCreated extends EventBase {
    type: 'POLL_CREATED';
    payload: {
        text: string;
        type: Poll['type'];
        uuid: string;
        choices: Array<{text: string, uuid: string}>;
    };
}

interface ChoiceAdded extends EventBase {
    type: 'CHOICE_ADDED';
    payload: {
        text: string;
        pollId: string;
        uuid: string
    };
}

interface VoteCast extends EventBase {
    type: 'VOTE_CAST';
    payload: {
        pollId: string;
        choiceId: string;
    }
}

export type PollEvents = PollCreated | ChoiceAdded | VoteCast;

type PollState = {
    polls: Poll[]
}

export const initialState: PollState = {
    polls: [],
}

export const getPollById = (id: string) => (p: Poll): boolean => p.id === id;
export const getChoiceById = (id: string) => (c: Choice): boolean => c.id === id;

export const pollsReducer: Reducer<PollState, PollEvents> =
    (state=initialState, event) => {
    switch (event.type) {
        case "POLL_CREATED": {
            const {text, type, choices, uuid} = event.payload;
            const newPoll: Poll = {
                text,
                type,
                choices: choices.map(({text, uuid}) => ({
                    text,
                    votes: 0,
                    id: uuid
                })),
                id: uuid,
            }
            return {
                ...state,
                polls: [...state.polls, newPoll],
            };
        }
        case "CHOICE_ADDED": {
            const oldPollIndex = state.polls.findIndex(getPollById(event.payload.pollId));
            const oldPoll = state.polls[oldPollIndex];
            const newChoice = {
                text: event.payload.text,
                id: event.payload.uuid,
                votes: 0,
            };
            const updatedPoll = {
                ...oldPoll,
                choices: [...oldPoll.choices, newChoice],
            };
            const newPollsArr = [...state.polls];
            newPollsArr[oldPollIndex] = updatedPoll;
            return {
                ...state,
                polls: newPollsArr,
            };
        }
        case "VOTE_CAST": {
            const pollIndex = state.polls.findIndex(getPollById(event.payload.pollId));
            const choiceIndex = state.polls[pollIndex].choices.findIndex(getChoiceById(event.payload.choiceId));
            const oldChoice = state.polls[pollIndex].choices[choiceIndex];
            const newPollsArr = [...state.polls];
            newPollsArr[pollIndex].choices[choiceIndex] = {
                ...oldChoice,
                votes: oldChoice.votes + 1,
            };
            return {
                ...state,
                polls: newPollsArr,
            }
        }
        default:
            return state;
    }
}