import './App.scss';
import React from 'react';
import { BrowserRouter, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { SiteWrapper } from './components/layout/SiteWrapper';
import { CategoryPage } from './pages/CategoryPage';
import { SnackbarProvider } from 'notistack';
import { Account } from './pages/Account';
import { PrivateRoute } from './utils/PrivateRoute';
import { NoAuthRoute } from './utils/NoAuthRoute';
import { ExpenseHistory } from './pages/ExpenseHistory';

const HomeWrapper = withRouter((props) => <Home {...props} />);

export const Routes = () => {
  return (
    <BrowserRouter>
      <Route
        render={({ location }) => (
          <SnackbarProvider maxSnack={3}>
            <Switch location={location}>
              <NoAuthRoute exact path={'/login'} Component={Login} />
              <NoAuthRoute exact path={'/register'} Component={Register} />
              <SiteWrapper>
                <PrivateRoute exact path={'/home'} Component={HomeWrapper} />
                <PrivateRoute exact path={'/categories'} Component={CategoryPage} />
                <PrivateRoute exact path={'/account'} Component={Account} />
                <PrivateRoute exact path={'/expenseHistory'} Component={ExpenseHistory} />
                <Redirect from='/' to='/home' />
              </SiteWrapper>
            </Switch>
          </SnackbarProvider>
        )}
      />
    </BrowserRouter>
  );
};
