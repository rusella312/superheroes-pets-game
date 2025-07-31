const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;

// Servir archivos estáticos
app.use(express.static(__dirname));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🎮 Servidor del juego iniciado en http://localhost:${PORT}`);
    console.log(`🌐 API: https://api-superheroes-v2-1.onrender.com`);
    console.log(`📚 Swagger: https://api-superheroes-v2-1.onrender.com/api-docs`);
});

console.log('🚀 Para instalar dependencias: npm install express');
console.log('🎯 Para ejecutar: node server.js'); 