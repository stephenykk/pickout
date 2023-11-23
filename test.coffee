util = require 'util'

# 定义函数
hi = -> console.log 'hello'
# 调用函数
hi()

# 定义带参函数
foo = (score) ->
    if score > 80
        console.log 'good'
    else
        console.log 'bad'

# 带参调用
foo(90)

# 变量插值
name = 'alice'
console.log "hello #{name}！"

# 回退到js，定义方法
`
async function hellofn() {
    console.log('hellofn: calling..')
    return new Promise(resolve => {
        setTimeout(resolve, 1000, 'hellofn: await done.')
    })
}

async function see() {
    let data = await hellofn()
    console.log(data);
    
}
`
# 调用js方法
see()

# coffee 定义async方法
testAsync = ->
    await Promise.resolve('good-job')

conf = true
test = (val) ->
    console.log util.inspect data, {colors: true, depth: null}
    if not conf
        return 'good'

    if typeof val is 'string'
        console.log 'fine'
    
    
    return true if val > 10
    data = await testAsync()
    console.log data
    count = 10
    val = if count > 10 then 'yes' else 'no'

    # util.hello 'lily'
    #     .say 'nice to meet you'


test()


# 定义对象
type = 'string'
val = 'hello'
data = 
    type: type
    val: val

console.log  data
