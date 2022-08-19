const listeners = {
    loadContentScript: ({filename}, {tab}) => {
        return chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: [filename]
        });
    },
    download: chrome.downloads.download,
    downloadAll: ({dlOptArr}) => {
        return Promise.allSettled(dlOptArr.map(chrome.downloads.download));
    }
};
chrome.runtime.onMessage.addListener(function (request) {
    if(listeners.hasOwnProperty(request.command))
        return listeners[request.command].apply(null, arguments);
    console.error("unknown command " + request.command);
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.action.disable();
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {hostSuffix: ".facebook.com"}
                })
            ],
            actions: [new chrome.declarativeContent.ShowAction()]
        }]);
    });
});
