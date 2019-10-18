const pool = require('../db');

const competency = {
    createCompetency: async (ctx) =>{
        await pool
        .then((p)=>{
            return  p.getConnection()   
        })
        .then((connection)=>{
            return connection.query("START TRANSACTION;INSERT INTO COMPETENCY (name,hours) VALUE (?,?)", [ctx.request.body.name, ctx.request.body.hours])
        })
        .then((results)=>{
            return connection.query("INSERT INTO MEMBER_COMPETENCY (ID_MEMBER, ID_COMPETENCY) VALUE (?,?); COMMIT;", [ctx.params.id, results[1].insertId])
        })
        .then(()=>{
            ctx.body = ctx.request.body;
            ctx.status = 200;
        })
        .catch(err =>{
            connection.query("ROLLBACK"); 
            connection.release(); 
            ctx.body = 'error: ' + err;
            ctx.status = 500;})
    },
    deleteCompetency: async (ctx) => {
        await pool.then((p)=>{
            return p.query("UPDATE competency competency.active = 0 where user.id = ?", [[ctx.params.id]])
        })
        .then(()=>{
            ctx.body = "Competency deleted"
            ctx.status = 200;
        })
        .catch(err =>{ctx.body = 'error: ' + err; ctx.status = 500;})
    },
    getUserCompetencies: async () => {
        await pool.then((p)=>{
            return p.query("select name hours from competency inner join")
        })
    }
}
module.exports = competency;