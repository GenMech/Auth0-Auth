const express = require("express");
const app = express();
require("dotenv").config();
const { auth, requiresAuth } = require("express-openid-connect");

app.set("trust proxy", true);

const config = {
  authRequired: false, // we dont want that every single route required authentication
  auth0Logout: true, //
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  secret: process.env.SECRET,
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

// profile route
app.get("/profile", requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});
// requiresAuth() middleware that requires user to be logged in

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
