const pool = require('../pool')

async function isChatActive(chatId) {
    try {
        let isChatActive = await pool.query(`SELECT * FROM "chat"
                            WHERE "chat".id = $1`, [chatId])
        if (!isChatActive.rows[0].active) {
            return Promise.reject('Chat was no longer active')
        }
        else {
            return Promise.resolve(`ChatID ${chatId} is active`)
        }
    } catch (err) {
        console.log(err);
        return Promise.reject(err)
    }
}

module.exports = isChatActive