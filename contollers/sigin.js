const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("Incorrect form submission");
  }
  db.select('hash', 'email').from('login').where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      console.log(isValid);
      if (isValid) {
        db.select().from('users').where('email', '=', data[0].email)
          .then(user => {
            res.json(user[0]);
            console.log(user[0]);
          })
          .catch(err => res.status(400).json("Unable to get user"))
      } else {
        res.json("Either email or password is incorrect");
      }
    })
    .catch(err => res.status(400).json("Either email or password is incorrect"));
}

module.exports = {
  handleSignin: handleSignin
}