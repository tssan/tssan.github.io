Title: How to create website using Pelican
Summary: Tutorial about Pelican static page generator
Date: 2021-07-30
Tags: python, pelican, blog
Status: published


# Prerequisites

Pelican is a static site generator created in Python programming language which is our main requirement. For this tutorial I'm using Debian - Linux based operating system that have Python already installed. Some basic knowledge of how to use terminal will help you but even if you are new to that I will try to write down every command that will be required to complete this tutorial.

> For Windows users I recommend creating virtual machine using virtualbox or WSL (Windows Subsystem for Linux in Windows 10).

After Pelican is installed user can jump right into writting articles and other content. For that any text editor will suffice. I'm using Sublime Text editor.

Customazing blog appearance require knowledge abut **HTML** and **CSS**. Pelican has build in templates system that can be also used to change blog layout and styles. There are ready to use themes for Pelican.

To sum up requirements for this tutorial are:

* Linux based OS, Python3 (optionally on Windows: WSL or Virtualbox)
* Text editor
* Hsting space for your blog files
* Domain

Recommended:

* Git basic knowladge - required for **Step 8** when we deploy website
* Terminal basic knowladge

# What will you learn from this tutorial

After this tutorial you will be able to create and install blog website on you hosting account. This is easy and fast way to create web content with minimum technical skills.

# Step 1: Python environment setup

Let's create root folder for our project and then inside set up virtual environment:

```shell
mkdir myblog

cd myblog

virtualenv -p python3 .venv
```

> if **virtualenv** command is not found then you must install it by: **sudo apt install python3-pip** and then **sudo pip3 install virtualenv**

That's it. Now we can install Pelican and start using it to create blog!

# Step 2: Installing Pelican

To actually use virtual environemt created in previous step you must activate it by this command:

`. .venv/bin/activate`

After that you should see some kind off indicator that virtualenv is active in your shell prompt (may be different for different shells)

Inside activated venv let's install Pelican:

`pip install "pelican[markdown]"`

You can check if Pelican was installed:

`pelican --version`

# Step 3: Using Pelican's quickstart

Pelican is ready to use. It has build-in quickstart command to speed up setup process. Let's use it, run:

`pelican-quickstart`

Quickstart will guide you through few steps providing basic configuration for your blog. Remember that all of settings below can be changed later on in `pelicanconf.py` file. Let's discuss them step by step:

* `> Where do you want to create your new web site? [.]` - It is a relative path to the content folder. I recommend leave it as default. Just hit ENTER.

* `> What will be the title of this web site?` - Set title for your Blog

* `> Who will be the author of this web site?` - Can be a full name or nickname

* `> What will be the default language of this web site? [en]` - Set correct language. ENTER to leave default en

* `> Do you want to specify a URL prefix? e.g., https://example.com (Y/n)` - If you don't know the http address for your blog yet then skip this setting

* `> What is your URL prefix? (see above example; no trailing slash)` - shows only if (Y) was aswered in previous question, put your blog http address eg.: https://example.com

* `> Do you want to enable article pagination? (Y/n)`

* `> How many articles per page do you want? [10]`

* `> What is your time zone? [Europe/Paris]`

* `> Do you want to generate a tasks.py/Makefile to automate generation and publishing? (Y/n)` - I recommend choosing Y here as it will be helpful later on

* `> Do you want to upload your website using FTP? (y/N)` - skip ENTER

* `> Do you want to upload your website using SSH? (y/N)` - skip ENTER

* `> Do you want to upload your website using Dropbox? (y/N)` - skip ENTER

* `> Do you want to upload your website using S3? (y/N)` - skip ENTER

If you choose to use S3 then next step will be to set bucket name:

* `> What is the name of your S3 bucket? [my_s3_bucket]` - set name of S3 bucket for your blog (can be created later)

* `> Do you want to upload your website using Rackspace Cloud Files? (y/N)` - skip ENTER

* `> Do you want to upload your website using GitHub Pages? (y/N)` - y

* `> Is this your personal page (username.github.io)? (y/N)` - skip ENTER

Result of quickstart is a project's folder with minimal setup required to run website. You should see new folders `content` and `output` and also config files `pelicanconf.py` and `publishconf.py`.

# Step 4: CLI - how to use Pelican's commands

All commands requires a virtualenv to be activated:

`. .venv/bin/activate` - execute if you didn't run this command in **Step 2**

Easiest way to start is just running: `make devserver`

You should see information that server is started:

`Serving site at: http://127.0.0.1:8000 - Tap CTRL-C to stop`

Open your browser and go to: `http://127.0.0.1:8000`

There other 2 most usefull commands you should know:

`pelican content` - this will generate blog website and put it in `output` folder

and

`pelican --listen` - that will start up development server and host generated site that you can check in your browser under `http://127.0.0.1:8000` address

> Pelican can also handle publishing your work but it will be covered later in Step 8

Now there is a `pelican` command ready to use. Before you start anything I encourage you to check all available options by typing:

`pelican --help`

Great! Now we can actually wirte first article ;)

> To close a running server hit Ctr+C.

# Step 5: Managing content - adding first blog entry

To add new content you just need to create files inside `content` folder.

`touch content/my-first-article.md`

I'm choosing `Markdown` format. It is also possible to use `html` files out of the box. To use other formats check [pelican-plugins](https://github.com/getpelican/pelican-plugins){:target="_blank"}.

Open article file in your text editor.

The sample article file can looks like this:

```Markdown
Title: My first article
Date: 2021-07-10 11:00
Category: News

# My header

Lorem ipsum. Sit et magna dolore id consectetur qui sed cillum magna est incididunt veniam laborum.
```

Couple of things about structure of an article. In official documentation it is called metadata.

* Minimal data must be provided in the header of each file. These are: `Title` and `Date`.
* Default `Author` is set in `pelicanconf.py` but you can override it in each document by adding `Author: Your Name` to the header.
* Other useful metadata headers you may choose to use: `Tags`, `Slug`, `Author`, `Summary`. More in docs: [File metadata](https://docs.getpelican.com/en/stable/content.html#file-metadata){:target="_blank"}.

If `make devserver` command is running then just refresh page to see changes in your website otherwise you need to use `pelican generate` command to make changes in `output` folder. Refresh your page and check your first article!

# Step 6: Changing Theme

Pelican provides simple build-in theme that you can start with but to add some presonal touch to your blog you probably want to use some other theme that you like more.

To check all already installed themes run `pelican-themes -l`

[Pelican themes website](http://pelicanthemes.com/){:target="_blank"} is a place where you can find gallery of ready to use themes. Most of those themes are available on GitHub. You can download zipped file from there.

After you pick favourite one and download it to your hard drive you can install it using this command:

`pelican-themes -vi /path/to/downloaded/theme`

> Path must point to the unzipped theme files.

This command will copy theme files into your virtual enviroment. If you rerun `pelican-themes -l` new theme name should appear on the list.

To actually use installed theme set it in `pelicanconf.py` adding line:

`THEME = 'name_of_choosen_theme'`

That's it! Re-generate site and check how it looks! (Run commands from **Step 4**)

# Step 7: Customizing your blog

Tweaking theme by editting styles or templates is an advanced topic. No matter what you wish to change it probably can be done somehow the 2 main ways to modify your blog is to create own theme or use plugin.

* custom theme - if none of found on the internet theme don't match your expectation then you probably end with creating your own custom theme or changing some other "close match", in that case check documentation about [creating Pelican's theme](https://docs.getpelican.com/en/stable/themes.html#){:target="_blank"}

* plugins - maybe you need a specyfic type of article or want to use other format than **html** and **markdown**, check available plugins on [GitHub](https://github.com/pelican-plugins){:target="_blank"}

# Step 8: Deploying site

Deploying process will be different for every method and hosting solution you choose. I will describe using GitHub Pages.

* First of you must create account on GitHub.

* Then after logging in create new `public` repository for your website.

* Inside `output` folder create `CNAME` file and write inside the name of your domain eg.: `example.com`. This will be required to hook your domain with GitHub Pages.

* Install Git if not installed yet. Depending on your operating system you may use some GUI for this or like me type commands in terminal:

```shell
git init
git remote add origin git@github.com:yourusername/repositoryname.git
git add .
git commit -m "initial"
git push -u origin master
```

> Replace **yourusername** and **repositoryname** with proper values

* Now create branch that will be holding your actual website.

```shell
git subtree push --prefix test origin gh-pages
```

* Go to repository Settings/Pages. Select branch `gh-pages` and in field `Custom domain` put the name of your domain then press `Save`. Ok. GitHub part is done. If you have any trouble check documentation about [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site){:target="_blank"}

* Go to your domain provider and set up GitHub's records:

GitHub **A** records you need to use:

```shell
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

That's all! DNS propagation can take a while. Worst case scenario up to 48 hours but that never happend to me. Usually it takes up to several minutes. More informations about managing custom domain on GitHub here
