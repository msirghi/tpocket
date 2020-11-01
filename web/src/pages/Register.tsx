import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Button from '@material-ui/core/Button';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import { AboutYouForm } from '../components/forms/AboutYouForm';
import { AdditionalInfoForm } from '../components/forms/AdditionalInfoForm';
import { AES, enc } from 'crypto-js';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link to='https://material-ui.com/'>TPocket</Link> {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative'
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3)
    }
  },
  stepper: {
    padding: theme.spacing(3, 0, 5)
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1)
  }
}));

const steps = ['About You', 'Additional Info', 'Done!'];
let encryptedUserId: string;
let userId;

export const Register = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const tempId = localStorage.getItem('tempId');
    if (tempId) {
      setEncryptedUserId(tempId);
      const decrypted = AES.decrypt(tempId, process.env.REACT_APP_TEMP_ID_KEY!);
      // @ts-ignore
      userId = +decrypted.toString(enc.Utf8);
      setActiveStep(1);
    }
  }, []);

  const setEncryptedUserId = (userId: string) => (encryptedUserId = userId);

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <AboutYouForm
            handleNext={handleNext}
            setEncryptedUserId={setEncryptedUserId}
            handleRegister={handleRegister}
          />
        );
      case 1:
        return <AdditionalInfoForm handleNext={handleNext} />;
      default:
        throw new Error(t('errors.unknownStep'));
    }
  };

  const handleRegister = (id: number) => (userId = id);

  const handleNext = () => setActiveStep(activeStep + 1);

  return (
    <>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component='h1' variant='h4' align='center'>
            {t('forms.register.title')}
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <>
            {activeStep === steps.length - 1 ? (
              <>
                <Typography variant='h5' gutterBottom>
                {t('forms.register.doneTitle')}
                </Typography>
                <div className='row row-center'>
                  <img
                    width='75%'
                    height='75%'
                    src='https://i.pinimg.com/originals/8c/95/7b/8c957b1d5b6262dd171f288eeadcabd7.gif'
                    alt=''
                  ></img>
                </div>
                <Typography variant='subtitle1'>{t('forms.register.doneDescription')}</Typography>
                <Typography variant='subtitle1'>
                  <Button color='primary' fullWidth>
                    <Link to='/login'>Login</Link>
                  </Button>
                </Typography>
              </>
            ) : (
              <>{getStepContent(activeStep)}</>
            )}
          </>
        </Paper>
        <Copyright />
      </main>
    </>
  );
};
