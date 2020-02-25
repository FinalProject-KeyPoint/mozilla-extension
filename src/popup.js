/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';
import Mercury from './mercury';
import Login from './screens/Login';
import Register from './screens/Register';

const baseURL = 'https://allh8project.japhendywijaya.xyz';

const Popup = () => {
  const [state, setState] = useState('login');
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(() => {
    browser.storage.local
      .get('token')
      .then(({ token }) => setIsLogin(Boolean(token)));
  });

  const openSummarizeTab = () => {
    let article = null;

    browser.tabs
      .query({ active: true, currentWindow: true })
      .then(tabs => {
        const pageUrl = tabs[0].url;

        return Mercury.parse(pageUrl, { contentType: 'html' });
      })
      .then(parsedPage => {
        parsedPage.content = parsedPage.content
          .replace(/<style[^>]*>.*<\/style>/gm, ' ')
          .replace(/Page [0-9]/gm, ' ')
          .replace(/<[^>]+>/gm, ' ')
          .replace(/([\r\n]+ +)+/gm, ' ')
          .replace(/&nbsp;/gm, ' ');

        article = parsedPage;
        return browser.tabs.create({
          url: '/summary.html'
        });
      })
      .then(() => {
        console.log(article);
        setTimeout(() => {
          browser.runtime.sendMessage({
            type: 'SET_CONTENT',
            article
          });
        }, 500);
      });
  };

  const userLogin = oldUser => {
    Axios.post('/users/login', oldUser, { baseURL })
      .then(({ data }) => browser.storage.local.set({ token: data.token }))
      .then(() => setIsLogin(true))
      .catch(({ response }) => setError(response.data.message));
  };

  const userRegister = newUser => {
    Axios.post('/users/register', newUser, { baseURL })
      .then(({ data }) => browser.storage.local.set({ token: data.token }))
      .then(() => setIsLogin(true));
  };

  const userLogOut = () => {
    browser.storage.local.remove('token').then(() => {
      setIsLogin(null);
      setState('login');
      setError(null);
    });
  };

  console.log('isLogin', isLogin);
  if (isLogin) {
    return (
      <div>
        <button type="button" onClick={openSummarizeTab}>
          Summarize this article!
        </button>
        <br />
        <button type="button" onClick={userLogOut}>
          Log Out
        </button>
      </div>
    );
  }

  if (state === 'login') {
    return (
      <div className="container d-flex flex-column align-items-end w-100 h-100">
        <Login
          className="mt-5"
          openRegister={() => setState('register')}
          userLogin={userLogin}
        />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <Register
        openLogin={() => setState('login')}
        userRegister={userRegister}
      />
    </div>
  );
};

const App = document.getElementById('app');
ReactDOM.render(<Popup />, App);
