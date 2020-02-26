/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';
import Content from './injectedReact/Content';
// import './styles/tufte-css/latex.css';
// import './styles/tufte-css/tufte.css';


// const keypointServer = 'http://13.250.46.91:3000';
const keypointServer = 'https://allh8project.japhendywijaya.xyz/articles/redactedArticle';
const baseURL = `https://allh8project.japhendywijaya.xyz`
const bodyNode = document.body;

browser.runtime.onMessage.addListener(({ type, article, summaryLength, pArr }) => {
    switch (type) {
        case 'SET_CONTENT':
            injectApp(article, summaryLength, pArr);
            break;
    }
});

function Summary(props) {
    const [mode, setMode] = useState('o');
    const [loadSum, setLoadSum] = useState(true);
    const [summaryLength, setSummaryLength] = useState(props.summaryLength);
    const [redactedArr, setRedactedArr] = useState([]);
    const [donePosting, setDonePosting] = useState(false);
    const [toggleFontStyle, setToggleFontStyle] = useState('et-book');
    const loading = [
        'Loading',
        'Summarizing',
        'Reading',
        'Inspecting',
        'Thinking'
    ];
    const [loadingMsg] = useState(loading[Math.floor(Math.random() * loading.length)]);
    const [summaryArr, setSummaryArr] = useState([]);
    const { article, pArr } = props;

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
                return Math.floor(arrLength * 25 / 60);
            case 'm':
                return Math.floor(arrLength * 40 / 60);
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
            body: JSON.stringify(pArr)
        })
            .then(res => res.text())
            .then((res) => {
                const { keyPoint, redactedArticle } = JSON.parse(res);
                setSummaryArr(keyPoint);
                setRedactedArr(redactedArticle);
                console.log(summaryArr);
                setLoadSum(false);
            })

    }

    return (
        <article>
            <div>
                <select id="select-mode" value={mode} onChange={e => setMode(e.target.value)}>
                    <option value="o">Original</option>
                    <option value="r">Redacted</option>
                    <option value="s">Summarised</option>
                </select>

                <h1 className="tufte-css" id="title">{article.title}</h1>
                <p className="subtitle" id="author">{article.author}</p>
                <div id="content">
                    {/* 
    const [mode, setMode] = useState('o');
                    const [loadSum, setLoadSum] = useState(true);
                    const [summaryLength, setSummaryLength] = useState(props.summaryLength);
                    const [redactedArr, setRedactedArr] = useState([]); */}

                    <Content
                        mode={mode} setMode={setMode}
                        loadSum={loadSum} setLoadSum={setLoadSum}
                        summaryLength={summaryLength} setSummaryLength={setSummaryLength}
                        redactedArr={redactedArr} setRedactedArr={setRedactedArr}
                        article={article} loadingMsg={loadingMsg}
                    />
                    {/* {
                        mode === 'o'
                            ? (
                                <p>{article.content}</p>
                            )
                            : loadSum
                                ? loadingMsg + '...'
                                : mode === 's'
                                    ? (
                                        <p>
                                            <select id="summary-length" value={summaryLength} onChange={e => setSummaryLength(e.target.value)}>
                                                <option value="s">Short</option>
                                                <option value="m">Medium</option>
                                                <option value="l">Long</option>
                                            </select>
                                            <ul>
                                                {
                                                    summaryArr.map((p, i) => {
                                                        if (i <= sentencesToDisplay(summaryLength, summaryArr.length)) {
                                                            return <li>{p}</li>;
                                                        }
                                                    })
                                                }
                                            </ul>
                                        </p>
                                    )
                                    : mode === 'r'
                                        ? (
                                            <p>
                                                {
                                                    redactedArr.map((p) => {
                                                        return p + ' ';
                                                    })
                                                }
                                            </p>
                                        )
                                        : ''
                    } */}
                </div>
            </div>
        </article>
    );
}

function injectApp(article, summaryLength, pArr) {
    const summaryDiv = document.getElementById('Summary');
    if (!summaryDiv.innerHTML) {
        ReactDOM.render(<Summary article={article} summaryLength={summaryLength} pArr={pArr} />, summaryDiv);

    }
}

undefined;
