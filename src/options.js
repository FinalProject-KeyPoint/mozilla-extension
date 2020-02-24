function saveOptions(e)
{
    e.preventDefault();
    let options = {};
    let data = new FormData(e.target);
    for(let opt of data)
    {
        options[opt[0]] = opt[1];        
    }
    
    browser.storage.sync.set(options);
    document.getElementById('message').innerText = 'Saved!';
}

function restoreOptions()
{  
    browser.storage.sync.get()
    .then((options) => {
        document.forms['options-form'][options.openLocation || 'newtab'].checked = true;
        document.forms['options-form'].summaryLength.value = options.summaryLength || 'm';
    });
}
  
document.addEventListener("DOMContentLoaded", restoreOptions);

document.querySelector('#options-form').addEventListener("submit",saveOptions);