prompt = require 'prompt'
yaml = require 'js-yaml'

child_process = require 'child_process'
fs = require 'fs'
path = require 'path'
util = require 'util'

configFile = './config.json'

isPlainObject = (val) ->
    return val and typeof val is 'Object' and Object.getPrototypeOf val is Object.prototype

resolve = (fpath) ->
    path.resolve __dirname, fpath

saveConf = (data) ->
    data = JSON.stringify data, null, 2 if isPlainObject data

    err = fs.writeFileSync resolve configFile, data, 'utf8'
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
            confirm: (val) ->
                return true if skip.check(val)
                fpath = resolve val
                return fs.existsSync fpath && fs.statSync(fpath).isFile()
        
        schema = [yamlSchema]

        prompt.start()
        prompt.get schema, (err, data) ->
            if err
                res false
                console.error err
                return
            
            if skip.check data.yaml
                console.log "请指定yaml文件所在路径:D"
                res false
                return
            
            saveConf data
            res data
    )

log = (data) ->
    if isPlainObject data or Array.isArray data
        console.log util.inspect data, {colors: true, depth: null}
    else
        console.log data

getData = (keyPath) ->
    conf = await getConf()
    return if not conf

    yamlFile = resolve conf.yaml

    try
        data = yaml.safeLoad fs.readFileSync yamlFile, 'utf8'
        return get data, keyPath
    catch err
        console.error 'PARSE YAML ERR:', err
    