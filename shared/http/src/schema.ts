import {createHttpRoute, createHttpSchema, t} from "http-schemas";
import {ChoiceInput, Poll, PollInput} from "./types";

export const ErrorBody = t.object({error: t.string})

export const pollsApiSchema = createHttpSchema([
  createHttpRoute({
    method: 'GET',
    path: '/polls',
    responseBody: t.object({
      polls: t.array(Poll),
    })
  }),
  createHttpRoute({
    method: 'GET',
    path: '/polls/:id',
    paramNames: ['id'],
    responseBody: t.union(Poll, ErrorBody),
  }),
  createHttpRoute({
    method: 'POST',
    path: '/polls',
    requestBody: PollInput,
    responseBody: Poll
  }),
  createHttpRoute({
    method: 'POST',
    path: '/polls/:id/choices',
    paramNames: ['id'],
    requestBody: t.object({text: ChoiceInput}),
    responseBody: t.union(Poll, ErrorBody),
  }),
  createHttpRoute({
    method: 'POST',
    path: '/polls/:id/choices/:choiceId/vote',
    paramNames: ['id', 'choiceId'],
    responseBody: t.union(Poll, ErrorBody),
  })
]);
