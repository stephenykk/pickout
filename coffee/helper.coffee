prompt = require 'prompt'
yaml = require 'js-yaml'

child_process = require 'child_process'
fs = require 'fs'
path = require 'path'
util = require 'util'

configFile = './config.json'


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
            description: `
    )