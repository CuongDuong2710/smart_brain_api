const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(bodyParser.json())

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
  res.json(database.users)
})

app.post('/signin', (req, res) => {
  if (req.body.email === database.users[0].email &&
      req.body.password === database.users[0].password) {
        res.json(database.users[0])
    } else {
        res.status(400).json('error logging in')
    }
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body
  
  bcrypt.hash(password, null, null, function(err, hash) {
    console.log(hash)
  })
  database.users.push(
    {
      id: 125,
      name,
      email,
      entries: 0,
      joined: new Date()
    }
  )
  res.json(database.users[database.users.length-1])
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params
  database.users.forEach(user => {
    if (user.id === id) {
      res.json(user)
    }
  })
  res.status(400).json('no such user')
})

app.put('/image', (req, res) => {
  const { id } = req.body
  database.users.forEach(user => {
    if (user.id === id) {
      user.entries++;
      res.json(user.entries)
    }
  })
  res.status(400).json('no such user')
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