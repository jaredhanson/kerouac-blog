# kerouac-blog

This is a [Kerouac](https://github.com/jaredhanson/kerouac) plugin for writing
and publishing a blog, including [RSS](http://en.wikipedia.org/wiki/RSS) and
[Atom](http://en.wikipedia.org/wiki/Atom_%28standard%29) feeds.

## Install

    $ npm install kerouac-blog
    
## Usage

Plug `kerouac-blog` into your site, specifying the directory that contains your
blog's articles.

    site.plug(require('kerouac-blog')('blog'));

## Tests

    $ npm install
    $ make test

[![Build Status](https://secure.travis-ci.org/jaredhanson/kerouac-blog.png)](http://travis-ci.org/jaredhanson/kerouac-blog)  [![David DM](https://david-dm.org/jaredhanson/kerouac-blog.png)](http://david-dm.org/jaredhanson/kerouac-blog)

## Credits

  - [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2013 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>

<a target='_blank' rel='nofollow' href='http://app.codesponsor.io/link/vK9dyjRnnWsMzzJTQ57fRJpH/jaredhanson/kerouac-blog'>
  <img alt='Sponsor' width='888' height='68' src='http://app.codesponsor.io/embed/vK9dyjRnnWsMzzJTQ57fRJpH/jaredhanson/kerouac-blog.svg' />
</a>
