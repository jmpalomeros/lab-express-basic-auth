const router = require("express").Router();


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const authRoutes = require("./auth.js")
router.use("/auth", authRoutes)

const profileRoutes = require ("./profile.js")
router.use("/profile", profileRoutes)

module.exports = router;
