function replaceAlink() {
    findByTarget();
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


// 符合 '?target=' 格式的链接
// https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.apple.com%2Fcn%2Fdesign%2Fhuman-interface-guidelines%2Fapp-icons%23macOS/
// https://sspai.com/link?target=https%3A%2F%2Fgeoguess.games%2F
// https://link.zhihu.com/?target=https%3A//asciidoctor.org/

const hostnames = [
    'juejin.cn',
    'sspai.com',
    'www.zhihu.com',
]

function findByTarget() {
    if (!hostnames.includes(location.hostname)) return;
    const linkKeyword = '?target=';
    const alinks = document.querySelectorAll(`a[href*="${linkKeyword}"]`);
    if (!alinks) return;
    alinks.forEach((a) => {
        const href = a.href;
        const targetIndex = href.indexOf(linkKeyword);
        if (targetIndex !== -1) {
            const newHref = href.substring(targetIndex + linkKeyword.length);
            a.href = decodeURIComponent(newHref);
        }
    });
}

