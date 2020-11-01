import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { ApolloProvider } from '@apollo/react-hooks';
import toJson from 'enzyme-to-json';
import { BrowserRouter } from 'react-router-dom';
import { render, fireEvent, act } from '@testing-library/react';
import { InitAdditionalRegInfoDocument } from '../generated/graphql';
import { createMockClient } from 'mock-apollo-client';
import { AdditionalInfoForm } from '../components/forms/AdditionalInfoForm';

describe('AdditionalInfoForm component', () => {
  let mutationHandler;
  let component: ReactWrapper;

  beforeAll(() => {
    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: ApolloLink.from([])
    });
    component = mount(
      <ApolloProvider client={client}>
        <BrowserRouter>
          <AdditionalInfoForm handleNext={jest.fn()} />
        </BrowserRouter>
      </ApolloProvider>
    );
  });

  const getRenderedComponent = (invalidVal = false) => {
    const mockClient = createMockClient();

    if (invalidVal) {
      mutationHandler = jest.fn();
    } else {
      mutationHandler = jest.fn().mockResolvedValue({
        data: {
          initAdditionalRegInfo: {
            id: '1'
          }
        }
      });
    }
    mockClient.setRequestHandler(InitAdditionalRegInfoDocument, mutationHandler);
    return render(
      <ApolloProvider client={mockClient}>
        <BrowserRouter>
          <AdditionalInfoForm handleNext={jest.fn()} />
        </BrowserRouter>
      </ApolloProvider>
    );
  };

  it('should match snapshot', () => {
    expect(toJson(component)).toMatchSnapshot();
  });

  it('should have a disabled button if form is not valid', () => {
    const { getByTestId } = getRenderedComponent();

    const submitButton = getByTestId('submit-button');
    expect(submitButton).toBeInTheDocument();

    const limitInput = getByTestId('limit-input');
    expect(limitInput).toBeInTheDocument();

    expect(submitButton).toBeDisabled();
  });

  it('should submit have chip options', async () => {
    const { getByTestId, getAllByTestId } = getRenderedComponent();

    const submitButton = getByTestId('submit-button');
    expect(submitButton).toBeInTheDocument();

    const limitInput = getByTestId('limit-input');
    expect(limitInput).toBeInTheDocument();

    const currencySelector = getByTestId('currency-selector');
    expect(currencySelector).toBeInTheDocument();

    const chipOptions = getAllByTestId('chip-option');
    expect(chipOptions[0]).toBeInTheDocument();
    expect(chipOptions[1]).toBeInTheDocument();
    expect(chipOptions[2]).toBeInTheDocument();
  });

  it('should submit the form if entered values are right', async () => {
    const { getByTestId, getAllByTestId } = getRenderedComponent();

    const submitButton = getByTestId('submit-button');
    expect(submitButton).toBeInTheDocument();

    const limitInput = getByTestId('limit-input');
    expect(limitInput).toBeInTheDocument();

    const currencySelector = getByTestId('currency-selector');
    expect(currencySelector).toBeInTheDocument();

    const chipOptions = getAllByTestId('chip-option');
    expect(chipOptions[0]).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(currencySelector, { target: { value: 'USD' } });
      fireEvent.change(limitInput, { target: { value: '1000' } });
      fireEvent.click(chipOptions[0]);
      fireEvent.click(chipOptions[1]);
      fireEvent.click(chipOptions[2]);
    });
    expect(submitButton).not.toBeDisabled();
    fireEvent.click(submitButton);
    expect(submitButton).toHaveTextContent('forms.additionalInfo.sendingData');
  });

  it('should throw an error on submit', async () => {
    const { getByTestId, getAllByTestId } = getRenderedComponent(true);

    const submitButton = getByTestId('submit-button');
    const limitInput = getByTestId('limit-input');
    const currencySelector = getByTestId('currency-selector');
    const chipOptions = getAllByTestId('chip-option');
    await act(async () => {
      fireEvent.change(currencySelector, { target: { value: 'USD' } });
      fireEvent.change(limitInput, { target: { value: '1000' } });
      fireEvent.click(chipOptions[0]);
      fireEvent.click(chipOptions[1]);
      fireEvent.click(chipOptions[2]);
    });
    expect(submitButton).not.toBeDisabled();
    fireEvent.click(submitButton);
    expect(submitButton).toHaveTextContent('forms.additionalInfo.sendingData');
    expect(mutationHandler).not.toBeCalled();
  });

  it('should deselect category chip', async () => {
    const {  getAllByTestId } = getRenderedComponent(true);
    const chipOptions = getAllByTestId('chip-option');

    await act(async () => {
      fireEvent.click(chipOptions[1]);
    });
    fireEvent.click(chipOptions[1]);
    expect(chipOptions[0]).toHaveStyle('background-color: rgb(243, 243, 243)');
  });
});
