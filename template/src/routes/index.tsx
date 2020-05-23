import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import Main from '../pages/Main';

const Routes: React.FC = () => (
  <Switch>
    <Route exact path="/" component={Main} isPrivate />
    <Route
      exact
      path="/nonauth"
      component={() => <h1>Rota não autenticada</h1>}
    />
  </Switch>
);

export default Routes;
