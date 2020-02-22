import Mercury from "./mercury";

const summariseBtn = document.getElementById('summarise-btn');
let pageContent;
summariseBtn.addEventListener("click",() => {
    browser.tabs.query({active: true, currentWindow: true})
    .then((tabs) => {
        let pageUrl = tabs[0].url;
        return Mercury.parse(pageUrl,{contentType: "html"});
    })
    .then((parsedPage) => {
        console.log(parsedPage);
        
        pageContent = 
            parsedPage.content.replace(/<style[^>]*>.*<\/style>/gm, ' ')
            .replace(/<[^>]+>/gm, ' ')
            .replace(/([\r\n]+ +)+/gm, ' ');
        
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