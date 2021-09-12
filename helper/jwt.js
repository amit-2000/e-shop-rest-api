const jwt = require("express-jwt");

// middleware to check whether
module.exports.authJWT = () => {
  const secret = process.env.JWT_SECRET_KEY;
  const api = process.env.API_URL;
  return jwt({
    secret,
    algorithms: ["HS256"],
    isRevoked : isRevoked
  }).unless({
    path: [
      // // Using regular expression. learn more at sackoverFlow
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/category(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      `${api}/user/login`,
      `${api}/user/register`,
    ],
  });
};

async function isRevoked(req , playload , done){
  if(!playload.isAdmin){
    done(null , true);
  }else{
    done();
  }
}

// unless <=> stackOverflow or express-unless
//Handling parameterised routes in express-jwt using unless ::=>stackOverflow
// Handling parameterised routes in express-jwt using unless <===> solution is use regex expression

// gallery-img/613c78ffd621ab220885cdc6