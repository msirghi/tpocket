import React from 'react';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { ApolloProvider } from '@apollo/react-hooks';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { CustomPieChart } from '../components/charts/CustomPieChart';
import { render } from '@testing-library/react';
import { createMockClient } from 'mock-apollo-client';
import { GetExpensePercentageByCategoryDocument } from '../generated/graphql';

describe('CustomBarChart component', () => {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([])
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot on pie render', () => {
    const component = mount(
      <ApolloProvider client={client}>
        <CustomPieChart mostUsedCategoryHandler={jest.fn()} />
      </ApolloProvider>
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should test', () => {
    const mockClient = createMockClient();
    const mutationHandler = jest.fn().mockResolvedValue({
      getExpensePercentageByCategory: [{
        id: 1
      }],
      error: []
    });
    mockClient.setRequestHandler(GetExpensePercentageByCategoryDocument, mutationHandler);
    const { getByTestId } = render(
      <ApolloProvider client={mockClient}>
        <CustomPieChart mostUsedCategoryHandler={jest.fn()} />
      </ApolloProvider>
    );
  });
});
