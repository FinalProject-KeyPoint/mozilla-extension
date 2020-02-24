(function() {
    const keypointServer = 'http://13.250.46.91:3000';
    browser.runtime.onMessage.addListener((message) => {
        switch(message.type)
        {
            case 'SET_CONTENT':
                const body = document.body;
                body.insertBefore(iframe, body.lastChild);
                break;
        }
    });
    
    undefined;
})();