const fs = require('fs')

function logToFile(user,message){
    const logStream = fs.createWriteStream(`./logs/logs_user${user}.txt`, {flags: 'a'})
    logStream.write(`${message}\n`)
    logStream.end()
}
const logger = {
    start: (user,message) => logToFile(user,`${new Date().toUTCString()} [START] ${message}`),
    generate: (user,message) => logToFile(user,`${new Date().toUTCString()} [GENERATE] ${message}`),
    endgenerate: (user,message) => logToFile(user,`${new Date().toUTCString()} [END-GENERATE] ${message}`),
    resetUI: (user,message) => logToFile(user,`${new Date().toUTCString()} [RESETUI] ${message}`),
    prevUI: (user,message) => logToFile(user,`${new Date().toUTCString()} [PREVIOUSUI] ${message}`),
    info: (user,message) => logToFile(user,`${new Date().toUTCString()} [INFO] ${message}`),
    warn: (user,message) => logToFile(user,`${new Date().toUTCString()} [WARN] ${message}`),
    error: (user,message) => logToFile(user,`${new Date().toUTCString()} [ERROR] ${message}`),
    end: (user,message) => logToFile(user,`${new Date().toUTCString()} [END] ${message}`),
}
module.exports = logger
