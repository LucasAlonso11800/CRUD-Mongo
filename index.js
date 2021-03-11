if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
};

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose')
const passport = require('passport');
const expSession = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo').default;

const app = express();

require('./config/passport');


// IMPORTING ROUTES
const customerRoutes = require('./routes/customer');
const userRoutes = require('./routes/users');


// SETTING
mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MIDDLEWARES
app.use(morgan('dev'));

app.use(expSession({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongoUrl: process.env.MONGO_DB,
        mongooseConnection: mongoose.connection
    })
}));


app.use(passport.initialize());

app.use(passport.session());

app.use(express.urlencoded({
    extended: false
}));

app.use(flash())

// ROUTES

app.use("/customers", customerRoutes);
app.use("/users", userRoutes);

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.redirect('users')
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
});