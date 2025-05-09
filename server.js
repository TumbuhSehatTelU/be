const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const cors = require('cors');
const morgan = require('morgan');

dotenv.config();
require('./config/passport');

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use(passport.initialize());

app.use('/auth', require('./routes/auth'));   // Authentication routes
app.use('/user', require('./routes/user'));   // User-related routes
app.use('/home', require('./routes/home'));   
mongoose.connect(process.env.MONGO_URI, {
useNewUrlParser: true,
useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'));

app.listen(process.env.PORT, () => {
console.log("server jalan");
});