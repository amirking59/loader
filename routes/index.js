var express = require('express');
var router = express.Router();
var axios = require("axios")

const jsonGenerator = require("../public/javascripts/utils/jsonGenerator")
const db = require("../public/javascripts/utils/sql")
let con = db.sql();

/* GET home page. */
router.get('/', function (req, res) {
    try {
        const {token, bot_username, data, api} = req.query;
        const today = new Date();
        const time = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        con.query(db.select("enterprises", "token", token), (err, result) => {
            if (err) throw err;
            if (result.length === 0) res.status(400).json(jsonGenerator("Buy our enterprise plan!"))
            if (result.length === 1) {
                let enterprise_id = result[0].id;
                con.query(db.select("payments", "enterprise_id", enterprise_id), (err, presult) => {
                    if (err) throw err;
                    presult.map(payment => {
                        if (today < new Date(payment.expire_at)) {
                            if (payment.plan === "enterprise") {
                                v3(token, bot_username, data, api, enterprise_id, time).then((response => {
                                    res.json(response)
                                })).catch(err => {
                                    res.json(err)
                                })
                            } else {
                                res.status(400).json(jsonGenerator("Buy our enterprise plan!"))
                            }
                        } else {
                            res.status(400).json(jsonGenerator("Your account has expired!"))
                        }
                    })
                })
            }
        })
    } catch (err) {
        res.status(400).json(jsonGenerator("server error!"))
    }
});

module.exports = router;

const v3 = (token, bot_username, data, api, enterprise_id, time) => {
    return new Promise((resolve, reject) => {
        let response = jsonGenerator(null)
        let bot_id = 0;
        con.query(db.select("robots", "username", bot_username), (err, result) => {
            if (err) reject(err);
            result.map(robot => {
                if (robot.enterprise_id === enterprise_id) {
                    bot_id = robot.id;
                }
            })
        })

        axios.get(encodeURI(`http://51.254.91.136:5000/core/${token}/${data}`)).then((res) => {
            response = jsonGenerator(res.response, res.provider.source);
            store(msg.response, time,  bot_id, token)
        }).catch((err) => {})

        exact(data, token).then((result) => {
            let msg = result[0];
            if (msg.related_phrase === "private conversation" || msg.related_phrase === "public conversation") {
                resolve(jsonGenerator(msg.response))
                store(msg.response, time,  bot_id, token)
            } else {
                resolve(jsonGenerator(response));
                store(msg.response, time,  bot_id, token)
            }
        }).catch(() => {
            reject(jsonGenerator(null))
        })
    })

}

const exact = (data, token) => {
    return new Promise((resolve, reject) => {
        let array = [];
        con.query(db.select("messages", "data", data), async (err, result) => {
            if (Array.isArray(result)) {
                result.map(msg => {
                    if (msg.enterprise_token === token) {
                        array.push(msg)
                    }
                })
            } else {
                if (result.enterprise_token === token) {
                    array.push(result)
                }
            }
            if (err) {
                reject(err)
            }
            resolve(array)
        })
    })
}

const store = (data, time, bot_id, token) =>{
    con.query(db.create(data, time, bot_id, token), (err, result) => {
        if (err) throw err;
        return true;
    })
}
