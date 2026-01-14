import express, { json , urlencoded} from 'express'
import cors from 'cors'
import {LIMIT} from './constants.js'
import cookieParser from 'cookie-parser'

const app = express()
app.use(cors(
    {
        origin : true,
        credentials : true
    }
))

app.use(json({
    limit : LIMIT
}))

app.use(urlencoded({
    extended : true,
    limit : LIMIT
}))

app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('ReviCode is Ready...!!! So are you???')
})


// import routes
import userRouter from './routes/user.routes.js'
import questionRouter from './routes/question.routes.js'
import collectionRouter from './routes/collection.routes.js'
import collectioQuestionRouter from './routes/collectionQuestion.routes.js'


//  use routes
app.use('/api/v1/users', userRouter)
app.use('/api/v1/questions', questionRouter)
app.use('/api/v1/collections', collectionRouter)
app.use('/api/v1/collections', collectioQuestionRouter)



export {
    app
}