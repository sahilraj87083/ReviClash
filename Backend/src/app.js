import express, { json , urlencoded} from 'express'
import cors from 'cors'
import {LIMIT} from './constants.js'
import cookieParser from 'cookie-parser'

const app = express()
// app.use(cors(
//     {
//         origin : true,
//         credentials : true
//     }
// ))
app.set("trust proxy", 1);

app.use(cors({
    origin: [
        process.env.CORS_ORIGIN, // Keeping this for flexibility
        "https://www.reviclash.com",
        "https://reviclash.com", // In case user types without www
        "https://revi-clash.vercel.app", // Vercel backup
        "http://localhost:5173"
    ],
    credentials: true
}));

app.use(json({
    limit : LIMIT
}))

app.use(urlencoded({
    extended : true,
    limit : LIMIT
}))

app.use(cookieParser())

import "./jobs/contest.jobs.js";


app.get('/', (req, res) => {
    res.send('ReviCode is Ready...!!! So are you???')
})


// import routes
import healthcheckRouter from './routes/healthCheck.routes.js'
import userRouter from './routes/user.routes.js'
import questionRouter from './routes/question.routes.js'
import collectionRouter from './routes/collection.routes.js'
import collectioQuestionRouter from './routes/collectionQuestion.routes.js'
import contestRoutes from './routes/contest.routes.js'
import contestParticipantRoutes from './routes/contestParticipant.routes.js'
import userStatsRouter from './routes/userStats.routes.js'
import followRoutes from './routes/follow.routes.js'
import contestMessageRoutes from './routes/contestMessage.routes.js' 
import userPrivateMessageRouter from './routes/privateMessage.routes.js'
import otpRouter from './routes/otp.routes.js'
import postRouter from './routes/post.routes.js'
import feedRouter from './routes/feed.routes.js'
import repostRouter from './routes/repost.routes.js'
import commentRouter from './routes/comment.routes.js'
import savedPostRouter from './routes/savedPost.routes.js'
import likeRouter from './routes/like.routes.js'



//  use routes
app.use("/api/v1/healthcheck", healthcheckRouter);

app.use('/api/v1/users', userRouter)
app.use('/api/v1/otp', otpRouter)


app.use('./api/v1/post' , postRouter)
app.use('./api/v1/feed' , feedRouter)
app.use('./api/v1/repost' , repostRouter)
app.use('./api/v1/comment' , commentRouter)
app.use('./api/v1/saved', savedPostRouter)
app.use('./api/v1/like', likeRouter)



app.use('/api/v1/users/chat', userPrivateMessageRouter)

app.use('/api/v1/questions', questionRouter)
app.use('/api/v1/collections', collectionRouter)
app.use('/api/v1/collections', collectioQuestionRouter)


app.use('/api/v1/contests', contestRoutes)
app.use('/api/v1/contest-participants', contestParticipantRoutes)
app.use('/api/v1/contest/chat', contestMessageRoutes)


app.use('/api/v1/stats', userStatsRouter)
app.use('/api/v1/follow', followRoutes)




export {
    app
}