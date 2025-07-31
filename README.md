# 🎮 Superheroes & Pets Game

Un juego web interactivo donde puedes adoptar mascotas virtuales y cuidarlas.

## 🚀 Deployment en Render

### Paso 1: Subir a GitHub

1. **Crear repositorio en GitHub:**
   - Ve a [github.com](https://github.com)
   - Crea un nuevo repositorio llamado `superheroes-pets-game`
   - NO inicialices con README (ya tenemos uno)

2. **Subir código a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/superheroes-pets-game.git
   git push -u origin main
   ```

### Paso 2: Configurar Render

1. **Ir a Render:**
   - Ve a [render.com](https://render.com)
   - Crea una cuenta o inicia sesión

2. **Crear nuevo sitio estático:**
   - Click en "New +"
   - Selecciona "Static Site"
   - Conecta tu repositorio de GitHub

3. **Configuración:**
   - **Name:** `superheroes-pets-game`
   - **Build Command:** `echo "No build required"`
   - **Publish Directory:** `.` (punto)
   - **Branch:** `main`

4. **Variables de entorno (opcional):**
   - Si necesitas configurar la API, agrega variables de entorno

### Paso 3: Configurar API

1. **URL de la API:**
   - La API ya está configurada en `script.js`
   - URL: `https://api-superheroes-v2-1.onrender.com`

2. **Si necesitas cambiar la API:**
   - Edita la línea en `script.js`:
   ```javascript
   const API_BASE_URL = 'https://tu-nueva-api.onrender.com';
   ```

### Paso 4: Desplegar

1. **Click en "Create Static Site"**
2. **Esperar el deployment** (2-3 minutos)
3. **Tu sitio estará disponible en:** `https://tu-app.onrender.com`

## 📁 Estructura del Proyecto

```
superheroes-pets-game/
├── index.html          # Página principal
├── script.js           # Lógica del juego
├── styles.css          # Estilos CSS
└── README.md           # Este archivo
```

## 🎮 Características del Juego

- **Login de superhéroes** con diferentes poderes
- **Adopción de mascotas** virtuales
- **Sistema de cuidado** (alimentar, jugar, limpiar, curar, dormir)
- **Estadísticas dinámicas** con barras animadas
- **Sistema de monedas** y recompensas
- **Efectos visuales** y animaciones
- **Batalla espacial** automática
- **Tienda de accesorios** para mascotas

## 🔧 Tecnologías Usadas

- **HTML5** - Estructura
- **CSS3** - Estilos y animaciones
- **JavaScript** - Lógica del juego
- **API REST** - Backend para datos

## 🌐 URLs Importantes

- **Juego:** `https://tu-app.onrender.com`
- **API:** `https://api-superheroes-v2-1.onrender.com`
- **Documentación API:** `https://api-superheroes-v2-1.onrender.com/docs`

## 🐛 Solución de Problemas

### Si el sitio no carga:
1. Verifica que todos los archivos estén en el repositorio
2. Revisa los logs de Render
3. Asegúrate de que `index.html` esté en la raíz

### Si la API no funciona:
1. Verifica que la URL de la API sea correcta
2. Revisa la consola del navegador para errores
3. El juego funciona en modo local si la API falla

### Si las barras no se mueven:
1. Recarga la página
2. Verifica que JavaScript esté habilitado
3. Revisa la consola para errores

## 📱 Compatibilidad

- ✅ **Chrome/Edge** - Funciona perfectamente
- ✅ **Firefox** - Funciona perfectamente
- ✅ **Safari** - Funciona perfectamente
- ✅ **Móviles** - Diseño responsive

## 🎯 Próximos Pasos

1. **Subir a GitHub** siguiendo el Paso 1
2. **Configurar Render** siguiendo el Paso 2
3. **Probar el deployment** en la URL de Render
4. **Compartir el enlace** con amigos

¡Tu juego estará online en minutos! 🚀✨ 