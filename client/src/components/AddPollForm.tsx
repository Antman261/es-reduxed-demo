import * as React from "react";
import {Alert, Button, Col, Form, FormGroup, Input, Label, Row} from "reactstrap";
import {useState} from "react";
import {PollInput} from "api-schema";
import {ChoiceForm} from "./ChoiceForm";

type Props = {
  onSubmit: (poll: PollInput) => void;
  onClose: () => void;
};

const validateAddPollForm = ({type, text, choices}: PollInput): string => {
  if (type === 'FIXED' && choices.length < 2) {
    return 'Add at least two choices so people can vote in this poll';
  }
  if (text.trim().length === 0) {
    return 'Include a question so people know why they are voting';
  }
  return '';
}

export const AddPollForm = ({onSubmit, onClose}: Props) => {
  const [text, setText] = useState<PollInput['text']>('');
  const [pollType, setPollType] = useState<PollInput['type']>('FIXED');
  const [choices, setChoices] = useState<PollInput['choices']>([]);
  const [formError, setFormError] = useState<string>('');
  const [formState, setFormState] = useState<'READY' | 'SUBMITTING'>('READY');

  const handleAddChoice = (text: string) => {
    setChoices([...choices, text]);
  }

  const handleSubmit = () => {
    if (formState === 'SUBMITTING') {
      return;
    }
    setFormError('');
    const formData = {
      text,
      choices,
      type: pollType,
    };
    const errors = validateAddPollForm(formData);
    if (errors) {
      setFormError(errors);
      return;
    }
    (async () => {
      setFormState('SUBMITTING');
      await onSubmit(formData);
      setFormState('READY');
      onClose();
    })();
  }
  return (
  <>
    {formError && (
      <Alert color='danger'>
        {formError}
      </Alert>
    )}
    <Row>
      <Col sm={8}>
        <Form>
          <FormGroup className="mb-3" >
            <Label>Question</Label>
            <Input placeholder='Enter a question to ask'
                   value={text}
                   type='text'
                   onChange={(event => setText(event.target.value))}
            />
          </FormGroup>
          <FormGroup tag="fieldset">
            <Label>Poll Type</Label>
            <FormGroup check>
              <Label check>
                <Input type="radio"
                       checked={pollType === 'OPEN'}
                       onChange={() => setPollType('OPEN')}
                       name="radio1" />{' '}
                Open &mdash; Allow others to contribute choices for people to vote on.
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="radio"
                       checked={pollType === 'FIXED'}
                       onChange={() => setPollType('FIXED')}
                       name="radio1" />{' '}
                Fixed &mdash; Once the poll has started, the choices cannot be changed.
              </Label>
            </FormGroup>
          </FormGroup>
          <span>Choices:</span>
          {choices.length ? (
            <ul>
              {choices.map((choice) => (
                <li>{choice}</li>
              ))}
            </ul>
          ) : (
            <p className='text-muted small'>Add some choices so people can vote!</p>
          )}
          <FormGroup className='mb-3'>
            <Label>Add a choice</Label>
            <ChoiceForm onSubmit={handleAddChoice}/>
          </FormGroup>

        </Form>
      </Col>
    </Row>
    <hr/>
    <Row>
      <Col sm={6}>
        <Button color='primary'
                block
                onClick={handleSubmit}>
          {formState === 'SUBMITTING' ? <i className='fas fa-sync fa-spin'/> : 'Start Poll'}
        </Button>
      </Col>
      <Col sm={6}>
        <Button outline
                block
                onClick={onClose}>
          Cancel
        </Button>
      </Col>
    </Row>
    </>
  );
}
