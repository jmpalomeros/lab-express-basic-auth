const router = require("express").Router();
const User = require("../models/User.model");
const {isLoggedIn } = require("../middlewares/auth.middlewares");

router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const userDetails = await User.findById(req.session.userConnected._id);
    res.render("main.hbs", {
      userDetails,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/private",(req,res,next)=>{
  res.render("private.hbs")
})

module.exports = router;

