const router = require("express").Router();
const User = require("../models/User.model");
const {isLoggedIn } = require("../middlewares/auth.middlewares");

router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const userDetails = await User.findById(req.session.userConnected._id);
    res.render("profile.hbs", {
      userDetails,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
