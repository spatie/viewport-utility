const $ = require('jquery')

const viewport = require('./../../lib/viewport-utility').init({
    toolbar: $('.toolbar'), // Unneccesary, only for demo
    config: {
        small: 800,
    },
})

// Example code

window.viewport = viewport //easy console debugging

$('[data-example-disable]').on('click', function(){
    viewport.state.disabledScroll ? viewport.enableScroll() : viewport.disableScroll()
    $('[data-example-disable-verb]').text( viewport.state.disabledScroll ? 'Enable' : 'Disable')
})


$('[data-example-hash]').on('click', function(){
    window.location.hash = '#vh'
    location.reload()
})

$('[data-example-inview-item]').on('change', function(){
    updateInviewExmaple()
})

function updateInviewExmaple(){
    let target = eval($('[data-example-inview-item]').val())
    $('[data-example-inview-result]').text((viewport.isTopInView(target)))
}

$(window).scroll(function(){
    updateInviewExmaple()
})

$(window).load(function(){
    updateInviewExmaple()
    viewport.scrollToHash()
})

window.setInterval(function(){
    $('[data-example-css]').text(viewport.root.attr('class'))
}, 200)
