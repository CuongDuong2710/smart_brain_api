const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
var knex = require('knex')

const app = express()

app.use(cors())
app.use(bodyParser.json())

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'root',
    database : 'smart_brain'
  }
});

console.log(
  db.select().table('users')
    .then(data => {
      // console.log(data)
    })
    .catch(console.log)
)

const database = {
  users:
  [
    {
      id: 123,
      name: 'John',
      email: 'john@gmail.com',
      password: 'root',
      entries: 0,
      joined: new Date()
    },
    {
      id: 124,
      name: 'James',
      email: 'james@gmail.com',
      password: 'root',
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: 'john@gmail.com'
    }
  ]
}

app.get('/', (req, res) => {
  db.select().table('users')
    .then(data => {
      res.json(data)
    })
    .catch(console.log)
})

app.post('/signin', (req, res) => {
  const { email, password } = req.body

  db.select('email', 'hash')
    .from('login')
    .where({
      email
    })
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash)
        if (isValid) {
          return db.select('*')
            .from('users')
            .where({
              email
            })
            .then(user => {
              res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else {
          res.status(400).json('wrong credentials')
        }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body

  const hash = bcrypt.hashSync(password);

  db.transaction(trx => {
    trx.insert({
      hash,
      email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
        .returning('*')
        .insert({
          name,
          email: loginEmail[0],
          joined: new Date()
        })
        .then(user => {
          res.json(user[0])
        })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .catch(err => res.status(400).json('unable register'))
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params
  db.select('*')
    .from('users')
    .where({ id })
    .then(user => {
      if (user.length)
        res.json(user[0])
      else
        throw new Error('Could not find that user')
    })
    .catch(err => res.status(400).json(err.message))
})

app.put('/image', (req, res) => {
  const { id } = req.body

  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0])
    })
    .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3000, () => {
  console.log('app is running on port 3000')
})

/* register and then get list, we have three users
{
    "id": 125,
    "name": "Anne",
    "email": "anne@gmail.com",
    "password": "root",
    "entries": 0,
    "joined": "2018-12-07T07:37:15.535Z"
}
 */


/* {
	"email": "anne@gmail.com",
	"password": "apples"
} */