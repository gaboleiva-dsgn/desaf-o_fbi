const express = require('express');
const app = express();
const leerAgentes = require('./data/agentes.js')
const agentes = leerAgentes.results;
const jwt = require('jsonwebtoken')
const secretKey = 'superClaveSecreta';

// Levantamos el servidor y escuchamos el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor lavantado y escuchando por el puerto ${PORT}!`);
});

// Middleware
app.use(express.json())

// Ruta raíz devolvemos index.html como respuesta
app.get('/', (req, res) => {
    return res.sendFile(__dirname + '/index.html');
});

// Ruta que un token para autenticar un agente basado en sus credenciales.
app.get('/SignIn', (req, res) => {
    const { email, password } = req.query;

    const secretAgent = agentes.find((a) => a.email == email && a.password == password);

    if (secretAgent) {
        const token = jwt.sign(secretAgent, secretKey, {expiresIn: '2m'}); 
        res.send(`
        <h1> Bienvenido ${email} </h1>
        <a href="/restringida?token=${token}"> <p> Ir a la sección restringida </p></a>
            <script>
                sessionStorage.setItem('token', '${token}')
            </script>
        `)
    } else {
        res.status(401).json({ message: 'No se encontró el agente secreto' });
    }

});

app.get('/restringida',  (req, res) => {
    console.log("ingresando a la sección restringida");
    const token = req.query.token;
    if (!token) {
        res.status(401).send("No hay token, agente no esta Autorizado");
    } else {
        jwt.verify(token, secretKey, (err, data) => {
            // console.log("Valor de Data: ", data);
            err ? 
            res.status(403).send("Su clave secreta es inválida o ha expirado")
            : 
            res.status(200).send(`Bienvenido agente ${data.email} a la sección restringida`);
        });
    }


});