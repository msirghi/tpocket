import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { CheckboxWithLabel, TextField } from 'formik-material-ui';
import { Formik, Form, Field } from 'formik';
import { Button, LinearProgress } from '@material-ui/core';
import { isPasswordWeak, validateEmailStr } from '../../utils/ValidationService';
import { useRegisterMutation } from '../../generated/graphql';
import { AlertMessage } from '../alerts/AlertMessage';
import { AlertType } from '../../commons/enums';
import { AES } from 'crypto-js';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type Props = {
  handleNext: () => void;
  handleRegister: (id: number) => void;
  setEncryptedUserId: (id: string) => void;
};

interface Values {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  repeatPassword: string;
  checked: boolean;
}

export const AboutYouForm: React.FC<Props> = ({
  handleNext,
  handleRegister,
  setEncryptedUserId
}) => {
  const [register] = useRegisterMutation();
  const [error, setError] = useState<string | null>();
  const { t } = useTranslation();

  const onSubmit = async (values: Values, setSubmitting: Function) => {
    const { email, password, firstName, lastName } = values;
    setSubmitting(true);
    setError(null);
    try {
      const response = await register({
        variables: {
          email,
          firstName,
          lastName,
          password
        }
      });
      handleNext();
      if (response && response.data) {
        const userId = response.data.register.id;
        handleRegister(+userId);
        const encrypted = AES.encrypt(userId, process.env.REACT_APP_TEMP_ID_KEY!);
        setEncryptedUserId(encrypted.toString());
        localStorage.setItem('tempId', encrypted.toString());
      }
    } catch (e) {
      setError(e.graphQLErrors.map((x: { message: string }) => x.message)[0]);
    }
  };

  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        repeatPassword: '',
        checked: false
      }}
      validateOnChange
      data-testid={'formik'}
      validate={(values) => {
        const errors: Partial<Values> = {};
        const { email, password, repeatPassword, firstName, lastName } = values;
        if (!email) {
          errors.email = t('errors.required');
        } else if (!validateEmailStr(email)) {
          errors.email = t('errors.invalidEmailShort');
        }

        if (isPasswordWeak(password)) {
          errors.password = t('errors.weakPassword');
        } else if (password !== repeatPassword) {
          errors.password = t('errors.passwordsDoNotMatch');
        }

        if (firstName.length < 2) {
          errors.firstName = t('errors.enterValidFirstName');
        }
        if (lastName.length < 2) {
          errors.lastName = t('errors.enterValidLastName');
        }
        return errors;
      }}
      onSubmit={async (values, { setSubmitting }) => await onSubmit(values, setSubmitting)}
    >
      {({ submitForm, isSubmitting, values }) => (
        <Form>
          {isSubmitting && <LinearProgress />}
          <Typography variant='h6' gutterBottom>
            {t('forms.aboutYou.title')}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Field
                component={TextField}
                required
                data-test='firstname-field'
                inputProps={{ 'data-testid': 'firstname-field' }}
                name='firstName'
                label={t('forms.aboutYou.firstName')}
                fullWidth
                autoComplete='given-name'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field
                data-test='lastname-field'
                inputProps={{ 'data-testid': 'lastname-field' }}
                component={TextField}
                id='lastName'
                name='lastName'
                label={t('forms.aboutYou.lastName')}
                fullWidth
                autoComplete='family-name'
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={TextField}
                data-test='email-field'
                inputProps={{ 'data-testid': 'email-field' }}
                required
                id='email'
                name='email'
                label={t('forms.aboutYou.email')}
                fullWidth
                autoComplete='email'
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Field
                component={TextField}
                data-test='password-field'
                inputProps={{ 'data-testid': 'password-field' }}
                required
                type='password'
                id='password'
                name='password'
                label={t('forms.aboutYou.password')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Field
                data-test='repeatPassword-field'
                inputProps={{ 'data-testid': 'repeatPassword-field' }}
                component={TextField}
                required
                type='password'
                id='repeatPassword'
                name='repeatPassword'
                label={t('forms.aboutYou.repeatPassword')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                data-test='terms-field'
                inputProps={{ 'data-testid': 'terms-field' }}
                component={CheckboxWithLabel}
                type='checkbox'
                Label={{ label: t('forms.aboutYou.acceptTermsAndConditions') }}
                name='checked'
              />
            </Grid>
            {error && (
              <Grid item xs={12}>
                <AlertMessage type={AlertType.ERROR} message={error} />
              </Grid>
            )}
            <Grid item xs={12} className='row row-center'>
              <Button
                data-testid={'submit-button'}
                variant='contained'
                color='primary'
                fullWidth
                disabled={
                  !values.email ||
                  !values.firstName ||
                  !values.lastName ||
                  !values.password ||
                  !values.repeatPassword ||
                  !values.checked ||
                  isSubmitting
                }
                onClick={submitForm}
              >
                {t('forms.aboutYou.next')}
              </Button>
            </Grid>
            <Typography className='text-center' style={{ width: '100%' }}>
              {t('forms.aboutYou.alreadyHaveAnAccount')}{' '}
              <Link to='/login'>{t('forms.aboutYou.signIn')}</Link>
            </Typography>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};
