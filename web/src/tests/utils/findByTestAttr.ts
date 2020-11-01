import { ReactWrapper, ShallowWrapper } from 'enzyme';

export const findByTestAttr = (component: ShallowWrapper | ReactWrapper, attr: string) => {
  const wrapper = component.find(`[data-test='${attr}']`);
  return wrapper;
};

export const findFirstByTestAttr = (component: ShallowWrapper | ReactWrapper, attr: string) => {
  return findByTestAttr(component, attr).first();
};
