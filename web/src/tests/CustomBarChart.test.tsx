import { ApolloProvider } from '@apollo/react-hooks';
import { shallow, ShallowWrapper } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import { CustomBarChart } from '../components/charts/CustomBarChart';
import { useGetExpensesStatisticsQuery, GetExpensesStatisticsDocument } from '../generated/graphql';
import { MonthlyStatistics } from '../pages/Home';
import { MockedProvider } from '@apollo/client/testing';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { render } from '@testing-library/react';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, Observable } from 'apollo-link';
import { renderHook } from '@testing-library/react-hooks';

type Data = {
  montlyStatistics: MonthlyStatistics;
};

const data: Data = {
  montlyStatistics: {
    monthWithMaxExpenses: { expenses: 100, name: 'October' },
    monthWithMinExpenses: { expenses: 150, name: 'November' },
    thisMonthExpenses: { expenses: 200, name: 'December' },
  },
};

const mocks = [
  {
    request: {
      query: GetExpensesStatisticsDocument,
      variables: {
        year: '2020',
      },
    },
    result: {
      data: {
        getExpensesStatistics: [{ name: '1', expenses: 905 }],
      },
    },
  },
];

describe('CustomBarChart component', () => {
  let handlerSpy = jest.fn();
  let component: ShallowWrapper;
  let rendererComponent: ShallowWrapper;
  
  beforeEach(() => {
    handlerSpy = jest.fn();

    const client = new ApolloClient({
      link: ApolloLink.from([]),
      cache: new InMemoryCache(),
    });
    rendererComponent = render(
      <ApolloProvider client={client}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <CustomBarChart monthlyStatisticsHandler={handlerSpy} />
        </MockedProvider>
      </ApolloProvider>
    );
    component = shallow(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CustomBarChart monthlyStatisticsHandler={handlerSpy} />
      </MockedProvider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render properly', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should render properly', () => {
    expect(toJson(rendererComponent)).toMatchSnapshot();
  });

  it('should call handlerSpy when data appears', async () => {
    expect(component.find(CustomBarChart)).toHaveLength(1);
  });
});
