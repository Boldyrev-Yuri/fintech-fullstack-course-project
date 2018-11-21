import { Strategy as JWTStrategy, ExtractJwt as ExtractJWT } from 'passport-jwt';
import mongoose from 'mongoose';
const User = mongoose.model('Users');
const opts = {};

opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';

export default passportUser => {
  passportUser.use(new JWTStrategy(opts, (jwtPayload, done) => {
    User.findById(jwtPayload.id)
      .then(user => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch(err => console.error(err));
  }));
};
