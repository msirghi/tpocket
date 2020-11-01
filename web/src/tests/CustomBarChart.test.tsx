import { ApolloProvider } from '@apollo/react-hooks';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import { CustomBarChart } from '../components/charts/CustomBarChart';
import { GetExpensesStatisticsDocument, LoginDocument } from '../generated/graphql';
import { MonthlyStatistics } from '../pages/Home';
import { MockedProvider } from '@apollo/client/testing';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { render } from '@testing-library/react';
import { createMockClient } from 'mock-apollo-client';

type Data = {
  montlyStatistics: MonthlyStatistics;
};

const data: Data = {
  montlyStatistics: {
    monthWithMaxExpenses: { expenses: 100, name: 'October' },
    monthWithMinExpenses: { expenses: 150, name: 'November' },
    thisMonthExpenses: { expenses: 200, name: 'December' }
  }
};

const mocks = [
  {
    request: {
      query: GetExpensesStatisticsDocument,
      variables: {
        year: '2020'
      }
    },
    result: {
      data: {
        getExpensesStatistics: [{ name: '1', expenses: 905 }]
      }
    }
  }
];

describe('CustomBarChart component', () => {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([])
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot on bar render', () => {
    const component = mount(
      <ApolloProvider client={client}>
        <CustomBarChart monthlyStatisticsHandler={jest.fn()} />
      </ApolloProvider>
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should match snapshot on bar render', () => {
    const mockClient = createMockClient();
    const queryHandler = jest.fn().mockResolvedValue({
      getExpensePercentageByCategory: [],
      error: []
    });
    mockClient.setRequestHandler(GetExpensesStatisticsDocument, queryHandler);
    const { getByTestId } = render(
      <ApolloProvider client={mockClient}>
        <CustomBarChart monthlyStatisticsHandler={jest.fn()} />
      </ApolloProvider>
    );
  });
});
