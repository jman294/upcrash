var highlightSelection = true;
var highlightHover = false;

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

function getSurroundingHtmlElement (text) {
  var stack = []
  var str = text
  var cursor = es.html.ace.env.editor.getCursorPosition()
  var n = cursor.row
  var L = str.length, cursorPosition = -1
  while (n-- && cursorPosition++<L) {
    cursorPosition = str.indexOf('\n', cursorPosition)
    if (i < 0) {
      break
    }
  }
  cursorPosition += cursor.column
  for (var j=0; j<text.length-1; j++) {
    if (j === cursorPosition) {
      break
    }
    var c = text.charAt(j)
    if (c === '<' && text.charAt(j+1) === '/') {
      stack.pop()
    } else if (c === '<') {
      stack.push(j)
    }
  }
  if (stack.length === 0) {
    return text
  } else {
    var t = 0;
    for (t=stack.pop(); t<text.length; t++) {
      if (text.charAt(t) === '>') {
        break
      }
    }
    var pos = t
    return text.slice(0, pos) + ' data-upcrash' + text.slice(pos)
  }
}

es.html.ace.env.editor.selection.on('changeCursor', () => {
  if (highlightSelection) {
    resetIframe()
  }
})

for (let e in es) {
  es[e].ace.setShowPrintMargin(false)
  es[e].ace.getSession().setUseWrapMode(true)
  es[e].ace.setTheme('ace/theme/monokai')

  es[e].ace.on('change', () => {
    clearTimeout(es[e].typeTimer)
    es[e].typeTimer = setTimeout(() => {
      resetIframe()
    }, 500)
    var range = es.html.ace.env.editor.find('<',
      {
        preventScroll: true,
        backwards: false
      }
    )
  })
  es[e].container.addEventListener('mouseenter', () => {
    es[e].pop.style.display = 'block'
  })
  es[e].container.addEventListener('mouseleave', () => {
    es[e].pop.style.display = 'none'
  })
}

var result = document.getElementById('result')
const resetIframe = () => {
  resultPop.style.display = 'block'
  result.removeChild(result.firstElementChild)
  var newIframe = document.createElement('iframe');

  var html
  if (highlightSelection) {
    html = getSurroundingHtmlElement(es.html.ace.session.getValue())
  } else {
    html = es.html.ace.session.getValue()
  }

  var css = '*[data-upcrash] { outline: 2px solid cornflowerblue; }\n' + es.css.ace.session.getValue()
  var js = es.js.ace.session.getValue()

  result.insertBefore(newIframe, result.firstChild);

  newIframe.contentDocument.open();

  newIframe.contentDocument.write(html);
  var cssEl = newIframe.contentDocument.createElement('style')
  cssEl.innerHTML = css

  newIframe.contentDocument.close();
  newIframe.contentDocument.body.appendChild(cssEl)
  var jsEl = newIframe.contentDocument.createElement('script')
  jsEl.innerHTML = js
  newIframe.contentDocument.body.appendChild(jsEl)
  resizeIframe(dims[0].value, dims[1].value)
  setResultSize()

  newIframe.contentDocument.body.addEventListener('mousemove', function (e) { onIframeMove(e, newIframe)})
}

// RESIZE IFRAME
var fullSize = document.getElementById('fullsize')
var resultPop = document.querySelector('#resultpop')
var dims = document.getElementsByClassName('iframedim')
function setResultSize () {
  var iframe = document.getElementsByTagName('iframe')[0]
  dims[0].value = iframe.offsetWidth
  dims[1].value = iframe.offsetHeight
}
for (var t = 0; t<dims.length; t++) {
  dims[t].addEventListener('keydown', (e) => {
    var parsed = parseInt(e.key)
    if (e.keyCode === 8 || e.keyCode === 39 || e.keyCode === 37 || (e.keyCode === 65 && e.ctrlKey) || e.keyCode === 9) {
    } else if (isNaN(parsed)) {
      e.preventDefault()
    }
  })
  dims[t].addEventListener('input', (e) => {
    var rwidth = result.offsetWidth
    var rheight = result.offsetHeight
    if (dims[0].value > rwidth) {
      dims[0].value = rwidth
    } else if (dims[1].value > rheight) {
      dims[1].value = rheight
    }
    resizeIframe(dims[0].value, dims[1].value)

  })
}
function resizeIframe (width, height) {
  var iframe = document.getElementsByTagName('iframe')[0]

  var rwidth = result.offsetWidth
  iframe.style.width = width+'px'

  var rheight = result.offsetHeight
  iframe.style.height = height+'px'
}

result.addEventListener('mouseenter', () => {
  setResultSize()
  resultPop.style.display = 'block'
})
result.addEventListener('mouseleave', () => {
  resultPop.style.display = 'none'
  hoverMask.style.display = 'none'
})
resultPop.addEventListener('click', () => {
  resetIframe()
})

// HOVER INSPECT
var hoverMask = document.getElementById('hover')
function onIframeMove (e, iframe) {
  if (highlightHover) {
    hoverMask.style.display = 'block'
  }
  hoverMask.style.position = 'absolute'
  let hoverEl = iframe.contentDocument.elementFromPoint(e.clientX, e.clientY)
  let hoverElBox = hoverEl.getBoundingClientRect()

  hoverMask.style.top = hoverElBox.y + 'px'
  hoverMask.style.left = hoverElBox.x + 'px'
  hoverMask.style.backgroundColor = '#000'
  hoverMask.style.opacity = '0.3'
  hoverMask.style.height = hoverEl.offsetHeight + 'px'
  hoverMask.style.width = hoverEl.offsetWidth + 'px'
  hoverMask.style.zIndex = '0'
  hoverMask.style.pointerEvents = 'none'
  oldEl = hoverEl;
}

var hoverCheck = document.getElementById('hovercheck')
hoverCheck.addEventListener('change', (e) => {
  if (e.target.checked) {
    highlightHover = true;
  } else {
    highlightHover = false;
  }
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

var highlightCheck = document.getElementById('highlight')
highlightCheck.addEventListener('change', (e) => {
  if (e.target.checked) {
    highlightSelection = true
  } else {
    highlightSelection = false
  }
  resetIframe()
})


// INITIAL
resetIframe()
