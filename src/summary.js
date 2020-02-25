/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';
// import './styles/tufte-css/latex.css';
// import './styles/tufte-css/tufte.css';

const keypointServer = 'http://13.250.46.91:3000';
const baseURL = 'https://allh8project.japhendywijaya.xyz';
const bodyNode = document.getElementsByTagName('body')[0];

browser.runtime.onMessage.addListener(message => {
  switch (message.type) {
    case 'SET_CONTENT':
      injectApp(message.article, message.summaryLength);
      break;
    default:
      break;
  }
});

function Summary(props) {
  const [mode, setMode] = useState('o');
  const [loadSum, setLoadSum] = useState(true);
  const [summaryLength, setSummaryLength] = useState(props.summaryLength);
  const [donePosting, setDonePosting] = useState(false);
  const loading = [
    'Loading',
    'Summarizing',
    'Reading',
    'Inspecting',
    'Thinking'
  ];
  const [loadingMsg] = useState(
    loading[Math.floor(Math.random() * loading.length)]
  );
  const [summaryArr, setSummaryArr] = useState([]);
  const [toggleFontStyle, setToggleFontStyle] = useState('et-book');
  const { article } = props;

  useEffect(() => {
    const { title, url } = article;

    if (!donePosting) {
      browser.storage.local
        .get('token')
        .then(({ token }) =>
          Axios.post(
            '/articles',
            { title, url, keyPoint: summaryArr },
            { headers: { token }, baseURL }
          )
        )
        .then(({ data }) => setDonePosting(true))
        .catch(err => console.log(err));
    }
  }, [summaryArr]);

  useEffect(() => {
    bodyNode.style.fontFamily = toggleFontStyle;
  }, [toggleFontStyle]);

  function sentencesToDisplay(summaryLength, arrLength) {
    switch (summaryLength) {
      case 's':
        return Math.floor((arrLength * 25) / 60);
      case 'm':
        return Math.floor((arrLength * 40) / 60);
      case 'l':
      default:
        return arrLength;
    }
  }

  if (loadSum) {
    fetch(keypointServer, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        isi_artikel: article.content
      })
    })
      .then(res => res.text())
      .then(arr => {
        setSummaryArr(JSON.parse(arr));
        // console.log(summaryArr);
        setLoadSum(false);
      });
  }

  return (
    <article>
      <h1 className="tufte-css" id="title">
        {article.title}
      </h1>
      <p className="subtitle" id="author">
        {article.author}
      </p>
      <div id="content">
        <section>
          <select
            id="select-mode"
            value={mode}
            onChange={e => setMode(e.target.value)}
          >
            <option value="o">Original</option>
            <option value="s">Summarised</option>
          </select>
        </section>
        <section>
          <select
            id="select-mode"
            value={toggleFontStyle}
            onChange={e => setToggleFontStyle(e.target.value)}
          >
            <option value="et-book">ET Book</option>
            <option value="Roboto">Roboto</option>
          </select>
        </section>
        {mode === 'o' ? (
          <section>
            <p>{article.content}</p>
          </section>
        ) : mode === 's' ? (
          loadSum ? (
            loadingMsg + '...'
          ) : (
            <section>
              <select
                id="summary-length"
                value={summaryLength}
                onChange={e => setSummaryLength(e.target.value)}
              >
                <option value="s">Short</option>
                <option value="m">Medium</option>
                <option value="l">Long</option>
              </select>
              {/* <section> */}
              <ol>
                {summaryArr.map((p, i) => {
                  if (
                    i <= sentencesToDisplay(summaryLength, summaryArr.length)
                  ) {
                    return <li>{p}</li>;
                  }
                })}
              </ol>
              {/* </section> */}
            </section>
          )
        ) : (
          ''
        )}
      </div>
    </article>
  );
}

function injectApp(article, summaryLength) {
  const summaryDiv = document.getElementById('Summary');
  if (!summaryDiv.innerHTML) {
    ReactDOM.render(
      <Summary article={article} summaryLength={summaryLength} />,
      summaryDiv
    );
  }
}

undefined;
