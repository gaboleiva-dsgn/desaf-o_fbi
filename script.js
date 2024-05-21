const express = require('express');
const app = express();
const users = require('./data/agentes.js')
const jwt = require('jsonwebtoken')
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor lavantado y escuchando por el puerto ${PORT}!`);
});

// Middleware
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/SignIn', (req, res) => {
    const { email, password } = req.query;

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        const token = jwt.sign({
             exp: Math.floor(Date.now() / 1000) + 240,
             data: user
        }, secreyKey); 
        res.send(``)
    } else {
        res.status(401).json({ message: 'No se encontró el usuario' });
    }

});