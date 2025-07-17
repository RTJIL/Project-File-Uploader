import passport from 'passport'
import LocalStrategy from 'passport-local'
import queries from '../models/queries.js'
import bcrypt from 'bcrypt'

//todo

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      console.log(
        `Values passed from form to local: username ${username}, password: ${password}`
      )
      console.log('----')

      const user = await queries.findUnique("user", { username })

      if (!user) return done(null, false, { message: 'User not found' })

      const passMatch = await bcrypt.compare(password, user.password)

      if (!passMatch)
        return done(null, false, { message: 'Incorrect password.' })

      return done(null, user)
    } catch (err) {
      console.error('⛔ Fail to query/bcrypt: ', err)
      done(err)
    }
  })
)

passport.serializeUser((user, done) => {
  return done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  const user = await queries.findUnique("user", { id })
  return done(null, user)
})

export default passport
/**
 * import the passport instance (a singleton).
 * call config methods on it (use, serializeUser, etc).
 * export the same instance after configuring it — not the results.
 */

/** add custom names
 * {
      usernameField: 'unam', // 👈 this is your custom input name
      passwordField: 'pass', // 👈 same here
    },
 */

/** mannualy log in, this function fires when done(null, user)
 * req.login(user, (err) => {
 *   if (err) return next(err);
 *   res.redirect('/dashboard');
 * });
 */
