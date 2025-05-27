import sites from "./sites.js";
import { getTargetUrl } from "./utils.js";

let sitesLocal = [];
let isFuzzy = false;

// 核心功能：拦截导航请求并重定向到目标URL
chrome.webNavigation.onBeforeNavigate.addListener(
  (details) => {
    try {
      if (/^http/.test(details.url) === false) {
        return;
      }

      const url = new URL(details.url);

      const site =
        sites.find((site) => site.hostname === url.hostname) ||
        sitesLocal.find((site) => site.hostname === url.hostname);

      let targetUrl = "";

      if (site) {
        if (site.pathname) {
          // 如果站点有特定的路径，则检查当前URL的路径是否匹配
          if (!url.pathname.startsWith(site.pathname)) {
            return;
          }
        }

        if (typeof site.getTargetUrl === "function") {
          targetUrl = site.getTargetUrl(details.url);
        } else {
          targetUrl = getTargetUrl(url.searchParams);
        }
      } else if (isFuzzy) {
        // 如果没有找到匹配的站点且启用了模糊匹配，则尝试从URL中提取目标URL
        // 使用预定义的参数列表来获取目标URL
        targetUrl = getTargetUrl(url.searchParams, [
          "target",
          "link",
          "href",
          "url",
        ]);
      }

      // 更新标签页的URL为目标URL
      if (/^http/.test(targetUrl)) {
        chrome.tabs.update(details.tabId, {
          url: decodeURIComponent(targetUrl),
        });
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

  // createContextMenus();

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

  // 获取 fuzzy 设置
  chrome.storage.sync.get("fuzzy", (result) => {
    isFuzzy = result.fuzzy ?? false;
  });

  // 更新用户数据
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync") {
      if (changes.sites) {
        sitesLocal = changes.sites.newValue;
      }

      if (changes.fuzzy) {
        isFuzzy = changes.fuzzy.newValue;
      }
    }
  });
});
