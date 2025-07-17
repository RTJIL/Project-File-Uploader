import session from 'express-session'
import { SESSION_SECRET, NODE_ENV } from './env.js'

//generate cookies
export const sessionMid = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7, 
  },
})
