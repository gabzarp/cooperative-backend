const logger = require('koa-logger');
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const user = require('./controllers/user');
const app = new Koa();

const router = new Router();

app.use(bodyParser());

app.use(logger());

router.post('/member',  user.createMember)
      .post('/hirer',  user.createHirer)
      .get('/user', user.login);

app.use(router.routes());

app.listen(3000);