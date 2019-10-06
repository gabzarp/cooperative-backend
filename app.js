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
    createMember: async (ctx) =>{
        await bcrypt.hash(ctx.request.body.password, 10)
        .then(async (hash)=>{
            h = hash;
            return await pool;
        })
        .then(function(p){   
            return  p.getConnection()   
        })
        .then(async conn =>{
            connection = conn;
            return await connection.query( "START TRANSACTION; INSERT INTO USER (name,email,password) VALUE (?,?,?)", [ctx.request.body.name, ctx.request.body.email, h]);
        })
        .then(async (results)=>{
            await connection.query("INSERT INTO MEMBER (cpf, user_id) VALUE (?,?); COMMIT", [ctx.request.body.cpf, results[1].insertId ]);
            await connection.release();
            ctx.status = 200;
            ctx.body = ctx.request.body;
        })
        .catch(async (err)=>{
            connection.query("ROLLBACK"); 
            connection.release(); 
            ctx.body = 'error: ' + err; 
            ctx.status = 500; 
        })        
    },
    createHirer: async (ctx) =>{
        await bcrypt.hash(ctx.request.body.password, 10)
        .then(async (hash)=>{
            h = hash;
            return await pool;
        })
        .then(function(p){   
            return  p.getConnection()   
        })
        .then(async conn =>{
            connection = conn;
            return await connection.query( "START TRANSACTION; INSERT INTO USER (name,email,password) VALUE (?,?,?)", [ctx.request.body.name, ctx.request.body.email, h]);
        })
        .then(async (results)=>{
            await connection.query("INSERT INTO HIRER (cnpj, user_id) VALUE (?,?); COMMIT", [ctx.request.body.cnpj, results[1].insertId ]);
            await connection.release();
            ctx.status = 200;
            ctx.body = ctx.request.body;
        })
        .catch(async (err)=>{
            connection.query("ROLLBACK"); 
            connection.release(); 
            ctx.body = 'error: ' + err; 
            ctx.status = 500; 
        })   
    },
    login: async (ctx) =>{
        await pool.query("SELECT password FROM user where email = ?", [ctx.request.body.email])
        .then(async (results)=>{
            return await bcrypt.compare(ctx.request.body.password, results[0].password)  
        })
        .then(res=>{
                ctx.body = res;
                ctx.status = 200;
            })
        .catch(err =>{ctx.body = 'error: ' + err; ctx.status = 500;})
    }
}
router.post('/member',  user.createMember)
      .post('/hirer',  user.createHirer)
      .get('/user', user.login);

app.use(router.routes());

app.listen(3000);