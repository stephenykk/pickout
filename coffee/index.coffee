program = require 'commander'

helper = require './helper'
packageJson = require '../package'

main = ->
    program.version packageJson.version
           .name packageJson.name
           .description '快速查看yaml文件字段内容的小工具'

    program.command 'data [keyPath]'
           .description '查看全部或部分数据'
           .action (keyPath) ->
                helper.log await helper.getData keyPath
    
    program.command 'file'
           .description '显示yaml文件路径'
           .action ->
                conf = await helper.getConf()
                console.log conf.yaml if conf
    
    program.command 'keys'
           .description '显示所有最外层字段名'
           .action ->
                data = await helper.getData()
                console.log Object.keys data if data
    program.command 'config'
           .description '显示config.json的内容'
           .option '-c, --clear', '重置config.json'
           .option "-y, --yaml", "显示yaml文件路径"
           .action (cmd) ->
                if cmd.clear
                    helper.saveConf {}
                    console.log 'config.json已重置'
                    return
                
                conf = await helper.getConf()
                console.log(if cmd.yaml then conf.yaml else conf) if conf

    program.command 'edit <type>'
           .description '编辑配置文件,yaml文件或应用脚本'
           .action (type) ->
                types = ['config', 'data', 'code']
                if not types.includes type
                    console.warn "<type>参数有误，只能为:#{types.join('|')}"
                    return false
                
                helper.editFile type
    
    program.command 'use', {isDefault: true}
           .description '显示帮助信息'
           .action ->
                program.outputHelp()
    
    program.on '--help', ->
        console.log '\n\n使用示例:'
        examples = [
            "pkout help",
            "pkout data",
            "pkout data baidu.url",
            "pkout data sites[0].url",
            "pkout file",
            "pkout keys",
            "pkout config",
            "pkout config -c",
            "pkout config -y",
            "pkout edit data",
            "pkout edit code",
            "pkout edit config",
        ]

        console.log examples.map((exam) -> '  ' + exam).join '\n'
    

    program.parse process.argv


# main()
module.exports = main