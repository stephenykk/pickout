hi = -> console.log 'hello'
hi()


foo = (score) ->
    if score > 80
        console.log 'good'
    else
        console.log 'bad'

foo(90)

name = 'alice'
console.log "hello #{name}！"

`
async function hellofn() {
    console.log('good')
    return await new Promise(resolve => {
        setTimeout(resolve.bind(this, 'data'), 1000)
    })
}

async function see() {
    let data = await hellofn()
    console.log(data);
    
}
`
see()


testAsync = ->
    await Promise.resolve('good-job')

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

test()


