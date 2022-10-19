const router = require("express").Router();


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const authRoutes = require("./auth.js")
router.use("/auth", authRoutes)

const mainRoutes = require ("./main.js")
router.use("/main", mainRoutes)

module.exports = router;
