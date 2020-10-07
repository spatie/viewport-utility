# viewport-utility

[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![Build Status](https://img.shields.io/travis/spatie/viewport-utility.svg?style=flat-square)](https://travis-ci.org/spatie/viewport-utility)
[![Code Climate](https://img.shields.io/codeclimate/github/spatie/viewport-utility.svg?style=flat-square)](https://img.shields.io/codeclimate/github/spatie/viewport-utility.svg)
[![npm](https://img.shields.io/npm/dt/viewport-utility.svg?style=flat-square)](https://www.npmjs.com/package/viewport-utility)

**Viewport-utility** watches the browser and updates DOM classes and JS properties for easy access in your script or stylesheet. 
It also provides some simple functions to control scroll behaviour and a fallback for vh units in older browsers.

## Support us

[![Image](https://github-ads.s3.eu-central-1.amazonaws.com/viewport-utility.jpg)](https://spatie.be/github-ad-click/viewport-utility)

We invest a lot of resources into creating [best in class open source packages](https://spatie.be/open-source). You can support us by [buying one of our paid products](https://spatie.be/open-source/support-us).

We highly appreciate you sending us a postcard from your hometown, mentioning which of our package(s) you are using. You'll find our address on [our contact page](https://spatie.be/about-us). We publish all received postcards on [our virtual postcard wall](https://spatie.be/open-source/postcards).

## Postcardware

You're free to use this package (it's [MIT-licensed](LICENSE.md)), but if it makes it to your production environment you are required to send us a postcard from your hometown, mentioning which of our package(s) you are using.

Our address is: Spatie, Kruikstraat 22, 2018 Antwerp, Belgium.

The best postcards will get published on the open source page on our website.

## Installation

``` bash
$ npm i viewport-utility
```

## Demo

There is a small [demo page](https://spatie.github.io/viewport-utility).

### Usage
``` js

var viewport = require("viewport-utility").init({})
    
```

### Options

You can change these before `init()`, or pass an object in `init(options)`.

All config values can be overwritten by data-attributes on the root element.

``` js

    root: $('[data-viewport]'), // Typically on the HTML element
    toolbar: $('[data-viewport-toolbar]'), // When scrolling to an offset, take element into account
    vhItems: $('[data-viewport-vh]'), // Fix vh units for older browsers & iOS7
    scrollLinks: $('[data-viewport-scroll]'), // Scroll to anchor in href
    classPrefix: '$viewport-',
    lang: 'en', // Set by lang-attribute on root element
    // Default config
    config: {
        scrollOffset: 0,  // Add some space when scrolling to an offset
        small: 768, // Breakpoint
        start: 0, // Top margin before viewport is 'started'
        end: 0, // Bottom margin before viewport is 'ended'
    },

```

### Properties

Following properties are updated, and can be usefull in your app code.

``` js

// Properties
height: 0,
width: 0,
start: 0, // Beginning of viewport relative to document
end: 0, // End of viewport relative to document
state: {
    scrollDisabled : false,
    small: false,
    large: false,
    scrolling: false,
    started: false,
    ended: false,
    loaded: false,
},
orientation: {
    portrait: false,
    landscape: false
},
direction: {
    down: false,
    up: false
}
    
```

### Functions
``` js

disableScroll() // on the root element
enableScroll() 
init(options) // init module with options
isTopInView(target) // yes or no for offset or $element
scrollTo(target, whenInView) // scroll to offset, selector or $element, also to elements that are visible already (default:true)
scrollToHash() // scroll to hash in url, typically on page load
update() // update handlers and module

```

### CSS

Classes you can use in Sass.
Default setting is `classPrefix: '$viewport-'`.

``` css

.\$viewport-loading{}
.\$viewport-loaded{}
.\$viewport-orientation-portrait{}
.\$viewport-orientation-landscape{}
.\$viewport-direction-down{}
.\$viewport-direction-up{}
.\$viewport-small{}
.\$viewport-large{}
.\$viewport-started{}
.\$viewport-ended{}
.\$viewport-scrolling{}
.\$viewport-scroll-disabled{}

```

### DOM

Data-attributes on root element will override the js options.
The `$viewport-loading` class will be removed on page load.

```html
<html data-viewport 
      data-viewport-small="900"
      data-viewport-start="100"
      data-viewport-end="100"
      data-viewport-scrolloffset="50"
      class="$viewport-loading">
```

Default html needed when you don't override options: 

```html
<div data-viewport-toolbar>When using scroll functions: don't scroll under me</div>
...
<a data-viewport-scroll href="#">Scroll to top</a>
<a data-viewport-scroll=true href="#anchor">Scroll to anchor</a>
<a data-viewport-scroll=false href="#anchor">Scroll to anchor, only if out of view</a>
...
<div data-viewport-vh="50">Half page for iOS7</div>
```

## Change log

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Security

If you discover any security related issues, please email willem@spatie.be instead of using the issue tracker.

## Credits

- [Willem Van Bockstal](https://github.com/willemvb)
- [All Contributors](../../contributors)

## About Spatie
Spatie is webdesign agency in Antwerp, Belgium. You'll find an overview of all our open source projects [on our website](https://spatie.be/opensource).

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
