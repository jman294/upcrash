var iframe = document.querySelector('iframe') || frames[0]
var highlightSelection = true;

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

es.html.ace.env.editor.on('focus', () => {
  highlightSelection = true
})
es.html.ace.env.editor.on('blur', () => {
  highlightSelection = false
})

function getSurroundingHtmlElement (text) {
  var closeBracket = es.html.ace.env.editor.find('>',
    {
      preventScroll: true,
      backwards: true
    }
  )
  if (closeBracket === null) {
    return text;
  }

  var str = text
  var n = closeBracket.start.row
  var L = str.length, i = -1
  while (n-- && i++<L) {
    i = str.indexOf('\n', i)
    if (i < 0) {
      break
    }
  }
  i += closeBracket.start.column + 1
  return str.slice(0, i) + ' data-upcrash' + str.slice(i)
}

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
    //var cursor = es.html.ace.env.editor.selection.getCursor()
    //if (range === null) {
      //return
    //}
    //if (range.start.row > cursor.row) {
      //getSurroundingHtmlElement()
    //} else if (range.start.row === cursor.row) {
      //if (range.start.column > cursor.column) {
        //getSurroundingHtmlElement()
      //}
    //}
  })
  es[e].container.addEventListener('mouseenter', () => {
    es[e].pop.style.display = 'block'
  })
  es[e].container.addEventListener('mouseleave', () => {
    es[e].pop.style.display = 'none'
  })
}

var result = document.querySelector('#result')
const resetIframe = () => {
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
}

var resultPop = document.querySelector('#resultpop')

result.addEventListener('mouseenter', () => {
  resultPop.style.display = 'block'
})
result.addEventListener('mouseleave', () => {
  resultPop.style.display = 'none'
})
resultPop.addEventListener('click', () => {
  resetIframe()
})

var button = document.querySelector('#menubutton')
button.addEventListener('click', () => {
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
