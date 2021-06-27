import React from 'react';
import {PollsController} from "./controllers/PollsController";
import {Container} from "reactstrap";

function App() {
  return (
    <Container className='mt-5'>
      <PollsController/>
    </Container>

  );
}

export default App;
