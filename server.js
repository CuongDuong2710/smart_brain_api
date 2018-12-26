const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
var knex = require('knex')

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

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

app.get('/', (req, res) => {
  db.select().table('users')
    .then(data => {
      res.json(data)
    })
    .catch(console.log)
})

app.post('/signin', signin.handleSignIn(db, bcrypt))
// (property) handleSignIn: (db: any, bcrypt: any) => (req: any, res: any) => void

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) })

app.put('/image', (req, res) => { image.handleImage(req, res, db) })

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

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