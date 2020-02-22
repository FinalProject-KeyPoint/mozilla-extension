import Mercury from '@postlight/mercury-parser'

const summariseBtn = document.getElementById('summarise-btn');
let pageContent;
summariseBtn.addEventListener("click",() => {
    browser.tabs.query({active: true, currentWindow: true})
    .then((tabs) => {
        let pageUrl = tabs[0].url;
        return Mercury.parse(pageUrl,{contentType: "text"});
    })
    .then((parsedPage) => {
        pageContent = parsedPage.content;
        
        return browser.tabs.create({
            url: '/summary.html'
        })
    })
    .then(() => {
        setTimeout(() => {
            browser.runtime.sendMessage({
                type: "SET_CONTENT",
                content: pageContent
            })
        }, 500);
    })

})