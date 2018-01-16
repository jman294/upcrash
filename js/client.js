let iframe = document.querySelector('iframe') || frames[0]
let iframeDocument = iframe.contentDocument || iframe.contentWindow.document
let iframeWindow = iframe.contentWindow

let resultPop = document.querySelector('#resultpop')
let result = document.querySelector('#result')

var es = {
  js: {
    ace: ace.edit('jsedit'),
    typeTimer: -1,
    container: document.querySelector('#jscon'),
    dropzone: document.querySelector('#jscon .dropzone'),
    pop: document.querySelector('#jspop')
  },
  css: {
    ace: ace.edit('cssedit'),
    typeTimer: -1,
    container: document.querySelector('#csscon'),
    dropzone: document.querySelector('#csscon .dropzone'),
    pop: document.querySelector('#csspop')
  },
  html: {
    ace: ace.edit('htmledit'),
    typeTimer: -1,
    container: document.querySelector('#htmlcon'),
    dropzone: document.querySelector('#htmlcon .dropzone'),
    pop: document.querySelector('#htmlpop')
  }
}

es.js.ace.getSession().setMode('ace/mode/javascript')
es.js.ace.getSession().setTabSize(2)
es.js.ace.getSession().setUseSoftTabs(true)
es.css.ace.getSession().setMode('ace/mode/css')
es.html.ace.getSession().setMode('ace/mode/html')

for (let e in es) {
  es[e].ace.setTheme('ace/theme/monokai')

  es[e].ace.on('change', () => {
    clearTimeout(es[e].typeTimer)
    es[e].typeTimer = setTimeout(() => {
      setHtml()
      addCss()
      runJs()
    }, 500)
  })
  es[e].container.addEventListener('mouseenter', () => {
    es[e].pop.style.display = 'block'
  })
  es[e].container.addEventListener('mouseleave', () => {
    es[e].pop.style.display = 'none'
  })
  es[e].dropzone.addEventListener('mouseenter', () => {
    es[e].ace.focus()
  })
}

const runJs = () => {
  let userProg = es.js.ace.env.document.getValue()
  iframeWindow.eval(userProg)
}
const setHtml = () => {
  //iframe.innerHTML = ''
  let body = iframeDocument.querySelector('body')
  while (body.lastChild) {
    body.removeChild(body.lastChild)
  }
  let userMarkup = es.html.ace.env.document.getValue()
  let wrapper = document.createElement('div')
  wrapper.innerHTML = userMarkup
  while (wrapper.firstChild) {
    iframeDocument.body.appendChild(wrapper.firstChild)
  }
}
const addCss = () => {
  let userCss = es.css.ace.session.getValue()
  let style = iframeDocument.createElement('style')
  style.innerHTML = userCss
  iframeDocument.body.appendChild(style)
}
const resetIframe = () => {
  let iframeParent = iframe.parentNode
  iframe.parentNode.removeChild(iframe)
  iframe = document.createElement('iframe')
  result.appendChild(iframe)
  iframe = document.querySelector('iframe')
  iframeDocument = iframe.contentDocument || iframe.contentWindow.document
  iframeWindow = iframe.contentWindow
}

result.addEventListener('mouseenter', () => {
  resultPop.style.display = 'block'
})
result.addEventListener('mouseleave', () => {
  resultPop.style.display = 'none'
})
resultPop.addEventListener('click', () => {
  resetIframe()
  setHtml()
  addCss()
  runJs()
})

let jsMenu = document.querySelector('#jsmenu')
jsMenu.style.display = 'none'
es.js.pop.addEventListener('click', () => {
  switch (jsMenu.style.display) {
    case 'block':
      jsMenu.style.display = 'none'
      break
    case 'none':
      jsMenu.style.display = 'block'
      break
  }
})

let button = document.querySelector('#menubutton')
button.addEventListener('click', () => {
  console.log('aasdf')
})
