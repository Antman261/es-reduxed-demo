import * as React from "react";
import {useState} from "react";
import {Button, FormGroup, Input} from "reactstrap";

type Props = {
  onSubmit: (text: string) => void;
  onClose?: () => void;
};

export const ChoiceForm = ({onClose, onSubmit}: Props) => {
  const [text, setText] = useState<string>('');
  const handleSubmit = (e?: { preventDefault: () => void}) => {
    e && e.preventDefault();
    onSubmit(text);
    setText('');
    onClose && onClose();
  }
  return (
    <form  onSubmit={e => e.preventDefault()}>
      <FormGroup className="mr-2" style={{display: 'inline-block', width: 400}}>
        <Input placeholder='Enter your suggested choice'
               value={text}
               type='text'
               onChange={(event => setText(event.target.value))}
               />
      </FormGroup>
        <Button color='primary'
                className='mx-3'
                onClick={() => handleSubmit()}>
          Submit
        </Button>
      {onClose && (
        <Button color={'light'} onClick={onClose}>
          X
        </Button>
      )}
    </form>
  );
}
