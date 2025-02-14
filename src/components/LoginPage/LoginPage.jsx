import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import UserList from '../Userlist/UserList';
// this should be removed later - Brad is testing out some components
import UpdatesUser from '../UpdatesUser/UpdatesUser';
import DesignsList from '../DesignsList/DesignsList';

// end of testing imports

function LoginPage() {
  const [login_email, setLoginEmail] = useState('');
  const [password, setPassword] = useState('');
  const logIn = useStore((state) => state.logIn)
  const errorMessage = useStore((state) => state.authErrorMessage);
  const setAuthErrorMessage = useStore((state) => state.setAuthErrorMessage);

  useEffect(() => {
    // Clear the auth error message when the component unmounts:
    return () => {
      setAuthErrorMessage('');
    }
  }, [])

  const handleLogIn = (event) => {
    event.preventDefault();

    logIn({
      login_email: login_email,
      password: password,
    })
  };

  return (
    <>
      <h2>Login Page</h2>
      {/* Brad has commented out the userlist component because something is screwey with the DB */}
      <UserList/>
      <DesignsList/>
      <UpdatesUser/>

      <form onSubmit={handleLogIn}>
        <label htmlFor="login_email">Email:</label>
        <input
          type="email"
          id="login_email"
          required
          value={login_email}
          onChange={(e) => setLoginEmail(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">
          Log In
        </button>
      </form>
      { // Conditionally render login error:
        errorMessage && (
          <h3>{errorMessage}</h3>
        )
      }
    </>
  );
}


export default LoginPage;
