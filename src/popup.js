import Mercury from "./mercury";
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Axios from 'axios';
import Login from './screens/Login';
import Register from './screens/Register';

const summariseBtn = document.getElementById('summarise-btn');
let article;
let summaryArr = [];
let redactedArr = [];
let pArr = [];
// const keypointServer = 'http://13.250.46.91:3000';
const keypointServer = 'https://allh8project.japhendywijaya.xyz/articles/redactedArticle';

const baseURL = `https://allh8project.japhendywijaya.xyz`

const Popup = () => {
  const [state, setState] = useState('login');
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(() => {
    browser.storage.local
      .get('token')
      .then(({ token }) => setIsLogin(Boolean(token)));
  });

  function openSummaryInSameTab()
{
    let currentTab;
    browser.tabs.query({active: true, currentWindow: true})
    .then((tabs) => {
        currentTab = tabs[0];
        let pageUrl = tabs[0].url;
        return Mercury.parse(pageUrl,{contentType: "html"});
    })
    .then((parsedPage) => {
        pArr = parsedPage.content.replace(/<style[^>]*>.*<\/style>/gm, ' ')
            .replace(/Page [0-9]/gm, ' ')
            .replace(/<p>/igm,' ')
            .replace(/(<\/?(?:p|br)[^>]*>)|<[^>]+>/igm, '$1')
            .replace(/([\r\n]+ +)+/gm, ' ')
            .replace(/&nbsp;/gm,' ')
            .split(/<\/p>|<br>/igm)
            .map(p => p ? p.trim() : "")
            .filter(p => p.length > 0)
        
        article = parsedPage;
        article.content = 
            article.content.replace(/<style[^>]*>.*<\/style>/gm, ' ')
            .replace(/Page [0-9]/gm, ' ')
            .replace(/<[^>]+>/gm, ' ')
            .replace(/([\r\n]+ +)+/gm, ' ')
            .replace(/&nbsp;/gm,' ');
        
        fetch(keypointServer, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pArr)
        })
        .then(res => res.text())
        .then((res) => {
            let {keyPoint, redactedArticle} = JSON.parse(res);
            summaryArr = keyPoint;
            redactedArr = redactedArticle;
            return browser.storage.sync.get()
        })
        .then(({summaryLength}) => {
            return browser.tabs.executeScript(currentTab.id,{
                code: `
                    var summaryLength = '${summaryLength}';
                    var summaryArr = JSON.parse(String.raw \`${JSON.stringify(summaryArr)}\`);
    
                    function sentencesToDisplay(summaryLength,arrLength)
                    {
                        switch(summaryLength)
                        {
                            case 's':
                                return Math.floor(arrLength*25/60);
                            case 'm':
                                return Math.floor(arrLength*40/60);
                            case 'l':
                            default:
                                return arrLength;
    
                        }
                    }
    
                    var summaryDiv = document.createElement("div");
                    summaryDiv.id = 'Summary';
    
                    var backBtn = document.createElement("button");
                    backBtn.innerText = 'Back';
                    backBtn.onclick = () => summaryDiv.remove();
    
                    var modeSelector = document.createElement("select");
                    modeSelector.id = "select-mode";
                    modeSelector.innerHTML = \`
                        <option value="o">Original</option>
                        <option value="r">Redacted</option>
                        <option value="s">Summarised</option>
                    \`;
    
                    var articleTitle = document.createElement("h1");
                    articleTitle.innerText = \`${article.title}\`;
    
                    var articleAuthor = document.createElement("h4");
                    articleAuthor.innerText = \`${article.author}\`;
                    
                    var keyPointsList = document.createElement('ul');
                    keyPointsList.id = 'key-points-ul';
                    function populateKeyPoints()
                    {
                        keyPointsList.innerHTML =
                            summaryArr.reduce((acc,p,i) => {
                                if(i<=sentencesToDisplay(summaryLength,summaryArr.length))
                                {
                                    return acc + '<li>' + p + '</li>'
                                }
                                else
                                {
                                    return acc;
                                }
                            },'')
    
                    }
    
                    var lengthSelector = document.createElement("select");
                    lengthSelector.id = "select-length";
                    lengthSelector.innerHTML = \`
                        <option value="s">Short</option>
                        <option value="m">Medium</option>
                        <option value="l">Long</option>
                    \`;
                    lengthSelector.value = summaryLength;
    
                    var articleContent = document.createElement("p");
                    articleContent.innerText = \`${article.content}\`;  
                    modeSelector.onchange = (e) => {
                        if(e.target.value === 'o')
                        {
                            articleContent.innerText = \`${article.content}\`;              
                        }                    
                        else if(e.target.value === 's')
                        {
                            articleContent.innerText = '';
                            articleContent.appendChild(lengthSelector);
                            populateKeyPoints();
                            articleContent.appendChild(keyPointsList);
                        }
                        else if(e.target.value === 'r')
                        {
                            articleContent.innerText = \`${redactedArr.join(' ')}\`;
                        }
                    }
    
                    lengthSelector.onchange = (e) => {
                        summaryLength = e.target.value;
                        populateKeyPoints();
                    }
    
                    summaryDiv.appendChild(backBtn);
                    summaryDiv.appendChild(modeSelector);
                    summaryDiv.appendChild(articleTitle);
                    summaryDiv.appendChild(articleAuthor);
                    summaryDiv.appendChild(articleContent);
    
                    document.body.appendChild(summaryDiv);
    
                    document.onkeydown = (e) => {
                        if(e.key === "Escape")
                        {
                            summaryDiv.remove();
                        }
                    }
                    undefined;
                `
            })

        })
        .then(() => {
            return browser.tabs.insertCSS(currentTab.id,{
                file: "/summary.css"
            })
        })
        .then(null)

        
    })
    
}
function openSummaryInNewTab()
{
    let userSetSumLength
    browser.storage.sync.get()
    .then(({summaryLength}) => {
        userSetSumLength = summaryLength || 'm';
        return browser.tabs.query({active: true, currentWindow: true})
    })
    .then((tabs) => {
        let pageUrl = tabs[0].url;
        return Mercury.parse(pageUrl,{contentType: "html"});
    })
    .then((parsedPage) => {
        pArr = parsedPage.content.replace(/<style[^>]*>.*<\/style>/gm, ' ')
            .replace(/Page [0-9]/gm, ' ')
            .replace(/<p>/igm,' ')
            .replace(/(<\/?(?:p|br)[^>]*>)|<[^>]+>/igm, '$1')
            .replace(/([\r\n]+ +)+/gm, ' ')
            .replace(/&nbsp;/gm,' ')
            .split(/<\/p>|<br>/i)
            .map(p => p.trim())
            .filter(p => p.length > 0)

        article = parsedPage;
        article.content = article.content.replace(/<style[^>]*>.*<\/style>/gm, ' ')
            .replace(/Page [0-9]/gm, ' ')
            .replace(/<[^>]+>/gm, ' ')
            .replace(/([\r\n]+ +)+/gm, ' ')
            .replace(/&nbsp;/gm,' ');
        

        return browser.tabs.create({
          url: '/summary.html'
        });
      })
      .then(() => {
        console.log(article);
        setTimeout(() => {
            browser.runtime.sendMessage({
                type: "SET_CONTENT",
                article,
                pArr,
                summaryLength: userSetSumLength
            })
        }, 500);
      });
  };

  // const openSummarizeTab = () => {
  //   let article = null;

  //   browser.tabs
  //     .query({ active: true, currentWindow: true })
  //     .then(tabs => {
  //       const pageUrl = tabs[0].url;

  //       return Mercury.parse(pageUrl, { contentType: 'html' });
  //     })
  //     .then(parsedPage => {
  //       parsedPage.content = parsedPage.content
  //         .replace(/<style[^>]*>.*<\/style>/gm, ' ')
  //         .replace(/Page [0-9]/gm, ' ')
  //         .replace(/<[^>]+>/gm, ' ')
  //         .replace(/([\r\n]+ +)+/gm, ' ')
  //         .replace(/&nbsp;/gm, ' ');

  //       article = parsedPage;
  //       return browser.tabs.create({
  //         url: '/summary.html'
  //       });
  //     })
  //     .then(() => {
  //       console.log(article);
  //       setTimeout(() => {
  //         browser.runtime.sendMessage({
  //           type: 'SET_CONTENT',
  //           article
  //         });
  //       }, 500);
  //     });
  // };

  const userLogin = oldUser => {
    console.log(`OK`)
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

  const openSummarize = () => {
    console.log(`masuk`)
    browser.storage.sync.get()
    .then(({openLocation}) => {
        switch(openLocation)
        {
            case 'newtab':
                openSummaryInNewTab();
                break;
            case 'sametab':
                openSummaryInSameTab();
                break;
        }
    })
  }

  console.log('isLogin', isLogin);
  if (isLogin) {
    return (
      <div>
        <button type="button" onClick={openSummarize}>
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

// summariseBtn.addEventListener("click", () => {
//     browser.storage.sync.get()
//     .then(({openLocation}) => {
//         switch(openLocation)
//         {
//             case 'newtab':
//                 openSummaryInNewTab();
//                 break;
//             case 'sametab':
//                 openSummaryInSameTab();
//                 break;
//         }
//     })
// });
