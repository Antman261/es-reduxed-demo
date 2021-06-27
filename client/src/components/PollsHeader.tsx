import * as React from "react";
import {Button, Card, CardBody, CardHeader, CardSubtitle} from "reactstrap";
import {PollsStatus} from "../hooks/usePolls";
import {PollInput} from "api-schema";
import {useState} from "react";
import {AddPollForm} from "./AddPollForm";

type Props = {
  onRefreshClick: () => void;
  onPollSubmit: (poll: PollInput) => Promise<void>;
  status: PollsStatus;
};

export const PollsHeader = ({onRefreshClick, onPollSubmit, status}: Props) => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  return (
    <Card>
      <CardHeader>
        <Button className='float-right mt-2 ml-3'
                color='primary'
                onClick={() => setIsFormOpen(true)}>
          Add Poll
        </Button>
        <Button className='float-right mt-2 mx-3'
                color='light'
                onClick={onRefreshClick}>
          <i className={`fas fa-sync ${status === 'LOADING' ? 'fa-spin' : ''}`}/>
        </Button>
        <h1 className='card-title'>Polls App</h1>
      </CardHeader>
      <CardBody>
        {isFormOpen ? (
          <>
            <h4>Start a poll</h4>
            <hr/>
                <AddPollForm onSubmit={onPollSubmit}
                             onClose={() => setIsFormOpen(false)} />
          </>
        ) : (
          <CardSubtitle className='lead'>Ask questions and vote on answers!</CardSubtitle>
        )}
      </CardBody>
    </Card>
  );
}
