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
                const query = "DELETE FROM appdb WHERE id = ?;";

                connection.query(query, [id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            }); 

            return response ===1 ? true:false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateNameById(id, name) {
        try {
            id = parseInt(id, 10);
            
            // Check if id is a valid number
            if (isNaN(id)) {
                throw new Error('Invalid ID');
            }
    
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE appdb SET name = ? WHERE id = ?";
    
                connection.query(query, [name, id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                });
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error.message);
            return false;
        }
    }

    async searchByName(name) {
        try {
            
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM appdb WHERE name = ?;";
    
                connection.query(query, [name], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
    
            return response;
        } catch (error) {
            console.log(error.message);
        }
    }
    
     
} 


module.exports = DbService; 