const express = require('express')
const bodyParser = require('body-parser')

const app = express()

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
  ]
}

app.get('/', (req, res) => {
  res.json(database.users)
})

app.post('/signin', (req, res) => {
  if (req.body.email === database.users[0].email &&
      req.body.password === database.users[0].password) {
        res.json('success')
    } else {
        res.status(400).json('error logging in')
    }
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body
  database.users.push(
    {
      id: 125,
      name,
      email,
      password,
      entries: 0,
      joined: new Date()
    }
  )
  res.json(database.users[database.users.length-1])
})

app.listen(3000, () => {
  console.log('app is running on port 3000')
})

/* 
/ --> res = this is working
/signIn --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user

*/

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