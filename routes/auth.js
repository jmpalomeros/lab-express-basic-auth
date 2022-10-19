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
  //asi valido la contraseña exigiendo los caracteres de Regex
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  if (passwordRegex.test(password) === false) {
    res.render("auth/signup.hbs", {
      errorMessage: "La contraseña debe cumplir con lo exigido",
    });
    return;
  }

  try {
    //con esto compruebo el nombre de usuario introducido
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

//ruta para login

router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
//validacion de backedn
  if (username === "" || password === "") {
    res.render("auth/login.hbs", {
      errorMessage: "Debes introducir la contraseña para acceder",
    });
    return;
  }
//verifico username
  try {
    const foundUser = await User.findOne({ username: username });

    if (foundUser === null) {
      res.render("auth/login.hbs", {
        errorMessage: "Datos incorrectos",
      });
    }

    const passwordOk = await bcrypt.compare(password, foundUser.password);

    if (passwordOk === false) {
      res.render("auth/login.hbs", {
        errorMessage: "Contraseña incorrecta",
      });
      return;
    }
//redirijo a perfil tras acceso
    req.session.userConnected = foundUser;
    req.session.save(()=>{
        res.redirect("/main")
    })


  } catch (err) {
    next(err);
  }

});

//cierro
router.get("/logout", (req, res, next) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });

module.exports = router;
