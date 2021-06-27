import {Poll} from "api-schema";

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
