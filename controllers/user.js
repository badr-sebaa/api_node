const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        type: req.body.type,
        // createdAt: req.body.createdAt,
        // updatedAt: req.body.updatedAt,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error}));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((User) => {
      if (!User) {
        res
          .status(401)
          .json({ error: "Utilisateur ou Mot de passe incorrect !" });
      }
      bcrypt
        .compare(req.body.password, User.password)
        .then((valid) => {
          if (!valid) {
            res
              .status(401)
              .json({ error: "Utilisateur ou Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: User._id,
            Token: jwt.sign({ userId: User._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.update = (req, res, next) => {
    // if password is not empty, modify it
    if (req.body.password) {
        bcrypt
            .hash(req.body.password, 10)
            .then(hash => {
                User.findByIdAndUpdate(
                    { _id: req.params.userId },
                    {
                        ...req.body,
                        password: hash,
                    },
                    // Return the new user
                    { new: true }
                )
                    .then(user => {
                        res.status(201).json({ status: "ok", message: "Utilisateur modifié !", data: user });
                    })

                    .catch(error => res.status(500).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        // if password is empty, don't modify it
        // Update the user in the database
        // { new: true } returns the updated user
        User.findByIdAndUpdate({ _id: req.params.userId }, { ...req.body }, { new: true })
            .then(user => {
                res.status(201).json({ status: "ok", message: "Utilisateur modifié !", data: user });
            })
            .catch(error => res.status(500).json({ error }));
    }
};

exports.getUsersList = (req, res, next) => {
    usersList = [];
    User.find()
        .then(users => {
          users.forEach(user => {
            usersList.push(user.lastname);
            usersList.push(user.firtname);
          });
            res.status(200).json({ status: "ok", message: "Liste des utilisateurs", data: usersList });
        })
        .catch(error => res.status(500).json({ error }));
};
