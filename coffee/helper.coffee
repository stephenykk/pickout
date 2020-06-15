prompt = require 'prompt'
yaml = require 'js-yaml'

child_process = require 'child_process'
fs = require 'fs'
path = require 'path'
util = require 'util'

configFile = '../config.json'


resolve = (fpath) ->
    path.resolve __dirname, fpath

isPlainObject = (val) ->
    return val and typeof val is 'object' and Object.getPrototypeOf val is Object.prototype

saveConf = (data) ->
    data = JSON.stringify data, null, 2 if isPlainObject data

    err = fs.writeFileSync resolve(configFile), data, 'utf8'
    console.log 'WRITE CONF ERROR', err if err

getConf = ->
    config = require configFile
    if config.yaml
        return config
    
    return new Promise((res) ->
        skip =
            key: 'q'
            check: (val) -> val.toLowerCase() is 'q'
        
        yamlSchema =
            name: 'yaml'
            description: "请输入yaml文件路径('#{skip.key}'跳过)"
            message: '文件不存在!'
            confirm: (val) ->
                if skip.check val
                    return true
                fpath = resolve val
                return  fs.existsSync(fpath) and fs.statSync(fpath).isFile()
        
        schema = [yamlSchema]

        prompt.start()
        prompt.get(schema, (err, data) -> 
            if err
                res false
                console.error err
                return

            if skip.check data.yaml
                console.warn "请指定yaml文件所在路径:D"
                res false
                return

            saveConf data
            res data       
        )
    )

log = (data) ->
    if isPlainObject(data) or Array.isArray data
        console.log util.inspect data, {colors: true, depth: null}
    else
        console.log data

getData = (keyPath)  ->
    conf = await getConf()
    return false if not conf

    yamlFile = resolve conf.yaml
    try
        data = yaml.safeLoad fs.readFileSync yamlFile, 'utf8'
        return get data, keyPath
    catch e
        console.error 'PARSE YAML ERR:', e

# just like _.get
get = (data, keyPath = '', defval = undefined) ->
    return data if not keyPath
    # data[i][j].name -> data.i.j.name
    keyPath = keyPath.replace(/\[/g, '.').replace(/\]/g, '')

    keys = keyPath.split '.'
    ret = data
    while keys.length
        return defval if not isPlainObject(ret) and not Array.isArray ret

        ret = ret[keys.shift()]
    
    return ret

editFile = (type) ->
    files = 
        config: configFile
        code: resolve __dirname, 'index.js'
        data: null
    
    file = files[type]
    if type is 'data'
        conf = await getConf()
        return false if not conf
        file = conf.yaml
    
    fpath = resolve file
    child_process.exec "code #{fpath}", (err, stdout) ->
        if err
            console.error '\r\n看起来没有安装vscode,或忘记设置path环境变量了喔!  \r\n'
            return console.error 'OPEN FILE ERR:', err
        
        console.log stdout if stdout

module.exports = 
    saveConf: saveConf
    getConf: getConf
    getData: getData
    editFile: editFile
    log: log
