const { Strategy } = require("passport-jwt");
const { ExtractJwt } = require("passport-jwt");

const User = require("../models/userSchema");
const { JWT_KEY } = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = JWT_KEY;
//opts.issuer = "accounts.examplesoft.com";
//opts.audience = "yoursite.net";

module.exports = passport => {
  passport.use(
    new Strategy(opts, function(jwt_payload, done) {
      //console.log(jwt_payload);
      return User.findOne({ _id: jwt_payload.currentUser._id }, function(
        err,
        user
      ) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
          // or you could create a new account
        }
      });
    })
  );
};
