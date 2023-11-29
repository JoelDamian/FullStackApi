const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const cors = require('cors');

app.use(cors());

morgan.token('req-body', (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :req-body'
  )
);
app.use(express.static('build'));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
];

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  let currentDay = new Date();
  response.send(
    `<div><p>Phonebook has info for ${persons.length} people</p><p>${currentDay}</p></div>`
  );
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const body = request.body;
  let num = Math.random() * 1000;

  if (!body.name) {
    return response.status(400).json({
      error: 'name is required',
    });
  }

  let foundIndex = persons.findIndex(
    (person) => person.name.toLowerCase() === body.name.toLowerCase()
  );

  if (foundIndex !== -1) {
    return response.status(400).json({
      error: 'name must be unique',
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.round(num),
  };

  persons = persons.concat(person);

  response.json(person);
});

app.put('/api/persons/:id', (req, response) => {
  const resourceId = Number(req.params.id);
  const body = req.body;

  persons = persons.map((person) =>
    person.id === resourceId ? { ...person, ...body } : person
  );

  const foundElement = persons.find((person) => person.id === resourceId);

  response.json(foundElement);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
