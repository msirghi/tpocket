import React from 'react';
import Button from "@material-ui/core/Button";
import { Row } from "../layout/Row";

interface IProps {
  buttonWidth: number;
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
  leftLabel: string;
  rightLabel: string;
  leftClickHandler: Function;
  rightClickHandler: Function;
}

export const TwoRowButtons: React.FC<IProps> = ({ buttonWidth, leftIcon, rightIcon, leftClickHandler, leftLabel, rightLabel, rightClickHandler }) => {
  return (
    <Row className={ 'row-center pb-15' }>
      <Button
        data-test={'left-button'}
        style={ { width: buttonWidth } }
        onClick={ () => leftClickHandler() }
        startIcon={ leftIcon }
        color="primary"
      >
        { leftLabel }
      </Button>
      <Button
        data-test={'right-button'}
        style={ { width: buttonWidth } }
        onClick={ () => rightClickHandler() }
        startIcon={ rightIcon }
        color="primary"
      >
        { rightLabel }
      </Button>
    </Row>
  );
}
