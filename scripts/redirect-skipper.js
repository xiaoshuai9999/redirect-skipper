function replaceALinks() {
  findByTarget();
}

function observerDocument() {
  const mb = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        if (mutation.addedNodes.length) {
          replaceALinks();
        }
      }
    }
  });
  mb.observe(document, { childList: true, subtree: true });
}

// 监听路由等事件
["hashchange", "popstate", "load"].forEach((event) => {
  window.addEventListener(event, async () => {
    replaceALinks();
    if (event === "load") {
      observerDocument();
      await updateHostnames();
      replaceALinks(); // 更新完数据后再执行一次
    }
  });
});

let hostnames = ["juejin.cn", "sspai.com", "www.zhihu.com"];

function updateHostnames() {
  return fetch(
    "https://raw.githubusercontent.com/dogodo-cc/redirect-skipper/master/sites.json"
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok");
    })
    .then((data) => {
      // 如果拉到了远程数据，就用远程的
      hostnames = data.sites.map((site) => {
        return site.hostname;
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

// 符合 '?target=' 格式的链接
// https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.apple.com%2Fcn%2Fdesign%2Fhuman-interface-guidelines%2Fapp-icons%23macOS/
// https://sspai.com/link?target=https%3A%2F%2Fgeoguess.games%2F
// https://link.zhihu.com/?target=https%3A//asciidoctor.org/

function findByTarget() {
  if (!hostnames.includes(location.hostname)) return;
  const linkKeyword = "?target=";
  const aLinks = document.querySelectorAll(
    `a[href*="${linkKeyword}"]:not([data-redirect-skipper])`
  );
  if (!aLinks) return;
  aLinks.forEach((a) => {
    const href = a.href;
    const targetIndex = href.indexOf(linkKeyword);
    if (targetIndex !== -1) {
      const newHref = href.substring(targetIndex + linkKeyword.length);
      a.href = decodeURIComponent(newHref);
      a.setAttribute("data-redirect-skipper", "true");
    }
  });
}
