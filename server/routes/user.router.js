const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');


const router = express.Router();

// If the request came from an authenticated user, this route
// sends back an object containing that user's information.
// Otherwise, it sends back an empty object to indicate there
// is not an active session.
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.send({});
  }
});

//Get request for UserList - Feb9 6pm
router.get('/all', (req, res) => {
  console.log ("WTF");
  // Get all of the users from the database
  const sqlText = `SELECT * FROM "user"`;
  pool.query(sqlText)
      .then((result) => {
        console.log(result.rows);
          res.send(result.rows);
      })
      .catch((error) => {
          console.log(`Error making database query ${sqlText}`, error);
          res.sendStatus(500);
      });
});
//end of the get for UserList

// Handles the logic for creating a new user. The one extra wrinkle here is
// that we hash the password before inserting it into the database.
router.post('/register', (req, res, next) => {
  console.log("dude!");
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const login_email = req.body.login_email;
  const hashedPassword = encryptLib.encryptPassword(req.body.password);

  console.log(firstname, lastname, login_email, hashedPassword);

  const sqlText = `
    INSERT INTO "user"
      ("first_name", "last_name", "login_email", "password", "user_is_admin")
      VALUES
      ($1, $2, $3, $4, $5);
  `;
  const sqlValues = [firstname, lastname, login_email, hashedPassword, 'FALSE'];

  pool.query(sqlText, sqlValues)
    .then((result) => {
      // Get the user we just created to log them in
      pool.query('SELECT * FROM "user" WHERE login_email = $1', [login_email])
        .then(userResult => {
          if (userResult.rows.length === 0) {
            throw new Error('User not found after creation');
          }
          const user = userResult.rows[0];

          // Log them in (create session)
          req.login(user, (err) => {
            if (err) {
              res.sendStatus(500);
              return;
            }
            res.sendStatus(201);
          });
        })
        .catch(err => {
          console.log('Error getting user after creation:', err);
          res.sendStatus(500);
        });
    })
    .catch((dbErr) => {
      console.log('POST /api/user/register error: ', dbErr);
      res.sendStatus(500);
    });
});

// Handles the logic for logging in a user. When this route receives
// a request, it runs a middleware function that leverages the Passport
// library to instantiate a session if the request body's username and
// password are correct.
  // You can find this middleware function in /server/strategies/user.strategy.js.
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// Clear all server session information about this user:
router.post('/logout', (req, res, next) => {
  // Use passport's built-in method to log out the user.
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(200);
  });
});


module.exports = router;


module.exports = router;
