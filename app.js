if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const flash = require('connect-flash')
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Review = require("./models/review");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
//const helmet = require("helmet");
const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
const MongoStore = require("connect-mongo");

const mongoSanitize = require('express-mongo-sanitize');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});

const app = express();

app.engine('ejs', ejsMate)

//this allows us to get ejs pages from view directory 
app.set('view engine', 'ejs');

//sets the directory as views
app.set('views', path.join(__dirname, 'views'))

//Parses request body
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize());

//app.use(helmet({contentSecurityPolicy: false}));


const sessionConfig = {
    store: MongoStore.create({ 
        mongoUrl: dbURL,
        secret: "thishouldbeasecret",
        touchAfter:  24 * 60 * 60
    }),
    name: 'Session-Cook',
    secret: 'thisSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};


app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser', async(req, res) => {
    const user = new User({email: 'casey@gmail.com', username: 'casey'})
    const newUser = await User.register(user, 'chicken');
    res.send(newUser)
})

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.render('home')
});

//Error handling
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
}) 

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`)
});