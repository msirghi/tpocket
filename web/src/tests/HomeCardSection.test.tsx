import React from 'react';
import { mount, shallow, ShallowWrapper } from 'enzyme';
import { HomeCardSection } from '../components/home/HomeCardSection';
import { PercentageByCategoryPayload } from '../generated/graphql';
import { MonthlyStatistics } from '../pages/Home';
import toJson from 'enzyme-to-json';
import { AccountContext, AccountProvider } from '../context/AccountContext';
import { AccountContextData } from './utils/contextData';

type Props = {
  data?: any;
  mostUsedCategory?: PercentageByCategoryPayload;
  monthlyStatistics?: MonthlyStatistics;
};

describe('HomeCardSection component', () => {
  const defaultProps = {
    data: {
      getCategoryExpenseStatisticsByUser: {
        totalExpenses: 0,
        totalCategories: 10
      },
      mostUsedCategory: {
        category: {
          id: 1,
          name: 'Category'
        }
      },
      monthlyStatistics: {
        thisMonthExpenses: {
          expenses: 1000
        }
      }
    }
  };

  const getComponent = (props: Props | {} = {}) => {
    const finalProps = { ...defaultProps, ...props };
    return mount(
      <AccountContext.Provider value={{ state: AccountContextData, dispatch: jest.fn() }}>
        <HomeCardSection {...finalProps} />
      </AccountContext.Provider>
    );
  };

  it('should match snapshot', () => {
    expect(toJson(getComponent())).toMatchSnapshot();
  });

  it('should render zeros if no value for monthlyStatistics', () => {
    expect(toJson(getComponent({ monthlyStatistics: null }))).toMatchSnapshot();
  });

  it('should render zeros if no value for mostUsedCategory', () => {
    expect(toJson(getComponent({ mostUsedCategory: null }))).toMatchSnapshot();
  });

  it('should render zeros if no value for getCategoryExpenseStatisticsByUser', () => {
    expect(toJson(getComponent({ getCategoryExpenseStatisticsByUser: null }))).toMatchSnapshot();
  });
});
