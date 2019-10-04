const logger = require('koa-logger');
const Koa = require('koa');
const Router = require('koa-router');
const bcrypt = require('bcrypt');
const bodyParser = require('koa-bodyparser');
const pool = require('./db');
const app = new Koa();

const router = new Router();

app.use(bodyParser());


app.use(logger());


const user = {
    createUser: async (ctx) =>{
        await bcrypt.hash(ctx.request.body.password, 10)
        .then(async (hash)=>{
            await pool.query( "INSERT INTO USER (name,email,password) VALUE (?,?,?)", [ctx.request.body.name, ctx.request.body.email, hash])
            .then(()=>{
                ctx.status = 200;
                ctx.body = ctx.request.body;
            })
        })
        .catch(err =>{ctx.body = 'error: ' + err; ctx.status = 500;})
    },
    login: async (ctx) =>{
        await pool.query("SELECT password FROM user where email = ?", [ctx.request.body.email])
        .then(async (results)=>{
            await bcrypt.compare(ctx.request.body.password, results[0].password)
            .then(res=>{
                console.log(res)
                ctx.body = res;
                ctx.status = 200;
            })
        })
        .catch(err =>{ctx.body = 'error: ' + err; ctx.status = 500;})
    }
}
router.post('/user',  user.createUser)
      .get('/user', user.login);

app.use(router.routes());

app.listen(3000);