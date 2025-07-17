import session from "express-session";
import { prisma } from "../db/index.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { SESSION_SECRET, NODE_ENV } from "./env.js";

//generate cookies
export const sessionMid = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000,
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
});

/**1. User signs in (or first visits)
Express-session creates a random session ID (like "abc123xyz").

This session ID is stored server-side in your session store (memory, Postgres, Redis, whatever).

Express then creates a cookie that contains this session ID.

It uses your secret to create a signature for this cookie, making sure it can’t be tampered with.

The cookie looks something like this:

ini
Copy
Edit
connect.sid=s%3Aabc123xyz.3fg8g7r4erw...signature
(s: means signed, then sessionID, then the signature)

The cookie is sent to the browser and stored there. */

/**
 * The big picture:
The server takes the session ID string (like "abc123xyz").

It uses your secret (a long random string) as a key to generate a cryptographic hash of the session ID.

That hash = the signature.

The signature is appended to the cookie, so later the server can check if the cookie’s legit by recomputing the hash and comparing it.

What’s the tech behind it?
Usually, express-session uses HMAC (Hash-based Message Authentication Code) — a super solid cryptographic algorithm.

HMAC uses two inputs:

The message (your session ID)

The secret key (your secret string)

It outputs a fixed-length hash string, like a fingerprint.

Simple analogy:
js
Copy
Edit
signature = HMAC_SHA256(secret, sessionID)
secret is the key only your server knows.

sessionID is the data you want to protect.

The output is a signature that’s practically impossible to fake without the secret.
 */
