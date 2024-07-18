const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'client')));


//Create a User

app.post('/insert', (request, response) => {
    const { name, city, phone } = request.body;

    // Basic validation (should be expanded based on requirements)
    if (!name || !city || !phone) {
        return response.status(400).json({ error: 'Missing required fields' });
    }
 
    try {
        const db = dbService.getDbServiceInstance();
        const result = db.insertNewName(name, city, phone);

        result.then(data => response.status(201).json({ data: data }))
              .catch(err => {
                  console.log(`Error occurred while inserting the data for Name: ${name}, City: ${city}, Phone: ${phone}`);
                  console.log(err);
                  response.status(500).json({ error: 'An error occurred while inserting the data' });
              });
    } catch (error) {
        console.log(`Failed to get database service instance for Name: ${name}, City: ${city}, Phone: ${phone}`);
        console.log(error);
        response.status(500).json({ error: 'Failed to get database service instance' });
    }
});
  

//Read from database
app.get('/getAll', (request, response) => {
    const db = dbService.getDbServiceInstance();
    
    const result = db.getAllData();

    result.then(data => response.json({data: data}))
    .catch(err => console.log(err)); 
     
});


//Update
app.patch('/update', (request, response) => {
    const {id, name} = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.updateNameById(id,name);

    result
    .then(data => response.json({success: true}))
    .catch(err => console.log(err));

});


//Delete a User
app.delete('/delete/:id', (request, response) => {
    const {id} = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.deleteRowById(id); 

    result
    .then(data => response.json({success: true})) 
    .catch(err => console.log(err));
})

app.get('/search/:name', (request, response) => {
    const {name} = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.searchByName(name);

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});



// Login
app.post('/login', (request, response) => {
    const {username, password} = request.body;
    // Basic validation (should be expanded based on requirements)
    if (!username || !password) {
        return response.status(400).json({ error: 'Missing required fields' });
    }
 
    try {
        const db = dbService.getDbServiceInstance();
        const result = db.loginUser(username, password);

        result.then(data => {
            if (data) {
                response.status(200).json({ success: true });
            } else {
                response.status(401).json({ success: false, error: 'Invalid credentials' });
            }
        }).catch(err => {
            console.log(`Error occurred while logging in the user with username: ${username}`);
            console.log(err);
            response.status(500).json({ error: 'An error occurred while processing your request' });
        });
    } catch (error) {
        console.log(`Failed to get database service instance for username: ${username}`);
        console.log(error);
        response.status(500).json({ error: 'Failed to get database service instance' });
    }

})

app.listen(process.env.PORT, () => console.log('Server is running')); 
