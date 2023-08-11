const handleRegister = (req, res, db, bcrypt) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json("Incorrect form submission");
  }
  const hash = bcrypt.hashSync(password);
  db.transaction(txn => {
    txn
      .insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        txn('users')
          .returning('*')
          .insert({
            name: name,
            email: loginEmail[0].email,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          })
      })    
      .then(txn.commit)
      .catch(txn.rollback)
  })
  .catch(err => res.status(400).json(`Unable to register. Error: ${err}`));
  
}

module.exports = {
  handleRegister: handleRegister
}