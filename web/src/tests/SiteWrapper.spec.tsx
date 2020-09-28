import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { SiteWrapper } from '../components/layout/SiteWrapper';
import { findByTestAttr } from './utils/findByTestAttr';
import toJson from 'enzyme-to-json';

describe('SiteWrapper Component', () => {
  let component: ShallowWrapper;

  beforeEach(() => {
    component = shallow(
      <SiteWrapper>
        <div>
          <span data-test={'text-1'}>Lorem ipsum.</span>
          <span data-test={'text-2'}>Lorem ipsum dolor sit amet.</span>
        </div>
      </SiteWrapper>
    );
  });

  it('should render properly', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render header with specific style', () => {
    const header = findByTestAttr(component, 'site-header');
    expect(header.get(0).props.style.background).toBe('#fff');
    expect(header.length).toBe(1);
  });
});
