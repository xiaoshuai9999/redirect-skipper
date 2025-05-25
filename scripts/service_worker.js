import sites from "./sites.js";

let sitesLocal = [];
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync") {
    if (changes.sites) {
      sitesLocal = changes.sites.newValue;
    }
  }
});

chrome.webNavigation.onBeforeNavigate.addListener(
  (details) => {
    try {
      const url = new URL(details.url);

      if (/^http/.test(url.protocol) === false) {
        return;
      }

      const site = sites.find((site) => site.hostname === url.hostname);

      if (site) {
        let targetUrl = "";

        if (typeof site.getTargetUrl === "function") {
          targetUrl = site.getTargetUrl(url);
        } else {
          targetUrl =
            url.searchParams.get("target") ||
            url.searchParams.get("url") ||
            url.searchParams.get("u") ||
            url.searchParams.get("link") ||
            url.searchParams.get("href");
        }

        // 更新标签页的URL为目标URL
        if (targetUrl) {
          chrome.tabs.update(details.tabId, {
            url: decodeURIComponent(targetUrl),
          });
        }
      }
    } catch (error) {
      // do nothing
    }
  },
  { urls: ["<all_urls>"] }
);

function contentMenu() {
  // 右键菜单
  const menuIdMap = {
    addToSkipList: "addToSkipList",
  };

  const extensionMenus = [
    {
      id: menuIdMap.addToSkipList,
      title: chrome.i18n.getMessage("menuItemTitle"),
      contexts: ["page"],
      action(info, tab) {
        console.log("addToSkipList", info, tab);
      },
    },
  ];

  chrome.runtime.onInstalled.addListener(() => {
    extensionMenus.forEach((menuItem) => {
      chrome.contextMenus.create({
        id: menuItem.id,
        title: menuItem.title,
        contexts: menuItem.contexts,
      });
    });
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    const menuItem = extensionMenus.find((item) => item.id === info.menuItemId);
    menuItem?.action?.(info, tab);
  });
}

chrome.runtime.onInstalled.addListener(() => {
  const title = chrome.i18n.getMessage("actionTitle");
  if (title) {
    chrome.action.setTitle({ title });
  }
});
