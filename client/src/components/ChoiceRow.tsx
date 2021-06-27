import * as React from "react";
import {Choice} from "api-schema";
import {Button} from "reactstrap";

type Props = Choice & {
  onVoteClick: () => void;
};

export const ChoiceRow = ({id, text, votes, onVoteClick}: Props) => (
  <tr key={id}>
    <td>{text}</td>
    <td>{votes}</td>
    <td>
      <Button color='warning'
              onClick={onVoteClick}>
        Vote!
      </Button>
    </td>
  </tr>
);
