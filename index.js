const express = require('express');

const server = express();

server.use(express.json());

// Criando as rotas

const projects = [];

function CheckId(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);

  if (!project) {
    return res.status(400).json({ erro: 'Project not found' });
  }

  return next();
}

let numberOfRequest = 0;

function logRequest(req, res, next) {
  numberOfRequest++;
  console.log(`Número de requisições: ${numberOfRequest}`);

  next();
}

server.use(logRequest);

server.post('/projects', logRequest, (req, res) => {
  const { id, title } = req.body; // Quebra a requisição e salva nas variáveis

  // Gera um objeto project com os dados
  const project = {
    id,
    title,
    tasks: []
  };

  // faz um push no array

  projects.push(project);

  return res.json(project);
});

server.get('/projects', logRequest, (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', CheckId, logRequest, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  // Salvo na variável toda linha do array que possui o id que quero, assim posso acessar qualquer tag
  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.json(projects);
});

server.delete('/projects/:id', CheckId, logRequest, (req, res) => {
  const { id } = req.params;
  // Busco o número do index da linha que preciso
  const project = projects.findIndex(p => p.id === id);

  projects.splice(project, 1);

  return res.json(projects);
});

server.post('/projects/:id/tasks', CheckId, logRequest, (req, res) => {
  const { id } = req.params; // Quebra a requisição e salva nas variáveis
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
