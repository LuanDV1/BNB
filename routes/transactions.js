var express = require("express");
var router = express.Router();
const clientDB = require("../database/connect.js");

function validateCreate(req, res, next) {
  console.log("validate");
  const { wallet, package, amount } = req.body;
  if (
    wallet &&
    wallet != "" &&
    package &&
    package != "" &&
    amount &&
    amount != ""
  ) {
    next();
  } else {
    res.status(400).json({ messager: "invalid" });
  }
}

function validateGetTransaction(req, res, next) {
  console.log("validate");
  const { wallet, package, amount } = req.body;
  if (wallet && wallet != "") {
    next();
  } else {
    res.status(400).json({ messager: "invalid" });
  }
}

router.post(
  "/create",
  (req, res, next) => {
    validateCreate(req, res, next);
  },
  async (req, res, next) => {
    const { wallet, package, amount } = req.body;
    const dataUser = await clientDB.selectData(
      `SELECT * FROM users WHERE wallet='${wallet}'`
    );
    if (dataUser.rowCount > 0) {
      const insertTransation = await clientDB.insertData(
        `INSERT INTO transactions (package, amount, user_id) VALUES ('${package}', '${amount}', '${dataUser.rows[0]["user_id"]}')`
      );
      if (insertTransation.rowCount > 0) {
        res.json({ message: "Transation sucessfully" });
      } else {
        res.json({ message: "Transation faile" });
      }
    } else {
      res.json({ message: "Transation faile" });
    }
  }
);

router.post(
  "/get_transaction",
  (req, res, next) => {
    validateGetTransaction(req, res, next);
  },
  async (req, res, next) => {
    const { wallet } = req.body;
    const selecteTransation = await clientDB.selectData(
      `SELECT tran_id, package, amount, wallet   FROM transactions INNER JOIN users ON users.user_id = transactions.user_id WHERE wallet='${wallet}'`
    );
    res
      .status(200)
      .json({
        message: "Get transactions",
        transactions: selecteTransation.rows,
      });
  }
);
module.exports = router;
