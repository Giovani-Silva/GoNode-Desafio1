const express = require('express');
const nunjucks = require('nunjucks');

const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true
});

app.set('view engine', 'njk');

app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: false
  })
)

const checkParams = (req, res, next) => {
  if (!req.query.age) return res.redirect('/');
  return next();
}

const MinorMajor = (req, res, next) => {
  const view = req.query.age >= 18 ? '/major' : '/minor';

  if (view !== req.path) return res.redirect(`${view}?age=${req.query.age}`);

  return next();
};

const checkAge = age => {
  if (-age && age > 0) {
    return age;
  }
  return false;
};

app.get('/', (req, res) => {
  res.render('main');
});

app.get('/major', checkParams, MinorMajor, (req, res) => {
  res.render('major', {
    age: req.query.age
  });
});


app.get('/minor', checkParams, MinorMajor, (req, res) => {
  res.render('minor', {
    age: req.query.age
  });
});

app.post('/check', (req, res) => {
  const age = checkAge(req.body.age);
  if (age) {
    const view = age > 18 ? '/major' : '/minor';
    return res.redirect(`${view}?age=${age}`);
  }
  return res.redirect('/');
});

app.listen(3000);
