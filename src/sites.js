/**
 *  hostname: The hostname of the redirect service.
 *  pathname: The specific path to match (optional).
 *  title: The display name of the redirect service.
 *  param: The query parameter name for the target URL.
 *  getTargetUrl: A function to extract the target URL from the full URL (optional).
 */

export default [
  {
    hostname: "bbs.colg.cn",
    title: "Colg",
    pathname: "/forum.php",
    param: "referer_url",
    example:
      "https://bbs.colg.cn/forum.php?mod=urlintercept&referer_url=https%3A%2F%2Fpan.baidu.com%2Fs%2F1cRta2GIAUXTaINRQRNWwfw",
    favicon: "https://bbs.colg.cn/favicon.ico",
  },
  {
    hostname: "link.juejin.cn",
    title: "掘金",
    param: "target",
    example: "https://link.juejin.cn/?target=https%3A%2F%2Fcocos.com",
    favicon:
      "https://lf-web-assets.juejin.cn/obj/juejin-web/xitu_juejin_web/static/favicons/favicon-32x32.png",
  },
  {
    hostname: "sspai.com",
    pathname: "/link",
    title: "少数派",
    param: "target",
    example: "https://sspai.com/link?target=https%3A%2F%2Fcocos.com",
    favicon: "https://cdn-static.sspai.com/favicon/sspai.ico",
  },
  {
    hostname: "link.zhihu.com",
    title: "知乎",
    param: "target",
    example: "https://link.zhihu.com/?target=https%3A%2F%2Fcocos.com",
    favicon: "https://static.zhihu.com/heifetz/favicon.ico",
  },
  {
    hostname: "link.csdn.net",
    title: "CSDN",
    param: "target",
    example:
      "https://link.csdn.net/?from_id=147127098&target=https%3A%2F%2Fcocos.com",
    favicon: "https://g.csdnimg.cn/static/logo/favicon32.ico",
  },
  {
    hostname: "www.jianshu.com",
    pathname: "/go-wild",
    title: "简书",
    param: "url",
    example: "https://www.jianshu.com/go-wild?ac=2&url=https%3A%2F%2Fcocos.com",
    favicon:
      "https://cdn2.jianshu.io/assets/favicons/favicon-e743bfb1821442341c3ab15bdbe804f7ad97676bd07a770ccc9483473aa76f06.ico",
  },
  {
    hostname: "gitee.com",
    pathname: "/link",
    title: "Gitte",
    param: "target",
    example: "https://gitee.com/link?target=https%3A%2F%2Fcocos.com",
    favicon:
      "https://cn-assets.gitee.com/assets/favicon-9007bd527d8a7851c8330e783151df58.ico",
  },
  {
    hostname: "afdian.com",
    pathname: "/link",
    title: "爱发电",
    param: "target",
    example: "https://afdian.com/link?target=https%3A%2F%2Fcocos.com",
    favicon: "https://static.afdiancdn.com/favicon.ico",
  },
  {
    hostname: "blog.51cto.com",
    pathname: "/transfer",
    title: "51CTO",
    getTargetUrl: (url) => {
      return url.replace("https://blog.51cto.com/transfer?", "");
    },
    example: "https://blog.51cto.com/transfer?https%3A%2F%2Fcocos.com",
    favicon: "https://blog.51cto.com/favicon.ico",
  },
  {
    hostname: "weibo.cn",
    pathname: "/sinaurl",
    title: "微博",
    param: ["toasturl", "url", "u"],
    example: "https://weibo.cn/sinaurl?toasturl=https%3A%2F%2Fcocos.com",
    favicon: "https://weibo.cn/favicon.ico",
  },
  {
    hostname: "www.youtube.com",
    pathname: "/redirect",
    param: "q",
    title: "YouTube",
    example: "https://www.youtube.com/redirect?q=https%3A%2F%2Fcocos.com",
    favicon: "https://www.youtube.com/img/favicon.ico",
  },
  {
    hostname: "www.yuque.com",
    pathname: "/r/goto",
    param: "url",
    title: "语雀",
    example: "https://www.yuque.com/r/goto?url=https%3A%2F%2Fcocos.com",
    favicon:
      "https://mdn.alipayobjects.com/huamei_0prmtq/afts/img/A*sRUdR543RjcAAAAAAAAAAAAADvuFAQ/original",
  },
  {
    hostname: "developer.aliyun.com",
    pathname: "/redirect",
    param: "target",
    title: "阿里云",
    example:
      "https://developer.aliyun.com/redirect?target=https%3A%2F%2Fcocos.com",
    favicon: "https://img.alicdn.com/tfs/TB1_ZXuNcfpK1RjSZFOXXa6nFXa-32-32.ico",
  },
  {
    hostname: "www.douban.com",
    pathname: "/link2",
    title: "豆瓣",
    param: "url",
    example: "https://www.douban.com/link2/?url=https%3A%2F%2Fcocos.com",
    favaicon: "https://img1.doubanio.com/favicon.ico",
  },
  {
    hostname: "xie.infoq.cn",
    pathname: "/link",
    title: "InfoQ(写作社区)",
    param: "target",
    example: "https://xie.infoq.cn/link?target=https%3A%2F%2Fcocos.com",
    favicon: "https://static001.infoq.cn/static/write/img/write-favicon.jpg",
  },
  {
    hostname: "www.infoq.cn",
    pathname: "/link",
    title: "InfoQ",
    param: "target",
    example: "https://www.infoq.cn/link?target=https%3A%2F%2Fcocos.com",
    favaicon:
      "https://static001.infoq.cn/static/infoq/www/img/share-default-5tgbiuhgfefgujjhg.png",
  },
];
