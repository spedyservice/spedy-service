const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

const initGoogleStrategy = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL || 'https://spedy-service-backend.onrender.com'}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { id: googleId, emails, displayName, photos } = profile;
          const email = emails[0].value;
          const name = displayName;
          const picture = photos?.[0]?.value;

          let user = await User.findOne({ email });
          if (!user) {
            user = await User.create({
              name,
              email,
              googleId,
              emailVerified: true,
              isActive: true,
              profilePicture: picture,
            });
          } else if (!user.googleId) {
            user.googleId = googleId;
            await user.save();
          }

          const token = generateToken(user._id, user.role);
          return done(null, { user, token });
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((data, done) => done(null, data));
  passport.deserializeUser((data, done) => done(null, data));
};

module.exports = { initGoogleStrategy };