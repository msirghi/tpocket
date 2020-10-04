import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { CheckboxWithLabel, TextField } from 'formik-material-ui';
import { Formik, Form, Field } from 'formik';
import { Button, LinearProgress } from '@material-ui/core';
import { isPasswordWeak, validateEmailStr } from '../../utils/extensions';
import { useRegisterMutation } from '../../generated/graphql';
import { AlertMessage } from '../alerts/AlertMessage';
import { AlertType } from '../../commons/enums';
import { AES } from 'crypto-js';

type Props = {
  handleNext: () => void;
  handleRegister: (id: number) => void;
};

interface Values {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  repeatPassword: string;
  checked: boolean;
}

export const AboutYouForm: React.FC<Props> = ({ handleNext, handleRegister }) => {
  const [register] = useRegisterMutation();
  const [error, setError] = useState<string | null>();

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
      validate={(values) => {
        const errors: Partial<Values> = {};
        const { email, password, repeatPassword, firstName, lastName } = values;
        if (!email) {
          errors.email = 'Required.';
        } else if (validateEmailStr(email)) {
          errors.email = 'Invalid email address.';
        }

        if (isPasswordWeak(password)) {
          errors.password = 'Password is too weak.';
        } else if (password !== repeatPassword) {
          errors.password = 'Passwords do not match.';
        }

        if (firstName.length < 2) {
          errors.firstName = 'Enter a valid first name';
        }
        if (lastName.length < 2) {
          errors.lastName = 'Enter a valid last name';
        }

        return errors;
      }}
      onSubmit={async (values, { setSubmitting }) => await onSubmit(values, setSubmitting)}
    >
      {({ submitForm, isSubmitting, values }) => (
        <Form>
          {isSubmitting && <LinearProgress />}
          <Typography variant='h6' gutterBottom>
            About You
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Field
                component={TextField}
                required
                name='firstName'
                label='First name'
                fullWidth
                autoComplete='given-name'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field
                component={TextField}
                id='lastName'
                name='lastName'
                label='Last name'
                fullWidth
                autoComplete='family-name'
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={TextField}
                required
                id='email'
                name='email'
                label='Email'
                fullWidth
                autoComplete='email'
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Field
                component={TextField}
                required
                type='password'
                id='password'
                name='password'
                label='Password'
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Field
                component={TextField}
                required
                type='password'
                id='repeatPassword'
                name='repeatPassword'
                label='Repeat your password'
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={CheckboxWithLabel}
                type='checkbox'
                Label={{ label: 'Accept Terms and Conditions' }}
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
                Next
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};
