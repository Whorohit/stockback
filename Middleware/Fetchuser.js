const jwt = require('jsonwebtoken');
const tokenkey="mynamrisrohit"
const fetchuser = (req, res, next) => {
   // Get the user from the jwt token and add id to req object
   const id = req.header('id');
   if (!id) {
      return  res.status(200).send({ error: "Please authenticate using a valid token",success:false })
   }
  try {
   
   const data = jwt.verify(id, tokenkey)
   //    req.user = id
      req.user = data.user.id
      next();
  } catch (error) {
   res.status(200).send({ error: "Please authenticate using a valid token",success:false  })
  }
      
   
   
   
      
//    } catch (error) {
//        res.status(401).send({ error: "Please authenticate using a valid token" })
//    }

}
module.exports = fetchuser