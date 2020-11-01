import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Button, Grid, MenuItem } from '@material-ui/core';
import { Select, TextField } from 'formik-material-ui';
import { useTranslation } from 'react-i18next';
import ValidationService from '../../utils/ValidationService';
import { useUpdateUserMutation } from '../../generated/graphql';
import { useSnackbar } from 'notistack';
import { AlertMessage } from '../alerts/AlertMessage';
import { AlertType } from '../../commons/enums';
import { useWindowSize } from '../../utils/useWindowSize';

const currencies = [
  {
    value: 'USD',
    label: '$'
  },
  {
    value: 'EUR',
    label: '€'
  },
  {
    value: 'BTC',
    label: '฿'
  },
  {
    value: 'JPY',
    label: '¥'
  }
];

type Props = {
  firstName: string;
  lastName: string;
  monthLimit: number;
  currency: string;
  email: string;
};

type Values = {
  firstName: string;
  lastName: string;
  monthLimit: string;
  currency: string;
  email: string;
};

export const AccountEditForm: React.FC<Props> = ({
  firstName,
  lastName,
  monthLimit,
  currency,
  email
}) => {
  const { t } = useTranslation();
  const [updateUser] = useUpdateUserMutation();
  const [error, setError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [width] = useWindowSize();

  const onSubmit = async (values: any, setSubmitting: (val: boolean) => void) => {
    const { firstName, lastName, monthLimit, currency } = values;
    try {
      const response = await updateUser({
        variables: {
          currency,
          lastName,
          firstName,
          monthLimit: +monthLimit
        }
      });

      if (response && response.data?.updateUserPreference) {
        enqueueSnackbar(t('messages.accountInfoUpdated'), { variant: 'success' });
      }
      setSubmitting(false);
    } catch (e) {
      setError(e.graphQLErrors.map((x: { message: string }) => x.message)[0]);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Formik
        initialValues={{
          firstName,
          lastName,
          currency,
          monthLimit,
          email
        }}
        validateOnChange
        validate={(values) => {
          const errors: Partial<Values> = {};
          const { firstName, lastName, monthLimit } = values;

          if (+monthLimit <= 0) {
            errors.monthLimit = t('errors.negativeMonthLimit');
          }

          if (!ValidationService.validateName(firstName)) {
            errors.firstName = t('errors.invalidName');
          }

          if (!ValidationService.validateName(lastName)) {
            errors.lastName = t('errors.invalidName');
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => await onSubmit(values, setSubmitting)}
      >
        {({ submitForm, isSubmitting, values, isValid }) => (
          <Form className={'row row-center'}>
            <Grid
              container
              spacing={4}
              xs={width < 768 ? 12 : 6}
              justify='center'
              alignItems='center'
            >
              {error && <AlertMessage type={AlertType.ERROR} message={t('errors.serverError')} />}
              <Grid item xs={12}>
                <Field
                  component={TextField}
                  disabled
                  required
                  data-test='email-field'
                  inputProps={{ 'data-testid': 'firstname-field' }}
                  name='email'
                  label={t('forms.account.email')}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  component={TextField}
                  required
                  data-test='firstname-field'
                  inputProps={{ 'data-testid': 'firstname-field' }}
                  name='firstName'
                  label={t('forms.account.firstName')}
                  fullWidth
                  autoComplete='given-name'
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  component={TextField}
                  required
                  data-test='lastname-field'
                  inputProps={{ 'data-testid': 'lastname-field' }}
                  name='lastName'
                  label={t('forms.account.lastName')}
                  fullWidth
                  autoComplete='given-name'
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  type='number'
                  component={TextField}
                  required
                  data-test='monthlimit-field'
                  inputProps={{ 'data-testid': 'monthlimit-field' }}
                  name='monthLimit'
                  label={t('forms.account.monthLimit')}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Field
                  inputProps={{ 'data-testid': 'currency-selector' }}
                  label={t('forms.additionalInfo.currency')}
                  placeholder={t('forms.account.currency')}
                  fullWidth
                  name='currency'
                  component={Select}
                  defaultValue={values.currency}
                >
                  {currencies.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Field>
              </Grid>

              <Grid item xs={12}>
                <Button
                  data-testid='submit-button'
                  variant='contained'
                  color='primary'
                  disabled={isSubmitting || !isValid}
                  onClick={submitForm}
                  fullWidth
                >
                  {isSubmitting
                    ? t('forms.account.submittingLabel')
                    : t('forms.account.submitButtonLabel')}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </div>
  );
};
