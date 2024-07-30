const express = require('express')
const authRouter = express.Router()
const User = require('../models/User.js')
const jwt = require('jsonwebtoken')

authRouter.post('/signup', async (req, res, next) => {
    try {
      const existingUser = await User.findOne({ username: req.body.username.toLowerCase() })
      if(existingUser) {
          res.status(403)
          return next (new Error("That username is already taken."))
       }
       const newUser = new User(req.body)
       console.log(req.body)
       
       const savedUser = await newUser.save()
       const token = jwt.sign(savedUser.withoutPassword(), process.env.SECRET)
       return res.status(201).send({ token, user:savedUser.withoutPassword()})
       
      } catch (err) {
          res.status(500);
          return next(err)
      }
  })

  authRouter.post('/login', async (req, res, next) => {
    try {
        const user = await User.findOne( { username: req.body.username.toLowerCase() })
        
        if(!user) {
            res.status(403)
            return next (new Error("Username or password is incorrect."))
        }
        console.log('req.body.username:', req.body.username)
        const isMatch = await user.checkPassword(req.body.password)
            if(!isMatch){
                res.status(403)
                return next (new Error("Username or password is incorrect."))
        }
            
            if(!isMatch){
                res.status(403)
                return next(new Error("Username or password is incorrect."))
            }
            const token = jwt.sign(user.withoutPassword(), process.env.SECRET)
            return res.status(200).send( {token, user: user.withoutPassword()})
        
    } catch (err) {
        res.status(500)
        return next (err)
    }
})

module.exports = authRouter