import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;
const Schema = mongoose.Schema;
let User;

const UserSchema = new Schema({
   id: {
       type: String,
       unique: true
   },
   username: {
       type: String,
       unique: true,
       trim: true,
       lowercase: true
   },
   email: {
       type: String,
       unique: true,
       trim: true,
       lowercase: true
   },
   password: {
       type: String
   },
   createdOn: {
       type: Date,
       default: Date.now()
   }
});

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

//instance methods
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

//static methods
UserSchema.static("findByUsername", function(username, cb){
    User.findOne({username: username}, cb)
});

UserSchema.static("attemptLogin", function(username, password, cb){
  User.findByUsername(username, function(err, user){
    if (err) { return cb(err); }

    if (!user){
      return cb();
    }

    user.comparePassword(password, function(err, isMatch){
      if (err) { return cb(err); }

      if (isMatch){ 
        return cb(null, user);
      } else {
        return cb();
      }

    });

  });
});

User = mongoose.model('User', UserSchema);

export default UserSchema;