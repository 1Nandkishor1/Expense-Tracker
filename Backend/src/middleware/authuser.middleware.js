let redis=require('../config/redis.connnection');
let jwt=require('jsonwebtoken');
let bcrypt=require('bcryptjs');


async function authUser(req, res, next) {
  
  let authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token Not Provided' })
  }

  
  let token = authHeader.split(' ')[1]

  let isTokenBlacklisted = await redis.get(token)
  if (isTokenBlacklisted) {
    return res.status(401).json({ message: 'Invalid Token' })
  }

  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid Token' })
  }
}

module.exports={authUser}