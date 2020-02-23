import React, {useState} from 'react'
import ReactDOM from 'react-dom'

const keypointServer = 'http://13.250.46.91:3000';
browser.runtime.onMessage.addListener(notify);

function Summary(props)
{
    const [mode, setMode] = useState('o');
    const [loadSum, setLoadSum] = useState(true);
    const loading = [
        'Loading',
        'Summarizing',
        'Reading',
        'Inspecting',
        'Thinking'
    ];
    const [loadingMsg] = useState(loading[Math.floor(Math.random()*loading.length)]);
    const [summaryArr, setSummaryArr] = useState([]);
    const {article} = props;
    
    fetch(`${keypointServer}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "isi_artikel": article.content
        })
    })
    .then(res => res.text())
    .then((arr) => {
        setSummaryArr(JSON.parse(arr));
        // console.log(summaryArr);
        setLoadSum(false);
    })

    return (
        <div>
            <select id="select-mode" value={mode} onChange={e=>setMode(e.target.value)}>
                <option value="o">Original</option>
                <option value="s">Summarised</option>
            </select>
            
            <h1 id="title">{article.title}</h1>
            <h4 id="author">{article.author}</h4>
            <div id="content">
                {
                    mode === 'o'
                    ? article.content
                    : mode === 's'
                      ? loadSum
                        ? loadingMsg + '...'
                        : <ul>
                            {
                                summaryArr.map((p) => {
                                    return <li>{p}</li>;
                                })
                            }
                        </ul>
                      : ''
                }
            </div>
        </div>
    );
}

function injectApp(article)
{
    const summaryDiv = document.getElementById('Summary');
    if(!summaryDiv.innerHTML)
    {
        ReactDOM.render(<Summary article={article} />, summaryDiv);

    }
}

function notify(message) 
{
    switch(message.type)
    {
        case 'SET_CONTENT':
            injectApp(message.article);
            break;
    }
    
}