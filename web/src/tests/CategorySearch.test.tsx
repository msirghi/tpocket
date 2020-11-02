import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { CategorySearch } from '../components/category/CategorySearch';
import { findByTestAttr } from './utils/findByTestAttr';
import toJson from 'enzyme-to-json';

describe('CategorySearch Component', () => {
  let component: ShallowWrapper;
  const onChange = jest.fn();
  const onClose = jest.fn();

  const renderComponent = (resultCount: number, resultCountShown: boolean) =>
    shallow(
      <CategorySearch
        onClose={onClose}
        onChange={onChange}
        resultCount={resultCount}
        resultCountShown={resultCountShown}
      />
    );

  beforeEach(() => {
    component = renderComponent(23, true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render component without errors', () => {
    expect(toJson(renderComponent(23, true))).toMatchSnapshot();
  });

  it('should rendedr right result count', () => {
    const resultCounter = findByTestAttr(component, 'result-counter');
    expect(resultCounter.text()).toBe('23 results found.');
  });

  it('should not render result count on false prop', () => {
    component = renderComponent(12, false);
    const resultCounter = findByTestAttr(component, 'result-counter');
    expect(resultCounter.length).toBe(0);
  });

  it('should not render result if counter is < 0', () => {
    component = renderComponent(-1, true);
    const resultCounter = findByTestAttr(component, 'result-counter');
    expect(resultCounter.length).toBe(0);
  });

  it('should fire method on input change', () => {
    const input = findByTestAttr(component, 'category-name-field');
    input.simulate('change', { target: { value: 'Test value' } });
    expect(onChange).toBeCalled();
  });

  it('should fire onClose prop close button click', () => {
    const button = findByTestAttr(component, 'close-icon');
    button.simulate('click');
    expect(onClose).toBeCalledTimes(1);
  });
});
