/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';

const Login = ({ openRegister, userLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = e => {
    e.preventDefault();
    userLogin({ email, password });
  };

  return (
    <div className="container">
      <h4>Log into your account</h4>
      <small className="form-text text-muted mt-1">
        New here? <a onClick={openRegister}>Sign up</a>
      </small>
      {/* <br /> */}
      <form onSubmit={onSubmit}>
        {/* <label htmlFor="email">Email:</label> */}
        {/* <br /> */}
        <input
          className="form-control mt-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder="Email"
          type="email"
          id="email"
          name="email"
        />
        {/* <br /> */}
        {/* <label htmlFor="password">Password:</label> */}
        {/* <br /> */}
        <input
          value={password}
          className="form-control mt-1"
          onChange={e => setPassword(e.target.value)}
          required
          placeholder="Password"
          type="password"
          id="password"
          name="password"
        />
        {/* <br /> */}
        <button
          className="btn btn-primary mt-1"
          onSubmit={onSubmit}
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
