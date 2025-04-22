function replaceAlink() {
    juejin();
    sspai();
    zhihu();
}

function observerDocument() {
    const mb = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if (mutation.addedNodes.length) {
                    replaceAlink();
                }
            }
        }
    });
    mb.observe(document, { childList: true, subtree: true });
}

// 监听路由等事件
['hashchange', 'popstate', 'load'].forEach((event) => {
    window.addEventListener(event, () => {
        replaceAlink();
        if (event === 'load') {
            observerDocument();
        }
    });
});


// 每个网站的具体实现

function juejin() {
    if (location.hostname !== 'juejin.cn') return;

    // 不要通过 https://link.juejin.cn 当作前缀来判断，掘金那边的链接有可能会变
    // document.querySelectorAll('a[href^="https://link.juejin.cn"]')

    const linkKeyword = '?target=';
    const alinks = document.querySelectorAll(`a[href*="${linkKeyword}"]`);
    if (!alinks) return;
    alinks.forEach((a) => {
        a.href = a.title; // 目前掘金的原链接都是直接放在 title 里面的

        // const href = a.href;
        // const targetIndex = href.indexOf(linkKeyword);
        // if (targetIndex !== -1) {
        //     const newHref = href.substring(targetIndex + linkKeyword.length);
        //     a.href = decodeURIComponent(newHref);
        // }
    });
}

function sspai() {
    if (location.hostname !== 'sspai.com') return;

    const linkPrefix = 'https://sspai.com/link?target=';
    const alinks = document.querySelectorAll(`a[href^="${linkPrefix}"]`);
    if (!alinks) return;

    alinks.forEach((a) => {
        a.href = decodeURIComponent(a.href.replace(linkPrefix, ''));
    });
}

function zhihu() {
    if (location.hostname !== 'www.zhihu.com') return;

    const linkPrefix = 'http://link.zhihu.com/?target=';

    const alinks = document.querySelectorAll(`a[href^="${linkPrefix}"]`);
    if (!alinks) return;

    alinks.forEach((a) => {
        a.href = decodeURIComponent(a.href.replace(linkPrefix, ''));
    });
}