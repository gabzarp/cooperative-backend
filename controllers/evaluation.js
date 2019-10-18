const pool = require('../db');
const evaluation = {
    createEvaluation: async (ctx) =>{
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
            return connection.query( "START TRANSACTION; INSERT INTO evaluation (evaluation,date) VALUE (?,?)", [ctx.request.body.evaluation, ctx.request.body.date]);
        })
        .then((results)=>{
            connection.query("INSERT INTO MEMBER_EVALUATION (id_member, id_evaluation) VALUE (?,?); COMMIT", [ctx.params.id, results[1].insertId ]);
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
    getEvaluationById: async (ctx) =>{
        await pool
        .then((p)=>{
            return p.query("SELECT * from evaluation inner join member_evaluation ON member_evaluation.id_evaluation = evaluation.id where evaluation.id = ? ;", [ctx.params.id])
        })
        .then((results)=>{
            ctx.body = results[0];
            ctx.status = 200;
        })
        .catch(err =>{ctx.body = 'error: ' + err; ctx.status = 500;})
    },
    updateEvaluation: async (ctx) => {
        await pool.then((p)=>{
            return p.query("UPDATE evaluation INNER JOIN member ON user.id = member.user_id set member.portfolio = ?, where user_id = ?;", [ctx.request.body.name,ctx.request.body.email,ctx.request.body.cpf,ctx.request.body.approved,ctx.request.body.behavorial,ctx.request.body.portfolio,ctx.params.id])
        })
        .then(()=>{
            ctx.body = ctx.request.body;
            ctx.status = 200;
        })
        .catch(err =>{ctx.body = 'error: ' + err; ctx.status = 500;})
    },
    deleteUser: async (ctx) => {
        await pool.then((p)=>{
            return query("UPDATE evaluation evaluation.active = 0 where evaluation.id = ?", [[ctx.params.id]])
        })
        .then(()=>{
            ctx.body = "Evaluation deleted"
            ctx.status = 200;
        })
        .catch(err =>{ctx.body = 'error: ' + err; ctx.status = 500;})
    }
}
module.exports = evaluation;