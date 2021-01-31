import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import { SignInInput, Form, SignUpButton } from '../css/forms';

const SignIn = () => {
  // initialising variables
  const [emailAdd, setEmailAdd] = useState('');
  const [pass, setPass] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertState, setAlertState] = useState('none');

  // routing to dashboard
  const history = useHistory();
  const navigateToDashboard = () => {
    const path = '/dashboard';
    history.push(path);
  };

  // attempts to log in
  const logIn = async (event) => {
    event.preventDefault();
    const loginOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: emailAdd,
        password: pass,
      }),
    };
    await fetch('http://localhost:5005/admin/auth/login', loginOptions)
      .then((response) => {
        if (response.ok) { // if status code is 200
          return response.json();
        } // if status code is not 200
        return Promise.reject(response.json());
      })
      .then((json) => {
        localStorage.setItem('token', json.token);
        navigateToDashboard();
      })
      .catch((error) => {
        Promise.resolve(error)
          .then((e) => {
            setAlertMsg(e.error);
            setAlertState('flex');
          });
      });
  };
  return (
    <div>
      <Alert variant="outlined" severity="error" style={{ display: alertState }} onClose={() => { setAlertState('none'); }}>{alertMsg}</Alert>
      <h1>Sign In</h1>
      <Form onSubmit={logIn}>
        <TextField variant="outlined" label="Email" required="true" type="text" value={emailAdd} onChange={(e) => setEmailAdd(e.target.value)} />
        <br />
        <TextField variant="outlined" label="Password" required="true" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
        <br />
        <SignInInput type="submit" value="Log In" />
        <br />
        <Link to="/signup"><SignUpButton aria-label="redirect to sign up page" style={{ width: '100%' }}>Sign Up</SignUpButton></Link>
      </Form>
    </div>
  );
};
export default SignIn;
