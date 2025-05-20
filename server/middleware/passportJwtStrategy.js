// server/middleware/passportJwtStrategy.js

const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User'); // ✅ Import User model directly
const dotenv = require('dotenv');

dotenv.config();

module.exports = (passport) => {
  const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies.token;  // Extract JWT from cookie named 'token'
    }
    return token;
  };

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
        console.error('Passport JWT error:', err);
        return done(err, false);
      }
    })
  );
};
