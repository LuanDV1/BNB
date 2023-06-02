var express = require("express");
var router = express.Router();
const clientDB = require("../database/connect.js");
const log = require("../logs/wirteLogs.js");

function validateCreate(req, res, next) {
  const { wallet_address } = req.body;
  if (wallet_address && wallet_address != "") {
    next();
  } else {
    res.status(400).json({ messager: "invalid" });
  }
}

/* CREATE users */
router.post(
  "/create",
  (req, res, next) => {
    validateCreate(req, res, next);
  },
  async (req, res, next) => {
    const { wallet_address } = req.body;
    const checkInvalidWallet = await clientDB.selectData(
      `SELECT * FROM users WHERE wallet='${wallet_address}'`
    );
    if (checkInvalidWallet.rowCount == 0) {
      log.logger.info(`SELECT * FROM users WHERE wallet='${wallet_address}'`)
      const insertData = await clientDB.insertData(
        `INSERT INTO users (wallet) VALUES ('${wallet_address}')`
      );
      if (insertData.rowCount > 0) {
        log.logger.info(`INSERT INTO users (wallet) VALUES ('${wallet_address}')`)
        res.status(200).json({ message: "Create user succesfully" });

      } else {
        log.logger.error(`INSERT INTO users (wallet) VALUES ('${wallet_address}')`)
        res.status(400).json({ message: "Create user error" });
      }
    } else {
      log.logger.warn(`SELECT * FROM users WHERE wallet='${wallet_address}'`)
      res.status(400).json({ message: "User exist" });
    }
  }
);
/*GET user*/
router.post(
  "/get_information",
  (req, res, next) => {
    validateCreate(req, res, next);
  },
  async (req, res, next) => {
    const { wallet_address } = req.body;
    const selectDataUser = await clientDB.selectData(
      `SELECT * FROM users WHERE wallet='${wallet_address}'`
    );
    if(selectDataUser.rowCount == 1 ){
      log.logger.info(`SELECT * FROM users WHERE wallet='${wallet_address}'`)
      res.status(200).json({'message':'Get information successfully', 'user': selectDataUser.rows[0]})

    }
    else{
      log.logger.error(`SELECT * FROM users WHERE wallet='${wallet_address}'`)
      res.status(200).json({'message':'User not found'})
    }
  }
);
module.exports = router;
