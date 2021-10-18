#!/usr/bin/env python
# -*- coding: utf-8 -*- #

AUTHOR = 'tssan'
SITENAME = 'dojoit.pl'
SITEURL = ''

PATH = 'content'

TIMEZONE = 'Europe/Warsaw'

DEFAULT_LANG = 'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = (('Pelican', 'https://getpelican.com/'),
         ('Python.org', 'https://www.python.org/'),
         ('Jinja2', 'https://palletsprojects.com/p/jinja/'),
         ('You can modify those links in your config file', '#'),)

DEFAULT_PAGINATION = 10

# Uncomment following line if you want document-relative URLs when developing
# RELATIVE_URLS = True

PAGE_ORDER_BY = 'order'

STATIC_PATHS = ['images', 'extra']

EXTRA_PATH_METADATA = {
    "images/favicon.png": {"path": "favicon.png"},
    "extra/CNAME": {"path": "CNAME"},
    "extra/sw.js": {"path": "sw.js"},
    "extra/manifest.webmanifest": {"path": "manifest.webmanifest"}
}
