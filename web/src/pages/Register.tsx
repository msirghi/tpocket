import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { AboutYouForm } from '../components/forms/AboutYouForm';
import { AdditionalInfoForm } from '../components/forms/AdditionalInfoForm';
import { AES, enc } from 'crypto-js';

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' href='https://material-ui.com/'>
        TPocket
      </Link>{' '}
      {new Date().getFullYear()}
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
let userId: number;

export const Register = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const tempId = localStorage.getItem('tempId');
    if (tempId) {
      const decrypted = AES.decrypt(tempId, process.env.REACT_APP_TEMP_ID_KEY!);
      // @ts-ignore
      userId = +decrypted.toString(enc.Utf8);
      setActiveStep(1);
    }
  }, []);

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <AboutYouForm handleNext={handleNext} handleRegister={handleRegister} />;
      case 1:
        return <AdditionalInfoForm handleNext={handleNext} />;
      default:
        throw new Error('Unknown step');
    }
  };

  const handleRegister = (id: number) => (userId = id);

  const handleNext = () => setActiveStep(activeStep + 1);

  const handleBack = () => setActiveStep(activeStep - 1);

  return (
    <>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component='h1' variant='h4' align='center'>
            Registration
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
                  Almost done!
                </Typography>
                <Typography variant='subtitle1'>
                  You're almost there! Please, check your mail box where you'll find mail with
                  activation link. The account will be activate instantly once you click on it.
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
