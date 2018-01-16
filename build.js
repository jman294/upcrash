const fs = require('fs')

let file = fs.readFileSync('js/client.js').toString()

file = file.replace(/\(\) =>/g, 'function ()')

fs.writeFileSync('build/built.js', file)