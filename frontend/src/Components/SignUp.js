import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import { SignUpInput, Form, SignInButton } from '../css/forms';

const SignUp = () => {
  // initialise variables
  const [emailAdd, setEmailAdd] = useState('');
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertState, setAlertState] = useState('none');
  const [successState, setSuccessState] = useState('none');

  // navigate back to sign in
  const history = useHistory();
  const navigateToSignIn = () => {
    const path = '/';
    history.push(path);
  };

  // register attempt
  const registerAdmin = async (event) => {
    event.preventDefault();
    const registerOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: emailAdd,
        password: pass,
        name: username,
      }),
    };
    await fetch('http://localhost:5005/admin/auth/register', registerOptions)
      .then((response) => {
        if (response.ok) { // if status code is 200
          return response.json();
        } // if status code is not 200
        return Promise.reject(response.json());
      })
      .then(() => {
        setSuccessState('flex');
        setTimeout(() => {
          navigateToSignIn();
        }, 3000);
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
      <Alert variant="outlined" severity="success" style={{ display: successState }} onClose={() => { setSuccessState('none'); }}>Account Created! Redirecting back to Sign In in 3 seconds...</Alert>
      <h1>Sign Up</h1>
      <Form onSubmit={(e) => registerAdmin(e)}>
        <TextField variant="outlined" label="Email" required="true" type="text" value={emailAdd} onChange={(e) => setEmailAdd(e.target.value)} />
        <br />
        <TextField variant="outlined" label="Name" required="true" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        <br />
        <TextField variant="outlined" label="Password" required="true" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
        <br />
        <SignUpInput type="submit" value="Submit" />
        <br />
        <Link to="/"><SignInButton aria-label="redirect to sign in page">Back to Sign In</SignInButton></Link>
      </Form>
    </div>
  );
};

export default SignUp;
