Title: How to transpile, bundle and minify js projects.
Subtitle: This is madness! ;)
Summary: Under the hood of javascript bundlers.
Date: 2018-10-14
Tags: javascript, minify, ECMAScript, babel
Status: published


# Preface

This is my first article, yey! :) Recently most my time in my projects I'm dealing with JavaScript. That's why I decided to write about something related to JavaScript. If you wish to know how to prepare your JS code to production then this is article for you.

Before I created this blog I wanted it to be a fully static page without any backend, no WordPress, no other CMS, just static files. It is not that convenient managing articles in raw html form when you don't have any tools that speed up the process. You can create templates and then copy-paste pages but it is not the way I imagine to update this blog. At start I had idea to use one of many static content generators. Just make simple html/css theme and write articles. Easy right? Too easy and boring. So I figured out why not build a static generator by myself..?

As I found out pretty quickly it is not that easy. A first hard part was to handle JavaScript files. I wished to use ES6+ syntax in development and then make transpiled to ES5 and minified bundle. There are some other dificult tasks when you build static page generator but in this article I want to focus on How to transpile, bundle and minify JS files.

> JavaScript is just an implementation of ECMAScript specification.

# Theory

**Transpiling** - it is another word for compiling from source code to sorce code. In this case ES6+ to ES5. The problem is backward compatability. Code written in ES6+ in most cases wont work in ES5 and this is bad because ES5 is the most supported version. So if you wish your JS app work on all over the platforms, devices etc. you must convert your code into ES5.

**Bundling** - "just" combining your chode into single file. JS in browsers doesn't support importing modules and that is huge problem because you never have only one file in projects, your code is splitted into multiple modules and so on. The solution is to concatenate all files into one. Thankfully ES6+ supports "imports".

**Minifying** - reducing the size of files is not required but minifyng tools also comes with cool feature like reducing names of variables (mangle).

# Future

Most users uses browsers in their latest versions which is very good news because modern broswers already support large amount of ES6 features. Still there are some not supported features that can break your code. It is hard to predict how fast ES6 will be fully supported and when writing in current stable ES version will not need transpiling. We are where we are and there are many tools for managing JS projects/source files. Let's deal with it ;)

In my opinion it is worth to learn newest ES specifications and start using all cool features. Sooner or later it will be supported and becomes standard.

# Setup

To install all packages in examples below you need to have nodejs installed and npm or other package manager.

I assume that source folder have structure like this:

```shell
$ tree myproject
.
├── build
├── node_modules
├── src
    ├── app.js
    ├── modules
    ├── components
    └── ...
├── .babelrc
├── .gitignore
├── Makefile
└── package.json
```


# Babel

First of lets convert some code into ES5 using Babel. Install core, cli and preset-env for basic usage.

`$ npm install @babel/core @babel/cli @babel/preset-env`

Command that converts a single file (-o or --out-file):

`$ node_modules/.bin/babel src/app.js -o build/app.js`

a directory (-d or --out-dir):

`$ node_modules/.bin/babel src/ -d build/`

You can keep babel running an watching your source files by adding --watch flag.

`$ node_modules/.bin/babel src/ --watch -d build/`


# Browserify

If your code is contained in single file then skip this part and read about "uglifying".

Now when your code is in ES5 version it is good to bundle up files into single one. If you used ES6 "import" syntax then it probably is converted to "require" functions whitch is not supported on browsers. Solution to this is using tool like Browserify. I don't want to write in details about Browserify because it is well documented. In most cases you just pass source file path and output path into browserify command like so:

`$ node_modules/.bin/browserify build/app.js > build/bundle.js`

In larger projects when your bundle start to grow it maybe useful to extract common parts into separate bundle and have multiple bundles. In that case you should separate all common modules and bundle into one file and point to it while building other bundles:

```shell
$ node_modules/.bin/browserify -r src/common.js > build/common.js
$ node_modules/.bin/browserify -x src/common.js src/moduleA.js > build/moduleA.js
$ node_modules/.bin/browserify -x src/common.js src/moduleB.js > build/moduleB.js
```

There is also babelify transform module you can use with browserify which allow you to apply also babel transforms during bundling process. In that way you can skip using babel in separate command. To do that you must set special options in browserify command but first install module:

`$ npm install babelify`

then:

`$ node_modules/.bin/browserify build/app.js > build/bundle.js -t [ babelify --no-sourceMaps --presets [ @babel/preset-env ] ]`

This way you have bundle that can be already used in browser. What's left is to minify bundle!


# UglifyJS

For compressing I'm using UglifyJS. It also can mangle variables and do other stuff but I will stick with minimal example here. It is also well documented so you shouldn't have problems with it. Lets minify our bundle file:

`$ node_modules/.bin/uglifyjs -c build/bundle.js -o build/bundle.min.js`

# Makefile

I like put all commands that I use often in Makefile. Obviously it speeds up development when you use short cmd like: make build instead of ...bin/browserify app.js > bundle.js. One more important fact is that it prevents you from mistakes like typo in commands or passing incorrect paths.

In this stage my Makefile would be looking like so:

```makefile
NODE_BIN?=./node_modules/.bin
SRC_PATH?=./src
BUILD_PATH?=./build

.PHONY: install
install:
    @npm i

.PHONY: clean
clean:
    @rm $(BUILD_PATH)

.PHONY: babel
babel:
    @$(NODE_BIN)/babel $(SRC_PATH) -d $(BUILD_PATH)

.PHONY: browserify
browserify:
    @$(NODE_BIN)/browserify $(BUILD_PATH)/app.js > $(BUILD_PATH)/bundle.js -t [ babelify --no-sourceMaps --presets [ @babel/preset-env ] ]

.PHONY: uglify
uglify:
    @$(NODE_BIN)/uglifyjs -c $(BUILD_PATH)/bundle.js -o $(BUILD_PATH)/bundle.min.js

.PHONY: build
build:
    @$(MAKE) clean
    @mkdir -p build
    @$(MAKE) babel
    @$(MAKE) browserify
    @$(MAKE) uglify
```

Now if you wish to rebuild all files run:

`$ make clean build`

If you pass BUILD_PATH environment variable then you can change build folder path:

`$ BUILD_PATH=/some_other_path/build make clean build`

# Summary

To sum up there are 3 steps to prepare your project to production:

1. Convert/transpile to ES5 - Babel
2. Bundle files - Browserify
3. Compress/minify - UglifyJS

If you use babelify with Browserify then you will reduce that into 2 steps. Ofcourse there are many tools like Webpack that can handle that and more tasks. It always require to learn how to configure all tools and it can be very time consuming. From my expirience it is not that convinient as you would think. I'm pretty sure that configuring Webpack takes more time than making simple Makefile or bash script that lunches few commands.

Thanks for reading and please leave any comment below. Cheers!
