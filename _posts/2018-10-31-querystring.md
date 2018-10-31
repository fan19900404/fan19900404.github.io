---
layout: post
title:  "querystring"
date:   2018-10-31 23:14:54
categories: JavaScript
tags:  js querystring
excerpt: 简单的querystring实现。
---

* content
{:toc}
在js中对于url参数与对象互相转化是常常需要的，所以写一个简易实现。

## 实现方法

```javascript
var querystring = {
    parse: function (query) {
        var reg = /([^=&\s]+)[=\s]*([^&\s]*)/g;
        var obj = {};
        while (reg.exec(query)) {
            obj[RegExp.$1] = RegExp.$2;
        }
        return obj;
    },
    stringify: function (obj) {
        return Object.keys(obj).map(function (key) {
            return key + '=' + obj[key]
        }).join('&');
    }
}
```

## 使用方法

url转对象
```javascript
var query = "userID=JeoOrCXxyiOFxbYaGL40kw==&userPwd=sdFo2ziUw8HyLRKd4i6GAQ==&userName=高聪&num=123";
console.log(querystring.parse(query)) // {"userID":"JeoOrCXxyiOFxbYaGL40kw==","userPwd":"sdFo2ziUw8HyLRKd4i6GAQ==","userName":"高聪","num":"123"}
```

对象转url
```javascript
var obj = {abc:123,ddd:"Hello"};
console.log(querystring.stringify(obj)); // abc=123&ddd=Hello
```

## 注意
以上是es5实现方法，需要兼任ES3的，请自行解决
