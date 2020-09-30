import React from 'react';
import './App.scss';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Bye } from './pages/Bye';
import { SiteWrapper } from './components/layout/SiteWrapper';
import { CategoryPage } from './pages/CategoryPage';
import { SnackbarProvider } from 'notistack';
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
                <Route key={3} exact path={'/login'} component={Login} />
                <SiteWrapper>
                  <Route key={1} exact path={'/home'} component={HomeWrapper} />
                  <Route key={2} exact path={'/register'} component={Register} />
                  <Route key={4} exact path={'/bye'} component={Bye} />
                  <Route key={5} exact path={'/categories'} component={CategoryPage} />
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
