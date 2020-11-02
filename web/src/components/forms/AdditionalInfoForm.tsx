import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { CategorySelectForm } from './CategorySelectForm';
import { Formik, Field, Form } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import { FormHelperText } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import { useInitAdditionalRegInfoMutation } from '../../generated/graphql';
import { useTranslation } from 'react-i18next';

type Props = {
  handleNext: () => void;
};

type Values = {
  currency: string;
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

export const AdditionalInfoForm: React.FC<Props> = ({ handleNext }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [initAdditionalRegInfo] = useInitAdditionalRegInfoMutation();
  const { t } = useTranslation();

  const onSubmit = async (values: Values, setSubmitting: (val: boolean) => void) => {
    const { currency, monthLimit } = values;

    try {
      const response = await initAdditionalRegInfo({
        variables: {
          categories: selectedCategories.join(','),
          currency,
          monthLimit: +monthLimit,
          userId: localStorage.getItem('tempId')!
        }
      });
      if (response && response.data!.initAdditionalRegInfo) {
        handleNext();
        localStorage.removeItem('tempId');
      }
    } catch (e) {}
  };

  const onCategorySelect = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories((prevState: string[]) => prevState.filter((val) => val !== category));
      return;
    }
    setSelectedCategories((prevState: string[]) => [...prevState, category]);
  };

  return (
    <Formik
      initialValues={{
        currency: '',
        monthLimit: ''
      }}
      onSubmit={(values: Values, { setSubmitting }) => {
        onSubmit(values, setSubmitting);
      }}
    >
      {({ submitForm, isSubmitting, values }) => (
        <Form>
          <Typography variant='h6' gutterBottom>
            {t('forms.additionalInfo.title')}
          </Typography>
          <Grid container spacing={3} className='row row-vert-end'>
            <Grid item xs={12} md={6}>
              <InputLabel shrink htmlFor='currency'>
                {t('forms.additionalInfo.yourCurrency')}
              </InputLabel>
              <Field
                inputProps={{ 'data-testid': 'currency-selector' }}
                label={t('forms.additionalInfo.currency')}
                placeholder={t('forms.additionalInfo.currency')}
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
              <FormHelperText>{t('forms.additionalInfo.selectDefaultCurrency')}</FormHelperText>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field
                inputProps={{ 'data-testid': 'limit-input' }}
                name='monthLimit'
                component={TextField}
                type='number'
                required
                id='limit'
                label={t('forms.additionalInfo.monthLimit')}
                fullWidth
                helperText={t('forms.additionalInfo.notifiedWhenReachedLimit')}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <Typography variant='h6' gutterBottom>
                {t('forms.additionalInfo.expenseCategories')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} className='disable-padding'>
              <CategorySelectForm
                selectedCategories={selectedCategories}
                onCategorySelect={onCategorySelect}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='subtitle1' gutterBottom>
                * {t('forms.additionalInfo.requiredCategories')}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} className='row row-center'>
            <Button
              data-testid='submit-button'
              variant='contained'
              color='primary'
              disabled={
                isSubmitting ||
                !values.currency ||
                !values.monthLimit ||
                selectedCategories.length < 3
              }
              onClick={submitForm}
              fullWidth
            >
              {isSubmitting ? t('forms.additionalInfo.sendingData') : t('forms.additionalInfo.submitButtonLabel')}
            </Button>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};
