import dotenv from 'dotenv'
import cors from 'cors'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/user.routes'
dotenv.config() // to use the .env file
// dotenv is a module that loads environment variables from a .env file into process.env
// it is a way to store configuration in the environment separate from code 



const app = express() // intance of express
// express is a routing framework
// it is a way to manage the routes of the application
const port = 3000

app.use(cors({
  origin: process.env.BASE_URL,
  credentials: true,
  methods:['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization'],
}))

// Middleware to parse incoming JSON payloads in the request body
app.use(express.json())
app.use(express.urlencoded({extended:true}))
/**
 * middleware is used in Express.js to parse incoming requests with URL-encoded payloads. It is typically used when handling form submissions.
The extended: true option allows parsing of nested objects in the URL-encoded data using the qs library.
If extended: false, it uses the querystring library, which does not support nested objects.
 */
app.use(cookieParser())
/**
 * The app.use(cookieParser()) middleware is used in Express.js to parse cookies attached to the client request object. It makes the cookies available in req.cookies as a JavaScript object.
If a client sends a request with cookies, cookieParser() will parse them and populate req.cookies with key-value pairs of the cookies.

 */



// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  console.log('Consoling request',req)
  console.log('Consoling res',res)
  res.send('hello world')
})

app.use('api/v1/users',userRoutes)
db() //Connect to DB

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})






