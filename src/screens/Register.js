/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';

const Register = ({ openLogin, userRegister }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    userRegister({ username, email, password });
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="username">Username:</label>
        <br />
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          type="text"
          id="username"
          name="username"
        />
        <br />
        <label htmlFor="email">Email:</label>
        <br />
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          type="email"
          id="email"
          name="email"
        />
        <br />
        <label htmlFor="password">Password:</label>
        <br />
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          type="password"
          id="password"
          name="password"
        />
        <br />
        <button type="submit" onSubmit={onSubmit}>
          Register
        </button>
      </form>

      <p>
        Already register? <a onClick={openLogin}>Login now!</a>
      </p>
    </div>
  );
};

export default Register;
