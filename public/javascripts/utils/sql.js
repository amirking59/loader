const mysql = require("mysql")

const sql = () => {
    return mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "",
        database: "rtc"
    });
}
const select = (from, where, val) => `SELECT * FROM ${from} WHERE ${where} = '${val}'`
const create = (data, time, bot_id, token) => `INSERT INTO \`messages\` (\`data\`, \`created_at\`, \`updated_at\`, \`english_characters\`, \`persian_characters\`, \`language\`, \`is_question\`, \`related_model\`, \`related_phrase\`, \`enterprise_token\`, \`unique_token\`, \`driver\`, \`response\`, \`accuracy\`, \`is_encrypted\`, \`correct_id\`, \`bot_id\`) VALUES ('${data}', '${time}', '${time}', 4, 0, 'English', 0, '15', 'public conversation', ${token}, NULL, NULL, NULL, NULL, 0, NULL, ${bot_id});`

module.exports = {
    sql,
    select,
    create
}