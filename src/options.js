import { $, i18n, message } from "./utils.js";
import sites from "./sites.js";

document.addEventListener("DOMContentLoaded", function () {
  const $list = $("sites-list");
  renderSite();

  $list.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-remove")) {
      const hostname = e.target.dataset.hostname;
      if (
        confirm(
          `${chrome.i18n.getMessage("options_deleteConfirmTip")} ${hostname}?`
        )
      ) {
        try {
          await deleteSite(hostname);
          renderSite();
        } catch (error) {
          message(error.message || "Failed to delete site", "error");
        }
      }
    }
  });

  async function renderSite() {
    const fragment = document.createDocumentFragment();

    const _sites = await getSites();
    _sites.forEach((site) => {
      const li = document.createElement("li");
      li.className = "site-item";

      const issueUrl = `https://github.com/dogodo-cc/redirect-skipper/issues/new?title=${encodeURIComponent(
        "report a new link"
      )}&body=${encodeURIComponent(site.example || site.hostname)}`;

      const template = `
        <div class="site-info">
            ${
              site.favicon
                ? `<img class="site-favicon" src="${site.favicon}" alt="${
                    site.title || site.hostname
                  }">`
                : ""
            }
          <span class="site-name">${site.title || site.hostname}</span>
          <a target="_blank" href="https://${
            site.hostname
          }" class="site-hostname">${site.hostname}</a>
        </div>
        <div class="site-actions">
          ${
            site.builtIn
              ? ""
              : `
                <span class="btn btn-remove" data-hostname="${site.hostname}" data-title="i18n:options_deleteTip">❌</span>
                <a class="btn create-issue" target="_blank" href="${issueUrl}" data-title="i18n:options_reportTip">🙋</a>
                `
          }
        </div>
      `;

      li.innerHTML = template;

      fragment.appendChild(li);
    });

    $list.innerHTML = "";
    $list.appendChild(fragment);

    // li 是动态创建的，需要重新绑定 i18n
    i18n();
  }
});

function getSites() {
  const builtInSites = sites.map((site) => ({
    ...site,
    builtIn: true,
  }));

  return new Promise((resolve) => {
    chrome.storage.sync.get("sites", (result) => {
      if (chrome.runtime.lastError) {
        resolve(builtInSites);
      } else {
        resolve([
          ...builtInSites,
          ...(result.sites || []).map((site) => ({
            ...site,
            builtIn: false,
          })),
        ]);
      }
    });
  });
}

function deleteSite(hostname) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get("sites", (result) => {
      const sites = result.sites || [];
      const index = sites.findIndex((site) => site.hostname === hostname);
      if (index === -1) {
        return reject(new Error("Site not found"));
      }
      sites.splice(index, 1);
      chrome.storage.sync.set({ sites }, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  });
}
