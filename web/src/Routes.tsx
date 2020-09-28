import React from 'react';
import './App.scss';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Bye } from './pages/Bye';
import { SiteWrapper } from './components/layout/SiteWrapper';
import { CategoryPage } from './pages/CategoryPage';
import { SnackbarProvider } from 'notistack';

export const Routes = () => {
  return (
    <BrowserRouter>
      <SnackbarProvider maxSnack={3}>
        <Switch>
          <Route key={3} exact path={'/login'} component={Login} />
          <SiteWrapper>
            <Route key={1} exact path={'/home'} component={Home} />
            <Route key={2} exact path={'/register'} component={Register} />
            <Route key={4} exact path={'/bye'} component={Bye} />
            <Route
              key={5}
              exact
              path={'/categories'}
              component={CategoryPage}
            />
          </SiteWrapper>
        </Switch>
      </SnackbarProvider>
    </BrowserRouter>
  );
};
