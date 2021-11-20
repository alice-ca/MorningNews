const express = require('express');
const router = express.Router();

const uid2 = require('uid2');
const bcrypt = require('bcrypt');

const userModel = require('../models/users');
const articleModel = require('../models/articles');

//SIGN-UP
router.post('/sign-up', async function (req, res, next) {

  let error = [];
  let result = false;
  let saveUser = null;
  let token = null;

  const data = await userModel.findOne({
    email: req.body.emailFromFront
  })

  if (data) {
    error.push('Ce mail est déjà associé à un compte.')
  }

  if (req.body.usernameFromFront == ''
    || req.body.emailFromFront == ''
    || req.body.passwordFromFront == ''
  ) {
    error.push('Tous les champs doivent être remplis.');
  }

  if (error.length == 0) {
    const hash = bcrypt.hashSync(req.body.passwordFromFront, 10);
    const newUser = new userModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: hash,
      token: uid2(32),
      lang: 'fr',
    });

    saveUser = await newUser.save();

    if (saveUser) {
      result = true;
      token = saveUser.token;
    }
  }

  res.json({ result, saveUser, error, token })
});

//SIGN-IN
router.post('/sign-in', async function (req, res, next) {

  let result = false;
  let user = null;
  let error = [];
  let token = null;

  if (req.body.emailFromFront == ''
    || req.body.passwordFromFront == ''
  ) {
    error.push('Tous les champs doivent être remplis.');
  }

  if (error.length == 0) {
    const user = await userModel.findOne({
      email: req.body.emailFromFront
    })


    if (user) {
      if (bcrypt.compareSync(req.body.passwordFromFront, user.password)) {
        result = true;
        token = user.token;
      } else {
        result = false;
        error.push('Mot de passe incorrect.');
      }

    } else {
      error.push('E-mail incorrect.');
    }
  }

  res.json({ result, user, error, token });
})

//AJOUT D'UN ARTICLE DANS LA WISHLIST
router.post('/wishlist-article', async function (req, res, next) {
  let result = false;

  const user = await userModel.findOne({ token: req.body.token });

  if (user) {
    const newArticle = new articleModel({
      title: req.body.name,
      description: req.body.desc,
      urlToImage: req.body.img,
      content: req.body.content,
      lang: req.body.lang,
      userId: user._id,
    });

    const articleSave = await newArticle.save();

    if (articleSave.title) {
      result = true;
    }
  }

  res.json({ result });
})

//SUPPRIMER UN ARTICLE DE LA BDD
router.delete('/wishlist-article', async function (req, res, next) {
  let result = false;
  const user = await userModel.findOne({ token: req.body.token });

  if (user) {
    const returnDb = await articleModel.deleteOne({ title: req.body.title, userId: user._id });

    if (returnDb.deletedCount == 1) {
      result = true;
    }
  }

  res.json({ result });
})

//RECUPERER LA WISHLIST DE LA BDD
router.get('/wishlist-article', async function (req, res, next) {
  let articles = [];
  const user = await userModel.findOne({ token: req.query.token });

  if (user) {
    if (req.query.lang !== '') {
      articles = await articleModel.find({ userId: user._id, lang: req.query.lang });
    } else {
      articles = await articleModel.find({ userId: user._id });
    }
  }

  res.json({ articles });
})

//RECUPERER LA LANGUE DE L'USER
router.get('/user-lang', async function (req, res, next) {
  let lang = null;
  const user = await userModel.findOne({ token: req.query.token });

  if (user) {
    lang = user.lang;
  }

  res.json({ lang });
})

//CHANGER LA LANGUE DE L'USER
router.post('/user-lang', async function (req, res, next) {
  let result = false;
  const user = await userModel.updateOne({ token: req.body.token }, { lang: req.body.lang });

  if (user) {
    result = true;
  }

  res.json({ result });
})

module.exports = router;
