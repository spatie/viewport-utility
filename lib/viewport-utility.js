const $ = require('jquery')
// the object
module.exports = {
    root: $('[data-viewport]'),
    toolbar: $('[data-viewport-toolbar]'),
    vhItems: $('[data-viewport-vh]'),
    scrollLinks: $('[data-viewport-scroll]'),
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
        large : true,
        scrolling: false,
        start: false,
        end: false,
        loaded: true,
    },
    // Internal functions
    _readConfigFromDom() {
        this.lang = document.documentElement.lang ? document.documentElement.lang.toLowerCase() : 'en'
        Object.keys(this.config).map( (key) => {
            let attribute = `viewport-${key.toLowerCase()}`
            let value = parseInt(this.root.data(attribute))
            if (value > 0) this.config[key] = value
        })
        return this
    },
    _addToolbar(){
        return this.toolbar.size() ? this.toolbar.outerHeight() : 0
    },
    _executeScroll(offsetY) {
        this.state.scrolling = true
        this.root.addClass('$viewport-scrolling')
        offsetY = offsetY - this.config.scrollOffset - this._addToolbar()
        let viewport = this
        $('body,html').animate({ scrollTop: offsetY }, '5000', 'swing', function () {
            viewport.state.scrolling = false
            viewport.root.removeClass('$viewport-scrolling')
            viewport._afterScroll()
        })
        return this
    },
    _afterScroll() {
        // only do stuff if we need to watch scroll
        if (!this.state.scrolling) {
            this.start = $(window).scrollTop()
            this.end = this.start + this.height
            this.state.started = this.start > this.config.start
            this.root.toggleClass('$viewport-started', this.state.started)
            this.state.ended = this.end > $(document).height() - this.config.end
            this.root.toggleClass('$viewport-ended', this.state.ended)
        }
        return this
    },
    _afterResize() {
        this._measure()._fixVH()._afterScroll()
        return this
    },
    _initHandlers() {
        let viewport = this
        this.scrollLinks.on('click', function(e) {
            e.stopPropagation()
            e.preventDefault()
            let href = $(this).attr('href')
            let whenInView = $(this).data('viewport-scroll') === '' ? true : $(this).data('viewport-scroll')
            viewport.scrollTo(href == '#' ? 0 : $(href), whenInView)
        })
        return this
    },
    _measure() {
        //measure
        this.height = $(window).height()
        this.width = $(window).width()
        this.state.small = this.config.small > this.width
        this.state.large = !this.state.small
        this.root.toggleClass('$viewport-small', this.state.small).toggleClass('$viewport-large', this.state.large)
        return this
    },
    _fixVH() {
        this.vhItems.each((key, value)=>{
            let unit = this.height / 100
            $(value).outerHeight(Math.round(unit * $(value).data('viewport-vh')))
        })
        return this
    },
    _assureOffset(target){
        let offsetY = 0
        if (target instanceof $ && target.length) {
            offsetY = target.offset().top
        }
        if (typeof target === 'number') {
            offsetY = target
        }
        return offsetY
    },
    // External functions
    isTopInView(target) {
        let offsetY = this._assureOffset(target) - this._addToolbar()
        return offsetY >= this.start && offsetY <= this.end
    },
    scrollTo(target, whenInView) {
        let offsetY = this._assureOffset(target)
        whenInView = typeof whenInView === 'undefined' ? true : whenInView
        if (!whenInView && this.isTopInView(offsetY)) {
            return this
        }
        this._executeScroll(offsetY)
        return this
    },
    scrollToHash() {
        if (window.location.hash != '') {
            $(window).scrollTop(0)
            this.scrollTo($(window.location.hash))
        }
        return this
    },
    disableScroll() {
        this.state.disabledScroll = true
        this.root.css('overflow', 'hidden').addClass('$viewport-disabled-scroll')
        return this
    },
    enableScroll() {
        this.state.disabledScroll = false
        this.root.css('overflow', 'initial').removeClass('$viewport-disabled-scroll')
        return this
    },
    update() {
        this._initHandlers()._afterResize()
        return this
    },
    init(options) {
        const viewport = this
        if(options) {
            Object.keys(options).map((key) => {
                if(options[key] instanceof $ || typeof options[key] != 'object'){
                    viewport[key] = options[key]
                }
                else{
                    Object.assign(viewport[key], options[key])
                }
            })
        }

        viewport._readConfigFromDom().update()
        $(window).load(() => {
            viewport.root.addClass('$viewport-loaded')
            viewport.loaded = true
        }).scroll(() => {
            viewport._afterScroll()
        }).resize(() => {
            viewport._afterResize()
        })
        return this
    },
}
