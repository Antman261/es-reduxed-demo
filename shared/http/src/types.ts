import { t } from "http-schemas";

export const ChoiceInput = t.string;

export const Choice = t.object({
  text: t.string,
  votes: t.number,
  id: t.string,
});

const PollTypes = t.union(t.unit('OPEN'), t.unit('FIXED'));

export const PollInput = t.object({
  text: t.string,
  type: PollTypes,
  choices: t.array(ChoiceInput),
});

export const Poll = t.object({
  ...PollInput.properties,
  choices: t.array(Choice),
  id: t.string,
});
