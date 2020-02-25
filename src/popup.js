import Mercury from "./mercury";

const summariseBtn = document.getElementById('summarise-btn');
let article;
let summaryArr = [];
const keypointServer = 'http://13.250.46.91:3000';

function openSummaryInNewTab()
{
    browser.tabs.query({active: true, currentWindow: true})
    .then((tabs) => {
        let pageUrl = tabs[0].url;
        return Mercury.parse(pageUrl,{contentType: "html"});
    })
    .then((parsedPage) => {
        console.log("mercury:", parsedPage);
        
        parsedPage.content = 
            parsedPage.content.replace(/<style[^>]*>.*<\/style>/gm, ' ')
            .replace(/Page [0-9]/gm, ' ')
            .replace(/<[^>]+>/gm, ' ')
            .replace(/([\r\n]+ +)+/gm, ' ')
            .replace(/&nbsp;/gm,' ');
        
        article = parsedPage;
        return browser.tabs.create({
            url: '/summary.html'
        })
    })
    .then(() => {
        setTimeout(() => {
            browser.runtime.sendMessage({
                type: "SET_CONTENT",
                article
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
        console.log("mercury:", parsedPage);
        
        parsedPage.content = 
            parsedPage.content.replace(/<style[^>]*>.*<\/style>/gm, ' ')
            .replace(/Page [0-9]/gm, ' ')
            .replace(/<[^>]+>/gm, ' ')
            .replace(/([\r\n]+ +)+/gm, ' ')
            .replace(/&nbsp;/gm,' ');

        article = parsedPage;
        
        return fetch(keypointServer, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "isi_artikel": article.content
            })
        })

    })    
    .then(res => res.text())
    .then((arr) => {
        summaryArr = JSON.parse(arr);
        return browser.tabs.executeScript(currentTab.id,{
            code: `
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
                    <option value="s">Summarised</option>
                \`;

                var articleTitle = document.createElement("h1");
                articleTitle.innerText = \`${article.title}\`;
                articleTitle.style.all = 'revert';

                var articleAuthor = document.createElement("h4");
                articleAuthor.innerText = \`${article.author}\`;
                articleAuthor.style.all = 'revert';

                var articleContent = document.createElement("p");
                articleContent.innerText = \`${article.content}\`;
                articleContent.style.all = 'revert';                
                modeSelector.onchange = (e) => {
                    if(e.target.value === 'o')
                    {
                        articleContent.innerText = \`${article.content}\`;                        
                    }
                    else
                    {
                        articleContent.innerHTML = \`
                            <ul id='key-points-ul'>
                                ${
                                    summaryArr.reduce((acc,p) => {
                                        return acc + `<li>${p}</li>`
                                    },'')
                                }
                            </ul>
                        \`;
                    }
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