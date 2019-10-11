const bcrypt = require('bcrypt');
const pool = require('../db');

const user = {
    createMember: async (ctx) =>{
        await bcrypt.hash(ctx.request.body.password, 10)
        .then((hash)=>{
            h = hash;
            return pool;
        })
        .then(function(p){   
            return  p.getConnection()   
        })
        .then(conn =>{
            connection = conn;
            return connection.query( "START TRANSACTION; INSERT INTO USER (name,email,password) VALUE (?,?,?)", [ctx.request.body.name, ctx.request.body.email, h]);
        })
        .then((results)=>{
            connection.query("INSERT INTO MEMBER (cpf, user_id) VALUE (?,?); COMMIT", [ctx.request.body.cpf, results[1].insertId ]);
            connection.release();
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
        .then((hash)=>{
            h = hash;
            return pool;
        })
        .then(function(p){   
            return  p.getConnection()   
        })
        .then(conn =>{
            connection = conn;
            return connection.query( "START TRANSACTION; INSERT INTO USER (name,email,password) VALUE (?,?,?)", [ctx.request.body.name, ctx.request.body.email, h]);
        })
        .then((results)=>{
            connection.query("INSERT INTO HIRER (cnpj, user_id) VALUE (?,?); COMMIT", [ctx.request.body.cnpj, results[1].insertId ]);
            connection.release();
            ctx.body = ctx.request.body;
            ctx.status = 200;
        })
        .catch((err)=>{
            connection.query("ROLLBACK"); 
            connection.release(); 
            ctx.body = 'error: ' + err; 
            ctx.status = 500; 
        })   
    },
    login: async (ctx) =>{
        await pool
        .then((p)=>{
            return p.query("SELECT password FROM user where email = ?", [ctx.request.body.email])
        })
        .then((results)=>{
            return bcrypt.compare(ctx.request.body.password, results[0].password);
        })
        .then(res=>{
                ctx.body = res;
                ctx.status = 200;
            })
        .catch(err =>{ctx.body = 'error: ' + err; ctx.status = 500;})
    }
}
module.exports = user;