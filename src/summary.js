const keypointServer = 'http://13.250.46.91:3000';
const contentDiv = document.getElementById("content");
const titleDiv = document.getElementById("title");
browser.runtime.onMessage.addListener(notify);
let article;
let summaryArr = [];

function notify(message) 
{
    switch(message.type)
    {
        case 'SET_CONTENT':
            article = message.article;
            contentDiv.innerHTML = message.article.content;
            titleDiv.innerText = message.article.title;
            fetch(`${keypointServer}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "isi_artikel": message.article.content
                })
            })
            .then(res => res.text())
            .then((arr) => {
                summaryArr = JSON.parse(arr);
                console.log(summaryArr);
                
            })
            break;
    }
    
}
    
const selectMode = document.getElementById('select-mode');
selectMode.addEventListener("input",(e) => {
    switch(e.target.value)
    {
        case 'o':
            contentDiv.innerHTML = article.content;
            break;
        case 's':
            contentDiv.innerHTML = `
                <ul>
                    ${summaryArr.reduce((acc,p) => {
                        return acc + `<li>${p}</li>`;
                    },'')}
                </ul>
            `;
            break;

    }
})