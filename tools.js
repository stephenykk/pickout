var child_process = require('child_process');
var yaml = require('js-yaml');
var fs = require('fs')
var path = require('path')
var configFile = 'config.json'

function resolve(fpath) {
    return path.resolve(__dirname, fpath)
}

function writeConf(data) {
    var cfile = resolve(configFile)
    if(isPlainObject(data)) {
        data = JSON.stringify(data, null, 2);
    }

    var err = fs.writeFileSync(cfile, data, 'utf8')
    if(err) {
        console.error('write config error:', err)
    }
}

function getData(yamlFile) {
    var data = false
    try {
        data = yaml.safeLoad(fs.readFileSync(yamlFile, 'utf8'))
        
    }catch(e) {
        console.error('parse yaml error:', e)
    }

    return data
}

function isPlainObject(val) {
    return val && typeof val === 'object'
}


// just like _.get()
function get(data, keyPath = '', defval = undefined) {
    if(!keyPath) return data

    let keys = keyPath.split('.')
    let ret = data
    while(keys.length) {
        if(!isPlainObject(ret)) {
            return defval
        }
        ret = ret[keys.shift()]
    }
    return ret;
}

function editFile(fpath) {
    child_process.exec(`code ${fpath}`, (err, stdout) => {
        if(err) return console.error('open file error:', err);

        if(stdout) {
            console.log(stdout);
        }
    })
}

module.exports = {
    resolve,
    writeConf,
    getData,
    get,
    isPlainObject,
    editFile
}