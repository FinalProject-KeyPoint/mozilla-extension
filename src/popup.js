import Mercury from "./mercury";

const summariseBtn = document.getElementById('summarise-btn');
let article;
let summaryArr = [];
let redactedArr = [];
let pArr = [];
// const keypointServer = 'http://13.250.46.91:3000';
const keypointServer = 'https://allh8project.japhendywijaya.xyz/articles/redactedArticle';

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
        })
    })
    .then(() => {
        setTimeout(() => {
            browser.runtime.sendMessage({
                type: "SET_CONTENT",
                article,
                pArr,
                summaryLength: userSetSumLength
            })
        }, 500);
    })

}

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
                    summaryDiv.style.backgroundColor = '#fff';
                    summaryDiv.style.position = 'fixed';
                    summaryDiv.style.overflowY = 'scroll';
                    summaryDiv.style.width = '100%';
                    summaryDiv.style.height = '100%';
                    summaryDiv.style.top = '0px';
                    summaryDiv.style.left = '0px';
                    summaryDiv.style.zIndex = '1000';
                    summaryDiv.style.padding = '100px';
    
                    var backBtn = document.createElement("button");
                    backBtn.innerText = 'Back';
                    backBtn.style.all = 'revert';
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
                    articleTitle.style.all = 'revert';
    
                    var articleAuthor = document.createElement("h4");
                    articleAuthor.innerText = \`${article.author}\`;
                    articleAuthor.style.all = 'revert';
                    
                    var keyPointsList = document.createElement('ul');
                    keyPointsList.id = 'key-points-ul';
                    keyPointsList.style.all = 'revert';
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
                    articleContent.style.all = 'revert';                
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

        
    })
    
}

summariseBtn.addEventListener("click", () => {
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
});