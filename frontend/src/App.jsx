import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link,
} from 'react-router-dom';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import Dashboard from './Components/Dashboard';
import EditGame from './Components/EditGame';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/editgame/">
          <EditGame />
        </Route>
      </Switch>
      <Switch>
        <Route exact path="/dashboard">
          <Dashboard />
        </Route>
        <Route exact path="/signup">
          <SignUp />
        </Route>
        <Route exact path="/">
          <SignIn />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
