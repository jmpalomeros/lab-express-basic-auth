const router = require("express").Router();

const User = require("../models/User.model");

const bcrypt = require("bcrypt");

//ruta para randerizar registro

router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

//ruta para registrarse

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/signup.hbs", {
      errorMessage: "Rellena todos los campos",
    });
    return;
  }
  //validar la contraseña solicitando mayusculas, numero y signo
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  if (passwordRegex.test(password) === false) {
    res.render("auth/signup.hbs", {
      errorMessage: "La contraseña debe cumplir con lo exigido",
    });
    return; //para detener la ejecucion
  }

  try {
    //compruebo el nombre de usuario introducido
    const foundUser = await User.findOne({ username: username });
    if (foundUser !== null) {
      res.render("auth/signup.hbs", {
        errorMessage: "Usuario ya registrado",
      });
      return;
    }
    //cifro la contraseña que introduzca

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    //creo el perfil del usuario con la contraseña cifrada

    let newUser = {
      username: username,
      password: hashPassword,
    };
    await User.create(newUser);

    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
