const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

passport.use(new GoogleStrategy({
clientID: process.env.GOOGLE_CLIENT_ID,
clientSecret: process.env.GOOGLE_CLIENT_SECRET,
callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
let user = await User.findOne({ googleId: profile.id });

if (!user) {
user = await User.create({
googleId: profile.id,
namaDepan: profile.name.givenName,
namaBelakang: profile.name.familyName,
fotoBase64: profile.photos?.[0]?.value || '',
});
}

return done(null, user);
}));