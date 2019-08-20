const logger = require('koa-logger');
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser')
const mongo = require('koa-mongo')
const app = new Koa();

const router = new Router();

app.use(mongo())

app.use(bodyParser());

app.use(async (ctx, next) => {
    try {
        ctx.db === ctx.mongo.db('cooperative');
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = err.message;
        ctx.app.emit('error', err, ctx);
    }
});

app.on('error', (err, ctx) => {
    console.log(err)
});

app.use(logger());


const user = {
    getAllUsers: async (ctx) => {
        const result = await ctx.db.collection('user').find().toArray()
        ctx.body = result;
        ctx.status = 200;
    },
    createUser: (ctx) =>{
        console.log(ctx.request.body)
        const result = ctx.db.collection('user').insertOne(ctx.request.body);
        ctx.body = result;
        ctx.status = 200;
    }
}
router.get('/user', user.getAllUsers)
      .post('/user', user.createUser);

app.use(router.routes());

app.listen(3000);