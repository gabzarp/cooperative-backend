const logger = require('koa-logger');
const Koa = require('koa');
const _ = require('koa-route');
const bodyParser = require('koa-bodyparser')
const mysql = require('mysql');
const app = new Koa();

app.use(bodyParser());

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'cooperative'
})
connection.connect();

app.use(async (ctx, next) => {
    try {
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
    createUser: (ctx) => {
        let user = ctx.request.body;
        console.log(user)
        connection.query('INSERT INTO user(name, email, password) VALUES("' + user.name + '", "' + user.email + '", "' + user.password + '");');
        ctx.status = 200;
        ctx.body = user;
    }
}
app.use(_.post('/user', user.createUser))

app.listen(3000);