# 使用说明

## 背景
许多公司使用Java ＋ velocity模块开发，前后端开发都在一个Java工程项目中，
为了开发velocity模版，前端开发人员需要安装eclipse运行整个Java工程，环境配置复杂，
启动速度也慢，而且也不便于前后端代码分离。

为了解决前端环境问题，我们使用gruntjs构建了这套前端开发、构建环境。
它具有部署简单、前后端代码分离等特点，还支持多种前端开发流行的技术特点。

## 前提

需要nodejs，版本 >0.10

如无nodejs环境，请到官方网站（[http://nodejs.org](http://nodejs.org)）下载、安装

## 步骤

1. 安装grunt-cli和bower
```sh
npm install -g grunt-cli bower
```

1. 安装项目依赖包
```sh
npm install
# 生产环境运行以下命令
# npm install -production
```

1. 安装bower依赖包
```sh
grunt bower:install
```

1. 运行grunt本地服务器
```sh
grunt serve
```

1. 其他命令

```sh
// 编译全站
grunt build

grunt --gruntfile=/home/webapp/src/Gruntfile.js --node-modules=/home/zhi.zhong
// --gruntfile: 指定Gruntfile.js文件的位置，在项目根目录外运行Grunt会用到该参数
// --node-modules: 指定开发环境依赖包的位置，只需要指定到node_modules父目录即可
//                 使用该参数便于在同一机器上运行多个分支时共享依赖包
// --deploy-type: 指定当前编译类型，取值可能是dev/beta/prod/prepare,分别对应的是dev/QA/正式/灰度发布

//server命令参数
grunt server --host=localhost --port=9001
// --host: 指定自动打开浏览器的域名，默认值：localhost
// --port: 指定自动打开浏览器的端口号，默认值：9000
// --ignore-open  禁止自动启动浏览器功能
// --ignore-urlrewrite 禁止地址转发功能

grunt server:dist //预览编译后的文件
```
## 特点

### 已完成
* [velocity]支持velocity后端模版解析
* [requirejs]支持模块化开发，模块化加载和打包
* [fontend template]支持前端模版inline编译
* [less]支持less
* [autoprefixer]根据caniuse.com的数据自动补全浏览器厂商前缀
* [css sprite]支持自动生成CSS Sprite
* [imagemin]jpg/png图片无损压缩
* [bower]前端资源包bower管理
* [jshint]jshint语法检查
* [bundle]使用自定义规则自动合并资源
* [rev]编译后的静态文件自动添加md5戳
* [router-page]开发环境支持模版与URL地址关系配置
* [router-api]开发环境支持同步／异步接口假数据
* [liveReload]开发环境下，静态文件修改后自动刷新浏览器
* [babel]es6语法支持

### TODO
* [psi]pagespeed性能优化
*

## 目录说明
```
...
├─.tmp          //运行时生成临时文件
├─app           //pad版程序代码
│   ├─data      //本地测试数据
│   │   ├─api   //页面初始化数据
│   │   └─page  //异步接口数据
│   ├─static    //静态资源
│   │   ├─css       //css or less
│   │   │   ├─icon.less       //自动合并css sprite生成的less变量文件
│   │   │   ├─repeat-x.less   //自动合并css sprite生成的less变量文件（横向平铺类型）
│   │   │   ├─repeat-y.less   //自动合并css sprite生成的less变量文件（纵向平铺类型）
│   │   │   └─pages           //页面相关的样式
│   │   ├─images    //图片
│   │   │   └─common
│   │   │       ├─icon       //需要合并css sprite生成的图片
│   │   │       ├─repeat-x   //需要合并css sprite生成的图片（横向平铺类型）
│   │   │       └─repeat-y   //需要合并css sprite生成的图片（纵向平铺类型）
│   │   └─js        //js or es6 or tpl
│   │       ├─common         //common
│   │       ├─lib            //bower安装目录
│   │       └─pages          //页面相关的js
│   └─vm        //vm模板
├─config  
│   ├─grunt             //Gruntfile.js子配置文件
│   ├─app.js            //项目整体配置
│   ├─bundle.js         //全站js文件打包配置
│   ├─router-api.js     //异步请求与url对应关系配置
│   ├─router-page.js    //模拟数据URL配置
│   └─usemin-pattern.js //usemin配置，依赖module.js，一般不需要修改
├─docs          //文档  
├─prd           //编译输出目录  
├─tasks         //自定义grunt任务
├─.gitignore
├─.jshintrc     //jshint语法配置
├─bower.json    //bower配置
├─Gruntfile.js  //grunt主配置文件
├─package.json  //grunt依赖包配置文件
└─README.md
```

## 路由说明
开发环境下有2种路由：

1. api —— 前端Ajax异步请求数据模拟，对应的配置文件是 [config/router-api.js](config/router-api.js)，
对应的数据在 [app/data/api](app/data/api)，可以配置成：
  1. 本地假数据
  2. 远程测试环境
  3. 线上环境

2. page —— 设置vm模版和线上URL对应关系，对应的配置文件是 [config/router-page.js](config/router-page.js)，
对应的数据在 [app/data/page](app/data/page)，

## 打包说明
支持2种打包方式：

1. html代码注释自我描述打包，不需要任何配置
2. RequireJS配置打包，[查看配置文件](config/chunks.js)

### css

```html
<!-- build:css /static/css/common.css -->
<link rel="stylesheet" href="/static/css/common.css"/>
<link type="text/css" rel="stylesheet" href="/static/css/ebooking.css">
<!-- endbuild -->
```

**代码功能说明**

`build:css`：指明编译方式

将`/static/css/common.css`和`/static/css/ebooking.css`文件打包成`/static/css/common.css`一个文件

### js

```html
<!-- build:js /static/js/common.js -->
<script src="/static/js/underscore.js"></script>
<script src="/static/js/zepto.js"></script>
<script src="/static/js/zepto.extend.js"></script>
<script src="/static/js/zepto.mockjax.js"></script>
<!-- endbuild -->
```

**代码功能说明**

`build:js`：指明编译方式

将`/static/js/underscore.js`等4个文件打包成`/static/js/common.js`一个文件

## LESS的使用
less文件存为 `.less` 后缀，引用时还是使用 `.css`后缀，例如下面的文件对应着 `/static/css/test.less`

	<link rel="stylesheet" href="/static/css/test.css"/>


## 模拟数据的使用

1. 模拟数据文件保存路径需要和vm模板路径一一对应
2. 模拟数据文件其实是一个js模块化文件，支持js编程，传入参数保护 req 和 res，
在req中能获取到请求参数、cookie等信息，在res中能控制返回状态码、消息体、数据格式等信息

模拟数据分为2类

- 页面初始化数据
- 异步接口数据

### 页面初始化数据
这类数据会随着页面模板一起加载，放在 `/app/data/page/xxx.js`

### 页面初始化数据
这类数据通过AJAX请求加载，放在 `/app/data/api/xxx.js`

## background.less的用法
多页面网站建议使用css sprite合并图片，不建议采用图片css内联

## 多个工程共享node_modules

为了以后多分支开发方便，可以将 `node_modules` 移动到项目外(比如 `/home/zhi.zhong` )，启动时加上参数 `--node-modules=/home/zhi.zhong` ，指定node\_modules的位置即可

全局路径，也就是带上参数 -g 的安装模式。这个命令会把模块安装在 $PREFIX/lib/node_modules 下，可通过命令 npm root -g 查看全局模块的安装目录。 package.json 里定义的bin会安装到 $PREFIX/bin 目录下，如果模块带有 man page 会安装到 $PREFIX/share/man 目录下
