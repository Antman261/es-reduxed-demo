import * as React from "react";
import {Button, Card, CardBody, CardHeader, Table} from "reactstrap";
import {Poll} from "api-schema";
import {ChoiceRow} from "./ChoiceRow";
import {useState} from "react";
import {ChoiceForm} from "./ChoiceForm";

type Props = Poll & {
  createChoiceVoteClickHandler: (choiceId: string) => () => void;
  onSubmit: (text: string) => void;
};

export const PollCard = ({id, text, type, choices, createChoiceVoteClickHandler, onSubmit}: Props) => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  return (
    <Card key={id} className='my-4'>
      <CardHeader>
        {type === 'OPEN' ? (
          <Button className='float-right mt-1'
                  color='primary'
                  onClick={() => setIsFormOpen(true)}>
            Add Choice
          </Button>
        ) : (
          <small className='float-right mt-4 text-muted'>This poll is fixed. You cannot add choices.</small>
        )}
        <h2>{text}</h2>
      </CardHeader>
      <CardBody>
        <Table size={'md'} className='mt-2'>
          <thead>
          <tr>
            <th>Choice</th>
            <th>Votes</th>
            <th/>
          </tr>
          </thead>
          <tbody>
          {choices.map(choice => (
            <ChoiceRow {...choice} onVoteClick={createChoiceVoteClickHandler(choice.id)}/>
          ))}
          </tbody>
        </Table>
        {isFormOpen && (
          <ChoiceForm onSubmit={onSubmit} onClose={() => setIsFormOpen(false)}/>
        )}
      </CardBody>
    </Card>
  );
}
