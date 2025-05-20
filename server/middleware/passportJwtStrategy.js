// server/middleware/passportJwtStrategy.js

const { Strategy: JwtStrategy } = require('passport-jwt');
const dotenv = require('dotenv');
const User = require('../models/User'); // Sequelize User model

dotenv.config();

/**
 * Custom cookie extractor to retrieve JWT from a secure HTTP-only cookie
 */
const cookieExtractor = (req) => {
  return req?.cookies?.access_token || null; // Consistent with authCookies.js
};

/**
 * Initialize Passport JWT Strategy
 */
module.exports = (passport) => {
  const options = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET,
  };

  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      try {
        const user = await User.findByPk(jwt_payload.id);

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        if (user.status !== 'active') {
          return done(null, false, { message: 'User account not activated' });
        }

        return done(null, user);
      } catch (err) {
        console.error('Passport JWT Strategy Error:', err);
        return done(err, false);
      }
    })
  );
};
