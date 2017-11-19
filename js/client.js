let iframe = document.querySelector('iframe')
let iframeDocument = iframe.contentDocument || iframe.contentWindow.document
let iframeWindow = iframe.contentWindow

let resultPop = document.querySelector('#resultpop')
let result = document.querySelector('#result')


let es = [
  {
    ace: ace.edit('jsedit'),
    typeTimer: -1,
    container: document.querySelector('#jscon'),
    pop: document.querySelector('#jspop')
  },
  {
    ace: ace.edit('htmledit'),
    typeTimer: -1,
    container: document.querySelector('#htmlcon'),
    pop: document.querySelector('#htmlpop')
  }
]

es[0].ace.getSession().setMode('ace/mode/javascript')
es[0].ace.getSession().setTabSize(2)
es[0].ace.getSession().setUseSoftTabs(true)
es[1].ace.getSession().setMode('ace/mode/html')

for (let e in es) {
  es[e].ace.setTheme('ace/theme/monokai')

  es[e].ace.on('change', () => {
    clearTimeout(es[e].typeTimer)
    es[e].typeTimer = setTimeout(() => {
      setHtml()
      runJs()
    }, 500)
  })
  es[e].container.addEventListener('mouseenter', () => {
    es[e].ace.focus()
    es[e].pop.style.display = 'block'
  })
  es[e].container.addEventListener('mouseleave', () => {
    es[e].pop.style.display = 'none'
  })
}

const runJs = () => {
  let userProg = es[0].ace.env.document.getValue()
  iframeWindow.eval(userProg)
}
const setHtml = () => {
  //iframe.innerHTML = ''
  let body = iframeDocument.querySelector('body')
  while (body.lastChild) {
    body.removeChild(body.lastChild)
  }
  let userMarkup = es[1].ace.env.document.getValue()
  let wrapper = document.createElement('div')
  wrapper.innerHTML = userMarkup
  while (wrapper.firstChild) {
    iframeDocument.body.appendChild(wrapper.firstChild)
  }
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
  runJs()
})

let jsMenu = document.querySelector('#jsmenu')
jsMenu.style.display = 'none'
es[0].pop.addEventListener('click', () => {
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
