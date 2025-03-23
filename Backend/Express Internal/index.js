const expressInternal = require('./expressInternal')
const app = expressInternal()


app.get('/',(req,res) => {
    console.log('this is req',req)
    console.log('this is res',res)
    console.log('Home page hitting for express server.')
})

app.post('/',(req, res) => {
    console.log('You req sent (home page)')
})

app.get('/about',(req,res) => {
    console.log('about url , get being called.')
})


app.post('/about',(req,res) => {
    console.log('about url , post method hiting.')
})

app.listen(3000 ,() => {
    console.log(' Server running on 3000')
})
