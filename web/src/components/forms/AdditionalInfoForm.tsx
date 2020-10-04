import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { CategorySelectForm } from './CategorySelectForm';
import { Formik, Field, Form } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import { FormHelperText } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';

type Props = {
  handleNext?: () => void;
};

type Values = {
  currecny: string;
  monthLimit: string;
};

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

export const AdditionalInfoForm: React.FC<Props> = ({}) => {
  const onSubmit = () => {};

  return (
    <Formik
      initialValues={{
        currency: '',
        monthLimit: ''
      }}
      onSubmit={(values) => {
        console.log('values :>> ', values);
      }}
    >
      {({ submitForm, isSubmitting, values }) => (
        <Form>
          <Typography variant='h6' gutterBottom>
            Additional Info
          </Typography>
          <Grid container spacing={3} className='row row-vert-end'>
            <Grid item xs={12} md={6}>
              <InputLabel shrink htmlFor='currency'>
                Your currency
              </InputLabel>
              <Field
                label='Currency'
                placeholder='Currency'
                fullWidth
                name='currency'
                component={Select}
                defaultValue='none'
              >
                {currencies.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field>
              <FormHelperText>Select your default currency</FormHelperText>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field
                name='monthLimit'
                component={TextField}
                type='number'
                required
                id='limit'
                label='Your month limit'
                fullWidth
                helperText='You will be notified when you reach this limit'
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <Typography variant='h6' gutterBottom>
                Expense categories
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} className='disable-padding'>
              <CategorySelectForm />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='subtitle1' gutterBottom>
                * 3 are required
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} className='row row-center'>
            <Button
              variant='contained'
              color='primary'
              disabled={isSubmitting || !values.currency || !values.monthLimit}
              onClick={submitForm}
              fullWidth
            >
              Submit
            </Button>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};
