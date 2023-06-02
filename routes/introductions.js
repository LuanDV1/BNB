var express = require("express");
var router = express.Router();
const clientDB = require("../database/connect.js");
const env = require("../env/domain.js");
const log = require("../logs/wirteLogs.js");
function validateCreate(req, res, next) {
  console.log("validate");
  const { wallet_address } = req.body;
  if (wallet_address && wallet_address != "") {
    next();
  } else {
    res.status(400).json({ messager: "invalid" });
  }
}

function validateWallet(req, res, next) {
  const { current_user, new_user } = req.params;
  if (current_user && new_user) {
    next();
  } else {
    log.logger.error(
      `Received a ${req.method} request for ${req.url} => MESSAGE : invalue`
    );
    res.status(400).json({ message: "invalue" });
  }
}
function getUser(wallet) {
  return fetch(`${env.domain}/users/get_information`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ wallet_address: wallet }),
  }).then((response) => {
    return response
      .json()
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

function mappingData(user_id, user_id_new) {
  return fetch(`${env.domain}/introduction/mapping/data/wallet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: user_id, current_user_id: user_id_new }),
  }).then((response) => {
    return response
      .json()
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

router.get(
  "/new_user/:current_user/:new_user",
  (req, res, next) => {
    validateWallet(req, res, next);
  },
  async (req, res, next) => {
    const { current_user, new_user } = req.params;
    getUser(current_user).then((currentUser) => {
      if (currentUser.message == "Get information successfully") {
        log.logger.info(
          `Received a ${req.method} request for ${req.url} => MESSAGE: call API success`
        );
        getUser(new_user).then((newUser) => {
          if (newUser.message == "Get information successfully") {
            log.logger.info(
              `Received a ${req.method} request for ${req.url} => MESSAGE: call API success`
            );
            // insert DB

            //write F1,F2,F3...
            const sqlQuery = `INSERT INTO introductions (user_id, rank, user_id_new) VALUES (${currentUser.user.user_id},'F1' ,${newUser.user.user_id});`;
            clientDB
              .insertData(sqlQuery)
              .then((action) => {
                log.logger.info(`${sqlQuery}`);
                res;
                mappingData(currentUser.user.user_id, newUser.user.user_id)
                  .then((succes) => {
                    log.logger.info(`${succes}`);
                    res
                      .status(200)
                      .json({ message: "Introduction sucessfully" });
                  })
                  .catch((err) => {
                    log.logger.error(`${err}`);
                    s;
                    res.status(200).json({ message: "Introduction faile" });
                  });
              })
              .catch((err) => {
                log.logger.error(`${err}`);
                s;
                res.status(200).json({ message: "Introduction faile" });
              });
          } else {
            log.logger.error(
              `Received a ${req.method} request for ${req.url} => MESSAGE : user invalue`
            );
            res.status(400).json({ message: "Introdution faile" });
          }
        });
      } else {
        log.logger.error(
          `Received a ${req.method} request for ${req.url} => MESSAGE : user invalue`
        );
        res.status(400).json({ message: "Introdution faile" });
      }
    });
  }
);

router.post("/mapping/data/wallet", (req, res, next) => {
  //NOTE currunt user id for insert data not action
  const { user_id, current_user_id } = req.body;
  console.log("user_id", user_id);
  console.log("current_user_id", current_user_id);
  let dataUserId = user_id;
  let dataInsertIntroduction = [];
  let rank = 2;
  const intervalObj = setInterval(() => {
    if (dataUserId == null) {
      clearInterval(intervalObj);
      console.log(dataInsertIntroduction);
      if (dataInsertIntroduction.length > 0) {
        let total = 0;
        dataInsertIntroduction.forEach((element) => {
          const sqlQuery = `INSERT INTO introductions (user_id, rank, user_id_new) VALUES (${element.user_id},'${element.rank}' ,${element.user_id_new});`;
          clientDB
            .insertData(sqlQuery)
            .then((data) => {
              total += 1;
            })
            .catch((err) => {
              return res.json({ message: "mapping data error 1" });
            });
        });
        return res.json({ message: "mapping data success" });
      } else {
        return res.json({ message: "mapping data success" });
      }
    } else {
      clientDB
        .selectData(
          `SELECT * FROM introductions WHERE user_id_new=${dataUserId}`
        )
        .then((data) => {
          if (data.rowCount > 0) {
            dataUserId = data.rows[0]["user_id"];
            dataInsertIntroduction.push({
              user_id: dataUserId,
              rank: `F${rank}`,
              user_id_new: current_user_id,
            });
            rank++;
          } else {
            dataUserId = null;
          }
        });
    }
  }, 1500);
});

// function convertRank(rank) {
//   const rankData = rank.split("F");
//   return Number(rankData[1]);
// }
// function intervalFunc() {
//     console.log('Cant stop me now!');
//   }

module.exports = router;
