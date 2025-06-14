const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const cors = require('cors');
const morgan = require('morgan');

dotenv.config();
require('./config/passport');

const app = express();
app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:50498", "https://berework-production.up.railway.app", "berework-production-1c3d.up.railway.app","http://10.0.2.2"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(morgan('dev'));
app.use(express.json());

app.use(passport.initialize());

app.use('/auth', require('./routes/auth'));   // Authentication routes
app.use('/user', require('./routes/user'));   // User-related routes
app.use('/home', require('./routes/home'));   
app.use('/anak', require('./routes/anak'));   //kjhohklhkjbh
app.use('/chat', require('./routes/chat'));
app.use('/post', require('./routes/post'));
mongoose.connect(process.env.MONGO_URI, {
useNewUrlParser: true,
useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'));

app.listen(process.env.PORT, () => {
console.log("server jalan,cacokkkk");
});
