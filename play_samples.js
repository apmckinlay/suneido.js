window.play_samples = {
'function':
`f = function (a, b = 1) {
    return a + b
}
f(100)`,

'class':
`class
    {
    x: 123
    f()
        {
        }
    }`,

'MapN':
`f = function (s) { s $ '|' }
'hello world'.MapN(2, f)`,

'slice object':
`x = #(1, 2, 3, 4)
x[1 :: 2]`,

'slice string':
`s = "123456789"
s[1 .. -1]`,

'params':
`f = function (a, b='', c=1) { }
f.Params()`,

'object.Size':
`x = #(1, 2, a: 3)
'Size ' $ x.Size() $ ' list: ' $ x.Size(list:) $ ' named: ' $ x.Size(named:)`,

'block':
`b = {|y| x + y }
x = 100
b(1)`,

'object.Sort':
`x = #(8, 4, 6, 3, 9, 6, 7)
x.Sort!({|x,y| x > y })`,

}
