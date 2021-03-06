import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import jwt from 'jsonwebtoken';
import { User } from '../connectors';

require("dotenv").config();

var fbId;

const PORT = 8081;
const HOST = `://${process.env.C9_HOSTNAME}`;
const jwtSecret = process.env.JWT_SECRET;

const fbStratedy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: `https${HOST}:${PORT}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'picture', 'email']
  },
  (accessToken, refreshToken, profile, cb) => {
    let fbName = profile.displayName.split(' ')[0];
    fbId = profile.id;
    let fbEmail = profile.emails[0].value;
    let fbPic = profile.photos[0].value;
    
    User.findByFbId(fbId, (err, user) => {
        if(err){return console.log(err.message)}
        if(!user){
            
            
            let newToken = jwt.sign({ 
                email: fbEmail, 
                username: fbName, 
                fbId: fbId, 
                profilePic: fbPic}, jwtSecret, { expiresIn: '24h' });
            
            let newUser = new User({ 
                username: fbName, 
                email: fbEmail, 
                profilePic: fbPic, 
                fbId: fbId, 
                jwt: newToken });
                
            newUser.save()
            .then( () => console.log('new user saved'))
        }
        else if(user){
            let newToken = jwt.sign({ 
                email: user.email, 
                username: user.username, 
                id: user._id, 
                profilePic: user.profilePic}, jwtSecret, { expiresIn: '24h' });
                
            user.jwt = newToken;
            
            user.save()
            .then( () => console.log('existing fb user gets new jwt'))
        }
    })
    //console.log(accessToken);
    //console.log(refreshToken);
    cb(null, {});
    }
  );
  
const fbScope = passport.authenticate('facebook', { scope: ['email']});

const fbCallback = passport.authenticate('facebook', { failureRedirect: `https${HOST}/signup`, session: false });

const fbRedirect = (req, res) => {
  res.redirect(`https${HOST}/oauth/${fbId}`);
  };

export { fbStratedy, fbScope, fbCallback, fbRedirect };
