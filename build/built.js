var iframe = document.querySelector('iframe') || frames[0]
var iframeDocument = iframe.contentDocument || iframe.contentWindow.document
var iframeWindow = iframe.contentWindow

var es = {
  js: {
    ace: ace.edit('jsedit'),
    typeTimer: -1,
    container: document.querySelector('#jscon'),
    dropzone: document.querySelector('#jscon .dropzone'),
    pop: document.querySelector('#jspop'),
    check: document.querySelector('#jscheck')
  },
  css: {
    ace: ace.edit('cssedit'),
    typeTimer: -1,
    container: document.querySelector('#csscon'),
    dropzone: document.querySelector('#csscon .dropzone'),
    pop: document.querySelector('#csspop'),
    check: document.querySelector('#csscheck')
  },
  html: {
    ace: ace.edit('htmledit'),
    typeTimer: -1,
    container: document.querySelector('#htmlcon'),
    dropzone: document.querySelector('#htmlcon .dropzone'),
    pop: document.querySelector('#htmlpop'),
    check: document.querySelector('#htmlcheck')
  }
}

es.js.ace.getSession().setMode('ace/mode/javascript')
es.js.ace.getSession().setTabSize(2)
es.js.ace.getSession().setUseSoftTabs(true)
es.css.ace.getSession().setMode('ace/mode/css')
es.html.ace.getSession().setMode('ace/mode/html')

for (let e in es) {
  es[e].ace.setShowPrintMargin(false)
  es[e].ace.getSession().setUseWrapMode(true)
  es[e].ace.setTheme('ace/theme/monokai')

  es[e].ace.on('change', function () {
    clearTimeout(es[e].typeTimer)
    es[e].typeTimer = setTimeout(function () {
      setHtml()
      addCss()
      runJs()
    }, 500)
  })
  es[e].container.addEventListener('mouseenter', function () {
    es[e].pop.style.display = 'block'
  })
  es[e].container.addEventListener('mouseleave', function () {
    es[e].pop.style.display = 'none'
  })
  //es[e].dropzone.addEventListener('mouseenter', function () {
    //es[e].ace.focus()
  //})
}

const runJs = function () {
  var userProg = es.js.ace.env.document.getValue()
  iframeWindow.parent = null
  iframeWindow.document.write = null
  iframeWindow.eval(userProg)
}
const setHtml = function () {
  var body = iframeDocument.querySelector('body')
  while (body.lastChild) {
    body.removeChild(body.lastChild)
  }
  var userMarkup = es.html.ace.env.document.getValue()
  var wrapper = document.createElement('div')
  wrapper.innerHTML = userMarkup
  while (wrapper.firstChild) {
    iframeDocument.body.appendChild(wrapper.firstChild)
  }
}
const addCss = function () {
  var userCss = es.css.ace.session.getValue()
  var style = iframeDocument.createElement('style')
  style.innerHTML = userCss
  iframeDocument.body.appendChild(style)
}

const resetIframe = function () {
  var iframeParent = iframe.parentNode
  iframe.parentNode.removeChild(iframe)
  iframe = document.createElement('iframe')
  result.appendChild(iframe)
  iframe = document.querySelector('iframe')
  iframeDocument = iframe.contentDocument || iframe.contentWindow.document
  iframeWindow = iframe.contentWindow
}

var resultPop = document.querySelector('#resultpop')
var result = document.querySelector('#result')

result.addEventListener('mouseenter', function () {
  resultPop.style.display = 'block'
})
result.addEventListener('mouseleave', function () {
  resultPop.style.display = 'none'
})
resultPop.addEventListener('click', function () {
  setHtml()
  addCss()
  runJs()
})

var button = document.querySelector('#menubutton')
button.addEventListener('click', function () {
})

// LAYOUT
var contentBody = document.getElementById('body')
var checkBoxes = document.getElementsByClassName('check')
for (var i=0; i<checkBoxes.length; i++) {
  var el = checkBoxes[i]
  el.checked = 'true'
  el.addEventListener('change', (e) => {
    var numEditors = contentBody.children.length-1
    if (e.target.checked) {
      es.js.check.disabled = false
      es.css.check.disabled = false
      es.html.check.disabled = false
      switch (e.target.id) {
        case 'jscheck':
          if (numEditors === 2) {
            es.js.container.style.top = '0%'
            es.js.container.style.bottom = '66.66%'
            es.css.container.style.top = '33.33%';
            es.css.container.style.bottom = '33.33%';
            es.html.container.style.top = '66.66%';
            es.html.container.style.bottom = '0%';
          } else {
            es.js.container.style.top = '0%'
            es.js.container.style.bottom = '50%'
            contentBody.firstElementChild.style.top = '50%'
            contentBody.firstElementChild.style.bottom = '0%'
          }
          contentBody.insertBefore(es.js.container, contentBody.firstChild)
          break
        case 'csscheck':
          if (numEditors === 2) {
            es.js.container.style.top = '0%';
            es.js.container.style.bottom = '66.66%';
            es.css.container.style.top = '33.33%';
            es.css.container.style.bottom = '33.33%';
            es.html.container.style.top = '66.66%';
            es.html.container.style.bottom = '0%';
          } else {
            if (contentBody.firstElementChild.id.includes('html')) {
              es.css.container.style.top = '0%'
              es.css.container.style.bottom = '50%'
              contentBody.firstElementChild.style.top = '50%'
              contentBody.firstElementChild.style.bottom = '0%'
            } else {
              es.css.container.style.top = '50%'
              es.css.container.style.bottom = '0%'
              contentBody.firstElementChild.style.top = '0%'
              contentBody.firstElementChild.style.bottom = '50%'
            }
          }
          contentBody.insertBefore(es.css.container, contentBody.firstChild)
          break
        case 'htmlcheck':
          if (numEditors === 2) {
            es.js.container.style.top = '0%';
            es.js.container.style.bottom = '66.66%';
            es.css.container.style.top = '33.33%';
            es.css.container.style.bottom = '33.33%';
            es.html.container.style.top = '66.66%'
            es.html.container.style.bottom = '0%'
          } else {
            es.html.container.style.top = '50%'
            es.html.container.style.bottom = '0%'
            contentBody.firstElementChild.style.top = '0%'
            contentBody.firstElementChild.style.bottom = '50%'
          }
          contentBody.insertBefore(es.html.container, contentBody.firstChild)
          break
      }
    } else {
      switch (e.target.id) {
        case 'jscheck':
          contentBody.removeChild(es.js.container)
          if (numEditors === 3) {
            es.css.container.style.top = '0%';
            es.css.container.style.bottom = '50%';
            es.html.container.style.top = '50%';
            es.html.container.style.bottom = '0%';
          } else if (numEditors === 2) {
            contentBody.firstElementChild.style.top = '0%'
            contentBody.firstElementChild.style.bottom = '0%'
            if (contentBody.firstElementChild.id.includes('css')) {
              es.css.check.disabled = true
            } else {
              es.html.check.disabled = true
            }
          } else {
          }
          break
        case 'csscheck':
          contentBody.removeChild(es.css.container)
          if (numEditors === 3) {
            es.js.container.style.top = '0%';
            es.js.container.style.bottom = '50%';
            es.html.container.style.top = '50%';
            es.html.container.style.bottom = '0%';
          } else if (numEditors === 2) {
            contentBody.firstElementChild.style.top = '0%'
            contentBody.firstElementChild.style.bottom = '0%'
            if (contentBody.firstElementChild.id.includes('html')) {
              es.html.check.disabled = true
            } else {
              es.js.check.disabled = true
            }
          } else {
          }
          break
        case 'htmlcheck':
          contentBody.removeChild(es.html.container)
          if (numEditors === 3) {
            es.js.container.style.top = '0%';
            es.js.container.style.bottom = '50%';
            es.css.container.style.top = '50%';
            es.css.container.style.bottom = '0%';
          } else if (numEditors === 2) {
            contentBody.firstElementChild.style.top = '0%'
            contentBody.firstElementChild.style.bottom = '0%'
            if (contentBody.firstElementChild.id.includes('js')) {
              es.js.check.disabled = true
            } else {
              es.css.check.disabled = true
            }
          } else {
          }
          break
      }
    }
    es.js.ace.resize()
    es.css.ace.resize()
    es.html.ace.resize()
  })
}
