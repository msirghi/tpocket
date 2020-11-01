import React, { FormEvent, useState } from 'react';
import { useLoginMutation } from '../generated/graphql';
import { RouteComponentProps } from 'react-router-dom';
import { setAccessToken } from '../accessToken';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ValidationService from '../utils/ValidationService';
import { AlertMessage } from '../components/alerts/AlertMessage';
import { AlertType } from '../commons/enums';
import { Link } from 'react-router-dom';

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
  paper: {
    marginTop: theme.spacing(12),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useLoginMutation();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const classes = useStyles();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    if (!ValidationService.validateEmailStr(email)) {
      setError( 
        'It seems like you have entered invalid email. Please, verify and check one more time.'
      );
      setSubmitting(false);
      return;
    }
    try {
      const response = await login({
        variables: {
          email,
          password
        }
      });
      if (response && response.data) {
        setAccessToken(response.data.login.accessToken);
      }

      history.push('/home');
    } catch (e) {
      setSubmitting(false);
      setError(
        e.networkError
          ? e.networkError.graphQLErrors.map((x: { message: string }) => x.message)[0]
          : 'Error'
      );
    }
  };

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          {error && <AlertMessage message={error} type={AlertType.ERROR} />}
          <TextField
            inputProps={{ 'data-testid': 'email-field' }}
            data-test='email-field'
            variant='outlined'
            margin='normal'
            value={email}
            onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='email'
            autoFocus
          />
          <TextField
            inputProps={{ 'data-testid': 'password-field' }}
            data-test='password-field'
            value={password}
            onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
          />
          <Button
            data-test='submit-button'
            data-testid='submit-button'
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
            disabled={!email || !password || isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Sign In'}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to='#'>Forgot password?</Link>
            </Grid>
            <Grid item>
              <Link to='/register'>{"Don't have an account? Sign Up"}</Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};
