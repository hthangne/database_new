const sql = require("mssql");

const config = {
    user: "tks", 
    password: "1234",   // sửa password SQL Server của bạn
    server: "LAPTOP-4RQOJLUA\\SQLEXPRESS",
    database: "EcommerceDB",
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
    
};

module.exports = config;

// "LAPTOP-4RQOJLUA\\SQLEXPRESS"
