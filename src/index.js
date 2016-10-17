const $ = require('jquery');
const merge = require('lodash.merge');


// the object
module.exports = {
    root: $('[data-viewport]'),
    toolbar: $('[data-viewport-toolbar]'),
    vhItems: $('[data-viewport-vh]'),
    scrollLinks: $('[data-viewport-scroll]'),
    classPrefix: '$viewport-',
    lang: 'en',
    // Default config
    config: {
        scrollOffset: 0,
        small: 768,
        start: 0,
        end: 0,
    },
    // Props
    height: 0,
    width: 0,
    start: 0,
    end: 0,
    state: {
        disabledScroll : false,
        small: false,
        large : false,
        scrolling: false,
        start: false,
        end: false,
        loaded: false,
    },
    orientation: {
        portrait: false,
        landscape: false,
    },
    direction: {
        down: false,
        up: false,
    },
    // Internal functions, vars
    _lastPosition: 0,
    _readConfigFromDom() {
        this.lang = document.documentElement.lang ? document.documentElement.lang.toLowerCase() : 'en';
        Object.keys(this.config).map((key) => {
            const attribute = `viewport-${key.toLowerCase()}`;
            const value = parseInt(this.root.data(attribute));
            if (value > 0) this.config[key] = value;
        });
        return this;
    },
    _addToolbar() {
        return this.toolbar.size() ? this.toolbar.outerHeight() : 0;
    },
    _executeScroll(offsetY) {
        this.state.scrolling = true;
        this.root.addClass(this.classPrefix + 'scrolling');
        offsetY = offsetY - this.config.scrollOffset - this._addToolbar();
        const viewport = this;
        $('body,html').animate({ scrollTop: offsetY }, '5000', 'swing', function () {
            viewport.state.scrolling = false;
            viewport.root.removeClass(this.classPrefix + 'scrolling');
            viewport._afterScroll();
        });
        return this;
    },
    _afterScroll() {
        // only do stuff if we need to watch scroll
        if (!this.state.scrolling) {
            this.start = $(window).scrollTop();
            this.end = this.start + this.height;
            this.state.started = this.start > this.config.start;
            this.state.ended = this.end > $(document).height() - this.config.end;

            clearTimeout(this.directionTimeOut);
            this.directionTimeOut = setTimeout(() => {
                this._setDirection();
            }, 100);

            this.root
                .toggleClass(this.classPrefix + 'started', this.state.started)
                .toggleClass(this.classPrefix + 'ended', this.state.ended);

        }
        return this;
    },
    _afterResize() {
        return this._measure()._fixVH()._afterScroll();
    },
    _setDirection() {
        this.direction.up = this.start < this._lastPosition;

        // edge cases
        if (this.state.ended) this.direction.up = true;
        if (this.start < 1) this.direction.up = false;

        this.direction.down = !this.direction.up;
        this._lastPosition = this.start;
        this.root
            .toggleClass(this.classPrefix + 'direction-down', this.direction.down)
            .toggleClass(this.classPrefix + 'direction-up', this.direction.up);
        return this;
    },
    _initHandlers() {
        const viewport = this;
        this.scrollLinks.on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            const href = $(this).attr('href');
            const whenInView = $(this).data('viewport-scroll') === '' ? true : $(this).data('viewport-scroll');
            viewport.scrollTo(href === '#' ? 0 : $(href), whenInView);
        });
        return this;
    },
    _measure() {
        //measure
        this.height = $(window).height();
        this.width = $(window).width();
        this.orientation.landscape = (this.width / this.height) > 1 ;
        this.orientation.portrait = !this.orientation.landscape;
        this.state.small = this.config.small > this.width;
        this.state.large = !this.state.small;
        this.root
            .toggleClass(this.classPrefix + 'small', this.state.small)
            .toggleClass(this.classPrefix + 'large', this.state.large)
            .toggleClass(this.classPrefix + 'orientation-portrait', this.orientation.portrait)
            .toggleClass(this.classPrefix + 'orientation-landscape', this.orientation.landscape);
        return this;
    },
    _fixVH() {
        this.vhItems.each((key, value)=>{
            const unit = this.height / 100;
            $(value).outerHeight(Math.round(unit * $(value).data('viewport-vh')));
        });
        return this;
    },
    _assureOffset(target) {
        let offsetY = 0;
        if (typeof target === 'string') {
            target = $(target);
        }
        if (target instanceof $ && target.length) {
            offsetY = target.offset().top;
        }
        if (typeof target === 'number') {
            offsetY = target;
        }
        return offsetY;
    },
    // External functions
    isTopInView(target) {
        const offsetY = this._assureOffset(target) - this._addToolbar();
        return offsetY >= this.start && offsetY <= this.end;
    },
    scrollTo(target, whenInView) {
        const offsetY = this._assureOffset(target);
        whenInView = typeof whenInView === 'undefined' ? true : whenInView;
        if (!whenInView && this.isTopInView(offsetY)) {
            return this;
        }
        this._executeScroll(offsetY);
        return this;
    },
    scrollToHash() {
        if (window.location.hash) {
            $(window).scrollTop(0);
            this.scrollTo($(window.location.hash));
        }
        return this;
    },
    disableScroll() {
        this.state.disabledScroll = true;
        this.root.css('overflow', 'hidden').addClass(this.classPrefix + 'disabled-scroll');
        return this;
    },
    enableScroll() {
        this.state.disabledScroll = false;
        this.root.css('overflow', 'initial').removeClass(this.classPrefix + 'disabled-scroll');
        return this;
    },
    update() {
        this._initHandlers()._afterResize();
        return this;
    },
    init(options) {
        const viewport = this;
        if (options) {
            merge(this, options);
        }

        viewport._readConfigFromDom().update();
        $(window).load(() => {
            viewport.root.removeClass(this.classPrefix + 'loading').addClass(this.classPrefix + 'loaded');
            viewport.loaded = true;
        }).scroll(() => {
            viewport._afterScroll();
        }).resize(() => {
            viewport._afterResize();
        });
        return this;
    },
};
