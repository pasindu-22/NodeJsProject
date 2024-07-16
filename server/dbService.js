const mysql = require('mysql');
const dotenv = require('dotenv');
let instance;
dotenv.config();

const connection = mysql.createConnection({  // Connection to the database
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('db ' + connection.state);
}); 


class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async getAllData() {
        try {
            const response = await new Promise((resolve,reject) => {
                const query = "SELECT * FROM appdb";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            // console.log(response);
            return response;
        }catch (error) { 
            console.log(error);
        }
    }

    async insertNewName(name) {
        try {
            const dateAdded = new Date();
            // Format the date to match MySQL's datetime format
            const formattedDate = dateAdded.toISOString().slice(0, 19).replace('T', ' ');

            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO appdb (name, date_added) VALUES (?, ?);";

                connection.query(query, [name, formattedDate], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });

            return {
                id: insertId,
                name: name,
                dateAdded: dateAdded
            };
        } catch (error) {
            console.log(error);
        }
    }

    async deleteRowById(id) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM names WHERE id = ?;";

                connection.query(query, [id], (err, result) => {
                if (err) reject(new Error(err.message));
                resolve(result);
            })
        }); 

        console.log(response);
    } catch (error) {
        console.log(error);
    }
}
}

module.exports = DbService; 