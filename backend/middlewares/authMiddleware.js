const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decryptedToken = jwt.verify(token, process.env.jwt_secret);
    //comparing the decrypted Id with the userId
    req.body.userId = decryptedToken.userId;
    next();
  } catch (error) {
    console.log("error"+error)
    res.send({
      success: false,
      message: error.message,
     
    });
  }
};
