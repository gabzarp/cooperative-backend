const logger = require('koa-logger');
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const {user, hirer, member} = require('./controllers/user');
const competency = require('./controllers/competency');
const app = new Koa();

const router = new Router();

app.use(bodyParser());

app.use(logger());

router.get('/login', user.login)
      .delete('/user:id', user.deleteUser)

      .post('/member',  member.createMember)
      .get('/member/:id', member.getMemberById)
      .put('/member', member.updateMember)

      .post('/hirer',  hirer.createHirer)
      .get('/hirer/:id', hirer.getHirerById)
      .put('/hirer', hirer.updateHirer)

      .post('/competency/:id', competency.createCompetency);

app.use(router.routes());

app.listen(3000);