import Mercury from "./mercury";

const summariseBtn = document.getElementById('summarise-btn');
let article;

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
        browser.tabs.executeScript(currentTab.id,{
            code: `
                var summaryDiv = document.createElement("div");
                summaryDiv.id = 'Summary';
                summaryDiv.style.opacity ='0.8',
                summaryDiv.style.backgroundColor = '#ccc',
                summaryDiv.style.position = 'fixed',
                summaryDiv.style.width = '100%',
                summaryDiv.style.height = '100%',
                summaryDiv.style.top = '0px',
                summaryDiv.style.left = '0px',
                summaryDiv.style.zIndex = '1000'

                var articleTitle = document.createElement("h1");
                articleTitle.innerText = '${article.title}';

                var articleAuthor = document.createElement("h4");
                articleAuthor.innerText = '${article.author}';

                var articleContent = document.createElement("p");
                articleContent.innerText = '${article.content}';

                summaryDiv.appendChild(articleTitle);
                summaryDiv.appendChild(articleAuthor);
                summaryDiv.appendChild(articleContent);

                document.body.appendChild(summaryDiv);
                undefined;
            `
        })

    })
}

summariseBtn.addEventListener("click",openSummaryInSameTab);