import sites from "./sites.js";
import { getTargetUrl } from "./utils.js";

let sitesLocal = [];

// 核心功能：拦截导航请求并重定向到目标URL
chrome.webNavigation.onBeforeNavigate.addListener(
  (details) => {
    try {
      const url = new URL(details.url);

      if (/^http/.test(url.protocol) === false) {
        return;
      }

      const site =
        sites.find((site) => site.hostname === url.hostname) ||
        sitesLocal.find((site) => site.hostname === url.hostname);

      if (site) {
        let targetUrl = "";

        if (typeof site.getTargetUrl === "function") {
          targetUrl = site.getTargetUrl(url);
        } else {
          targetUrl = getTargetUrl(url.searchParams);
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

function createContextMenus() {
  // 右键菜单
  const menuIdMap = {
    addToSkipList: "addToSkipList",
  };

  const extensionMenus = [
    {
      id: menuIdMap.addToSkipList,
      title: chrome.i18n.getMessage("menu_addToSkipList"),
      contexts: ["page"],
      action(info, tab) {
        // 打开 popup 页面
        chrome.action.openPopup();
      },
    },
  ];

  extensionMenus.forEach((menuItem) => {
    chrome.contextMenus.create({
      id: menuItem.id,
      title: menuItem.title,
      contexts: menuItem.contexts,
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

  createContextMenus();

  // 初始化用户数据
  chrome.storage.sync.get("sites").then((result) => {
    if (Array.isArray(result.sites)) {
      // 如果官方的 sites 已经收录了某些站点，则将其从用户配置列表中删除
      // 因为官方收录的最终会携带图标等信息，更齐全
      sitesLocal = result.sites.filter((localSite) =>
        sites.every((s) => s.hostname !== localSite.hostname)
      );

      // 将剔除重复后的 sitesLocal 保存到 storage
      chrome.storage.sync.set({ sites: sitesLocal });
    }
  });

  // 更新用户数据
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync") {
      if (changes.sites) {
        sitesLocal = changes.sites.newValue;
      }
    }
  });
});
