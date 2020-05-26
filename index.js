#!/usr/bin/env node

var prompt = require("prompt");
var program = require("commander");
var fs = require("fs");
var path = require("path");

var tools = require("./tools");
var packageJson = require("./package");
var config = require("./config");

// config the yaml file path
if (!config.yaml) {
  var schema = [
    {
      name: "yaml",
      description: "请输入yaml文件的路径",
      message: ":( 没有对应的文件喔~, 请重新输入",
      conform: function (val) {
        var exists = fs.existsSync(path.resolve(val));
        return exists;
      },
    },
  ];

  prompt.start();
  prompt.get(schema, (err, conf) => {
    if (err) return console.error(err);
    tools.writeConf(conf);
    main(conf);
  });
} else {
  main(config);
}

// start
function main(conf) {
  var data = tools.getData(conf.yaml);

  // handle options and arguments
  program
    .version(packageJson.version)
    .command("data [keypath]", { isDefault: true })
    .description("根据keypath获取数据 默认子命令, example: pkout mysite.url")
    .action((keypath) => {
      if (!keypath) {
        program.outputHelp((str) => str);
      } else {
        if (keypath.toLowerCase() === "all") {
          keypath = "";
        }

        var targetData = tools.get(data, keypath);
        console.log(targetData);
      }
    });

  program
    .command("file")
    .description("显示yaml文件路径")
    .action(() => {
      console.log(conf.yaml);
    });

  program
    .command("keys")
    .description("显示所有最外层字段名")
    .action(() => {
      console.log(Object.keys(data));
    });

  program
    .command("conf")
    .description("显示config.json的内容")
    .option("-c, --clear", "重置config.json")
    .action((cmd) => {
      let { clear } = cmd.opts();
      if (clear) {
        tools.writeConf({});
      } else {
        console.log(conf)
      }
    });

  program
    .command("edit [what]")
    .description(
      "what is {yaml | js} 用vscode打开对应文件 example: pkout edit yaml"
    )
    .action((type) => {
      type = type || "yaml";
      if (!["yaml", "js"].includes(type)) {
        console.error("参数有误: edit or  edit yaml or edit js");
        return;
      }

      tools.editFile(type === "yaml" ? conf.yaml : __filename);
    });

  program.on("--help", () => {
    let examples = [
      "pkout",
      "pkout all",
      "pkout mysite.user",
      "pkout mysite.images.0.url",
      "pkout mysite.images[0].url",
      "pkout conf",
      "pkout conf -c",
      "pkout edit",
      "pkout edit js",
    ];
    console.log(examples.map((exam) => "  " + exam).join("\n"));
  });

  program.parse(process.argv);
}
