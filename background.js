function checkForValidUrl(tabId, changeInfo, tab) {
    const url = tab.url;
    if (url.match(/https?:\/\/intranet.cpnv.ch\/classes\//) !== null) {
        browser.pageAction.show(tabId);
    } else {
        browser.pageAction.hide(tabId);
    }
}

browser.tabs.onUpdated.addListener(checkForValidUrl);