const bcrypt = require('bcrypt');
const pool = require('../db');

const user = {
    login: async (ctx) =>{
        await pool
        .then((p)=>{
            return p.query("SELECT password FROM user where email = ? and active = 1", [ctx.request.body.email])
        })
        .then((results)=>{
            return bcrypt.compare(ctx.request.body.password, results[0].password);
        })
        .then(res=>{
                ctx.body = res;
                ctx.status = 200;
            })
        .catch(err =>{ctx.body = 'error: ' + err; ctx.status = 500;})
    },
    deleteUser: async (ctx) => {
        await pool.then((p)=>{
            return p.query("UPDATE user set user.active = 0 where user.id = ?", [[ctx.params.id]])
        })
        .then(()=>{
            ctx.body = "User deleted"
            ctx.status = 200;
        })
        .catch(err =>{ctx.body = 'error: ' + err; ctx.status = 500;})
    }
}
const member = {
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
    getMemberById: async (ctx) =>{
        await pool
        .then((p)=>{
            return p.query("SELECT user.name, user.email, member.cpf, member.approved, member.behavorial, member.portfolio from user inner join member ON member.user_id = user.id where user.id = ? ;", [ctx.params.id])
        })
        .then((results)=>{
            ctx.body = results[0];
            ctx.status = 200;
        })
        .catch(err =>{ctx.body = 'error: ' + err; ctx.status = 500;})
    },
    updateMember: async (ctx) => {
        await pool.then((p)=>{
            return p.query("UPDATE user INNER JOIN member ON user.id = member.user_id set user.name = ? user.email = ?, member.cpf = ?, member.approved = ?, member.behavorial = ?, member.portfolio = ?, where user_id = ?;", [ctx.request.body.name,ctx.request.body.email,ctx.request.body.cpf,ctx.request.body.approved,ctx.request.body.behavorial,ctx.request.body.portfolio,ctx.params.id])
        })
        .then(()=>{
            ctx.body = ctx.request.body;
            ctx.status = 200;
        })
        .catch(err =>{ctx.body = 'error: ' + err; ctx.status = 500;})
    }
}
const hirer = {
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
    getHirerById: async (ctx) =>{
        await pool
        .then((p)=>{
            return p.query("SELECT user.name, user.email, member.cpf, member.approved, member.behavorial, member.portfolio from user inner join member ON member.user_id = user.id where user.id = ? ;", [ctx.params.id])
        })
        .then((results)=>{
            ctx.body = results[0];
            ctx.status = 200;
        })
        .catch(err =>{ctx.body = 'error: ' + err; ctx.status = 500;})
    },
    updateHirer: async (ctx) => {
        await pool.then((p)=>{
            return query("UPDATE user INNER JOIN hirer ON user.id = hirer.user_id set user.name ? user.email = ?, hirer.cnpj = ?", [ctx.request.body.name,ctx.request.body.email,ctx.request.body.cnpj,ctx.params.id])
        })
        .then(()=>{
            ctx.body = ctx.request.body;
            ctx.status = 200;
        })
        .catch(err =>{ctx.body = 'error: ' + err; ctx.status = 500;})
    }
}
    
exports.user = user;
exports.hirer = hirer;
exports.member = member;