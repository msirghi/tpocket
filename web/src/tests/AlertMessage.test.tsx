import { shallow } from 'enzyme';
import React from 'react';
import { AlertType } from '../commons/enums';
import { AlertMessage } from '../components/alerts/AlertMessage';

describe('AlertMessage component', () => {
  it('should render info alert properly', () => {
    expect(shallow(<AlertMessage type={AlertType.INFO} message={'Some message'} />));
  });

  it('should render error alert properly', () => {
    expect(shallow(<AlertMessage type={AlertType.ERROR} message={'Some message'} />));
  });

  it('should render success alert properly', () => {
    expect(shallow(<AlertMessage type={AlertType.SUCCESS} message={'Some message'} />));
  });

  it('should render warning alert properly', () => {
    expect(shallow(<AlertMessage type={AlertType.WARNING} message={'Some message'} />));
  });
});
