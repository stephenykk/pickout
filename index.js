#!/usr/bin/env node

var program = require("commander");

var helper = require("./helper");
var packageJson = require("./package");

function main() {
  program
    .version(packageJson.version)
    .name(packageJson.name)
    .description("快速查看yaml文件字段内容的小工具");

  program
    .command("data [keyPath]")
    .description("查看全部或部分数据")
    .action(async (keyPath) => {
      helper.log(await helper.getData(keyPath));
    });

  program
    .command("file")
    .description("显示yaml文件路径")
    .action(async () => {
      let conf = await helper.getConf()
      if(conf) {
        console.log(conf.yaml);
      }
    });

  program
    .command("keys")
    .description("显示所有最外层字段名")
    .action(async () => {
      let data = await helper.getData()
      if(data) {
        console.log(Object.keys(data));
      }
    });

  program
    .command("config")
    .description("显示config.json的内容")
    .option("-c, --clear", "重置config.json")
    .option("-y, --yaml", "显示yaml文件路径")
    .action(async (cmd) => {
      if(cmd.clear) {
        helper.saveConf({})
        console.log('config.json已重置');
        return
      }

      let conf = await helper.getConf()
      if(conf) {
        console.log(cmd.yaml ? conf.yaml : conf)
      }
    });

  program
    .command("edit <type>")
    .description("编辑配置文件,yaml文件或应用脚本")
    .action((type) => {
      let types = ['config', 'data', 'code']
      if(!types.includes(type)) {
        console.warn(`<type>参数有误，只能为:${types.join('|')}`)
        return
      }

      helper.editFile(type);
    });

  program
    .command("use", { isDefault: true })
    .description("显示帮助信息")
    .action(() => {
      program.outputHelp();
    });

  program.on("--help", () => {
    console.log("\n\n使用示例:");
    let examples = [
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
    ];
    console.log(examples.map((exam) => "  " + exam).join("\n"));
  });

  program.parse(process.argv);
}

main();
