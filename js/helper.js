var prompt = require("prompt");
var yaml = require("js-yaml");

var child_process = require("child_process");
var fs = require("fs");
var path = require("path");
var util = require("util");

var configFile = "../config.json";

function resolve(fpath) {
  return path.resolve(__dirname, fpath);
}

function saveConf(data) {
  if (isPlainObject(data)) {
    data = JSON.stringify(data, null, 2);
  }

  var err = fs.writeFileSync(resolve(configFile), data, "utf8");
  if (err) {
    console.error("WRITE CONF ERR:", err);
  }
}

function getConf() {
  var config = require(configFile);
  if (config.yaml) {
    return config;
  }

  return new Promise((fullfill) => {
    var skip = {
      key: "q",
      check(val) {
        return val.toLowerCase() === "q";
      },
    };

    var yamlSchema = {
      name: "yaml",
      description: `
      请输入yaml文件路径 ("${skip.key}"跳过) eg:
        相对路径: mydir/account.yml 
        绝对路径: d:\\user\\data\\account.yml
      `,
      message: "文件不存在!",
      conform(val) {
        if (skip.check(val)) return true;
        let fpath = resolve(val);
        return fs.existsSync(fpath) && fs.statSync(fpath).isFile();
      },
    };
    var schema = [yamlSchema];

    prompt.start();
    prompt.get(schema, (err, data) => {
      if (err) {
        fullfill(false);
        console.error(err);
        return;
      }

      if (skip.check(data.yaml)) {
        console.warn("请指定yaml文件所在路径:D");
        fullfill(false);
        return;
      }

      saveConf(data);
      fullfill(data);
    });
  });
}

function log(data) {
  isPlainObject(data) || Array.isArray(data)
    ? console.log(util.inspect(data, { colors: true, depth: null }))
    : console.log(data);
}

async function getData(keyPath) {
  let conf = await getConf();
  if (!conf) {
    return;
  }

  let yamlFile = resolve(conf.yaml);
  try {
    data = yaml.safeLoad(fs.readFileSync(yamlFile, "utf8"));
    return get(data, keyPath);
  } catch (e) {
    console.error("PARSE YAML ERR:", e);
  }
}

function isPlainObject(val) {
  return (
    val &&
    typeof val === "object" &&
    Object.getPrototypeOf(val) === Object.prototype
  );
}

// just like _.get()
function get(data, keyPath = "", defval = undefined) {
  if (!keyPath) return data;
  // pa.children[i].book.name -> pa.children.i.book.name
  // data[i][j].name -> data.i.j.name
  keyPath = keyPath.replace(/\[/g, ".").replace(/\]/g, "");

  let keys = keyPath.split(".");
  let ret = data;
  while (keys.length) {
    if (!isPlainObject(ret) && !Array.isArray(ret)) {
      return defval;
    }
    ret = ret[keys.shift()];
  }
  return ret;
}

async function editFile(type) {
  let files = {
    config: resolve(configFile),
    code: resolve(__dirname, "index.js"),
    data: null,
  };

  let file = files[type];
  if (type === "data") {
    let conf = await getConf();
    if (!conf) {
      return;
    }
    file = conf.yaml;
  }

  let fpath = resolve(file);

  child_process.exec(`code ${fpath}`, (err, stdout) => {
    if (err) {
      console.error(
        "\r\n看起来没有安装vscode,或忘记设置path环境变量了喔!  \r\n"
      );
      return console.error("OPEN FILE ERR:", err);
    }

    if (stdout) {
      console.log(stdout);
    }
  });
}

module.exports = {
  saveConf,
  getConf,
  getData,
  editFile,
  log,
};

// getConf();
// editFile("config");
