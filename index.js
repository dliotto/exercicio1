const express = require ('express');

//servidor
const server = express();

//retorna as informações em JSON
server.use(express.json());

const projetos = [];
let numeroRequisicoes = 0;

//middleware global, que faz a contagem de quantas requisições são chamadas no projeto
server.use((req, res, next) => {
    numeroRequisicoes = numeroRequisicoes + 1;

    console.log("Número requisições = " + numeroRequisicoes);
    
    return next();
});


function verificaIdExiste( req, res, next ){
    const { id } = req.params;
    const projeto = projetos.find(p => p.id == id);

    if( !projeto ){
        return res.status(400).json({error : `Projeto com o ID: ${id} informado não encontrado!`});
    }

    return next();
}


//grava um novo projeto
server.post('/projetos', (req, res) => {

    const { id, titulo } = req.body;   
    const projeto = {
        id,
        titulo,
        tasks : []
    }

    projetos.push(projeto);

    return res.json(projetos);

});

//retorna todos os projetos
server.get('/projetos', (req, res) => {
    return res.json(projetos);
});

//altera um projeto com o ID específico
server.put('/projetos/:id', verificaIdExiste, (req, res) =>{

    const { titulo } = req.body;
    const { id } = req.params;
    const projeto = projetos.find(p => p.id == id);

    projeto.titulo = titulo;

    return res.json(projeto);
});

//deleta um projeto com o ID específico 
server.delete('/projetos/:id', verificaIdExiste, (req, res) => {
    const { id } = req.params;

    const projetoIndice = projetos.findIndex(p => p.id == id);

    projetos.splice(projetoIndice, 1);

    return res.send();
});


//altera a task de determinado projeto
server.post('/projetos/:id/tasks', verificaIdExiste, (req, res) => {
    const { id } = req.params;
    const { titulo } = req.body;  
    const projeto = projetos.find(p => p.id == id);

    projeto.tasks.push(titulo);

    return res.json(projetos);

});



//porta do servidor
server.listen(3000);