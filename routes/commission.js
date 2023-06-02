var express = require("express");
var router = express.Router();
const clientDB = require("../database/connect.js");

router.post("/create", (req, res, next) => {
  const { wallet } = req.body;
  clientDB
    .selectData(`SELECT * FROM users WHERE wallet='${wallet}'`)
    .then((user) => {
      clientDB
        .selectData(
          `SELECT * FROM transactions WHERE user_id=${user.rows[0]["user_id"]}`
        )
        .then((transation) => {
          console.log(transation.rows);
          clientDB
            .selectData(
              `SELECT * FROM introductions WHERE user_id_new=${user.rows[0]["user_id"]} `
            )
            .then((introductions) => {
              if (introductions.rowCount > 0) {
                introductions.rows.forEach((introduction) => {
                  const calcRankValue = calculateRank(introduction['rank']) * transation.rows[0]['amount']
                  const calcPackageValue = calcPackage(transation.rows[0]['package']) * transation.rows[0]['amount']
                  const sqlInsertDataMonney = `INSERT INTO monney (user_id, monney_package, monney_rank, sum) VALUES (${introduction['user_id']}, ${calcPackageValue},${calcRankValue}, ${calcRankValue+calcPackageValue})`
                  clientDB.insertData(sqlInsertDataMonney)
                });
                res.status(200).json({ message: "Auto pay successfully" });
              } else {
                res.status(200).json({ message: "Auto pay successfully" });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      // error time 1
      console.log(err);
    });
});
function calculateRank(rank) {
  switch (rank) {
    case "F1":
      return 0.08;
    case "F2":
      return 0.03;
    case "F3":
      return 0.01;
    case "F4":
      return 0.01;
    case "F5":
      return 0.05;
    case "F6":
      return 0.005;
    case "F7":
      return 0.005;
    case "F8":
      return 0.005;
    case "F9":
      return 0.005;
    case "F10":
      return 0.005;
    default:
      return 0;
  }
}
function calcPackage(package) {
  switch (package) {
    case 90:
      return 0.21;
    case 150:
      return 0.4;
    case 180:
      return 0.54;
    case 240:
      return 0.8;
    case 300:
      return 1.1;
    case 360:
      return 1.44;
    default:
      return 0;
  }
}

module.exports = router;
