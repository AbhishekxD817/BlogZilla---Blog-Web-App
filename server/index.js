import express from 'express'
import connectDb from './utils/db/dbConfig.js'
import AppError from './utils/ErrorHandlers/appError.js'
import authRouter from './routers/authRouter.js';
import blogsRouter from './routers/blogsRouter.js';
import commentsRouter from './routers/commentsRouter.js';
import usersRouter from './routers/usersRouter.js';
import cookieParser from 'cookie-parser';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(process.env.PORT, async () => {
    console.log("Server Started => http://localhost:" + process.env.PORT);
    await connectDb();
})


app.get('/', (req, res, next) => {
    res.send("Hi from server...")
})



app.use('/auth', authRouter);
app.use('/blogs', blogsRouter);
app.use('/comments', commentsRouter);
app.use('/users', usersRouter);



// handle undefined routes
app.all("*", (req, res, next) => {
    return next(new AppError(404, "NOT FOUND"));
})


// error handling route
app.use((error, req, res, next) => {
    const { status = 500, message = "INTERNAL SERVER ERROR" } = error;
    return res.status(status).json({
        message
    })
})

