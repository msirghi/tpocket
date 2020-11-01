import React from 'react';
import './App.scss';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { SiteWrapper } from './components/layout/SiteWrapper';
import { CategoryPage } from './pages/CategoryPage';
import { SnackbarProvider } from 'notistack';
import { Account } from './pages/Account';
// import { TransitionGroup, CSSTransition } from 'react-transition-group';

const HomeWrapper = withRouter((props) => <Home {...props} />);

export const Routes = () => {
  return (
    <BrowserRouter>
      <Route
        render={({ location }) => (
          <SnackbarProvider maxSnack={3}>
            {/* <TransitionGroup>
              <CSSTransition
                key={location.key}
                classNames='fade'
                timeout={{ enter: 300, exit: 300 }}
                transitionEnterTimeout={300}
                transitionLeaveTimeout={300}
              > */}
            <>
              <Switch location={location}>
                <Route exact path={'/login'} component={Login} />
                <Route exact path={'/register'} component={Register} />
                <SiteWrapper>
                  <Route exact path={'/home'} component={HomeWrapper} />
                  <Route exact path={'/categories'} component={CategoryPage} />
                  <Route exact path={'/account'} component={Account} />
                </SiteWrapper>
              </Switch>
            </>
            {/* </CSSTransition> */}
            {/* </TransitionGroup> */}
          </SnackbarProvider>
        )}
      />
    </BrowserRouter>
  );
};
