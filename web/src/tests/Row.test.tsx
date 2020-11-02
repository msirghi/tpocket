import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Row } from '../components/layout/Row';
import { findFirstByTestAttr } from './utils/findByTestAttr';

describe('Row component', () => {
  it('should have a row class', () => {
    const component = shallow(<Row>children there</Row>);
    expect(component.find('div').hasClass('row')).toBeTruthy();
  });

  it('should have provided className', () => {
    const component = shallow(<Row className='someClass' />);
    expect(component.find('div').hasClass('someClass')).toBeTruthy();
  });

  it('should render children', () => {
    const component = shallow(
      <Row className='someClass'>
        <div data-test='content'>content here</div>
      </Row>
    );
    const content = findFirstByTestAttr(component, 'content');
    expect(content).toHaveLength(1);
  });
});
