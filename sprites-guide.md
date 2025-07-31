# 🎮 Guía de Sprites Animados Profesionales

## 📋 **Información General**

Este juego usa **sprite sheets animados** para mostrar mascotas y héroes con movimiento profesional. Los sprites están basados en el pack gratuito de **0x72/2D-Character-Pack**.

## 🐾 **Mascotas Disponibles**

### **Mascotas Básicas:**
- `dog` / `perro` - Perro animado
- `cat` / `gato` - Gato animado  
- `dragon` - Dragón animado
- `horse` - Caballo animado
- `tortuga` - Tortuga animada

### **Cómo Agregar una Nueva Mascota:**

1. **Descarga el sprite sheet** de la mascota que quieras
2. **Agrega el CSS** en `styles.css`:

```css
/* Nueva mascota - Sprite animado */
.pet-sprite.nueva-mascota {
    background-image: url('URL_DEL_SPRITE_SHEET');
    background-size: 400px 100px; /* 4 frames x 100px */
    background-repeat: no-repeat;
    animation: petIdle 2s steps(4) infinite;
    image-rendering: pixelated;
}
```

3. **Agrega la opción** en el HTML:

```html
<option value="nueva-mascota">Nueva Mascota</option>
```

## 🦸 **Héroes Disponibles**

### **Héroes Básicos:**
- `spiderman` - Spider-Man animado
- `batman` - Batman animado
- `superman` - Superman animado
- `flash` - Flash animado

### **Cómo Agregar un Nuevo Héroe:**

1. **Descarga el sprite sheet** del héroe
2. **Agrega el CSS** en `styles.css`:

```css
/* Nuevo héroe - Sprite animado */
.hero-sprite.nuevo-heroe {
    background-image: url('URL_DEL_SPRITE_SHEET');
    background-size: 300px 100px; /* 3 frames x 100px */
    background-repeat: no-repeat;
    animation: heroIdle 1.5s steps(3) infinite;
    image-rendering: pixelated;
}
```

3. **Agrega la opción** en el HTML:

```html
<option value="nuevo-heroe">Nuevo Héroe</option>
```

## 🎨 **Animaciones Disponibles**

### **Para Mascotas:**
- `petIdle` - Animación de reposo (automática)
- `petWalk` - Animación de caminar
- `eating` - Animación de comer
- `sleeping` - Animación de dormir
- `playing` - Animación de jugar

### **Para Héroes:**
- `heroIdle` - Animación de reposo (automática)
- `heroAttack` - Animación de ataque
- `walking` - Animación de caminar

## 🔧 **Estructura de Sprite Sheets**

### **Mascotas (4 frames):**
```
[Frame1][Frame2][Frame3][Frame4]
  100px   100px   100px   100px
```

### **Héroes (3 frames):**
```
[Frame1][Frame2][Frame3]
  100px   100px   100px
```

## 📦 **Recursos Gratuitos**

### **Sprite Sheets Profesionales:**
1. **0x72/2D-Character-Pack** (GitHub)
   - URL: `https://github.com/0x72/2D-Character-Pack`
   - Incluye: Animales, Héroes, Personajes

2. **OpenGameArt.org**
   - URL: `https://opengameart.org/`
   - Sprites gratuitos de alta calidad

3. **Itch.io**
   - URL: `https://itch.io/game-assets/free`
   - Packs de sprites gratuitos

### **Cómo Descargar:**
1. Ve al repositorio de GitHub
2. Descarga el archivo PNG que necesites
3. Colócalo en tu proyecto o usa la URL directa

## 🎯 **Ejemplo Práctico**

### **Agregar un León:**

1. **CSS:**
```css
.pet-sprite.lion {
    background-image: url('https://raw.githubusercontent.com/0x72/2D-Character-Pack/master/PNG/Animals/Lion.png');
    background-size: 400px 100px;
    background-repeat: no-repeat;
    animation: petIdle 2s steps(4) infinite;
    image-rendering: pixelated;
}
```

2. **HTML:**
```html
<option value="lion">León</option>
```

3. **¡Listo!** El león aparecerá como opción al crear mascotas.

## 🚀 **Optimización**

### **Para Mejor Rendimiento:**
- Usa sprites de 100px x 100px máximo
- Mantén 4 frames para mascotas, 3 para héroes
- Usa `image-rendering: pixelated` para pixel art
- Comprime las imágenes si son muy grandes

### **Para Animaciones Suaves:**
- Usa `steps()` en lugar de `linear`
- Mantén duraciones entre 1-3 segundos
- Usa `transform` para efectos adicionales

## 🎮 **Próximos Pasos**

1. **Descarga sprites** que te gusten
2. **Agrega el CSS** siguiendo el patrón
3. **Actualiza el HTML** con las nuevas opciones
4. **¡Prueba las animaciones!**

## 📞 **Soporte**

Si necesitas ayuda para agregar sprites específicos o tienes problemas con las animaciones, ¡dime qué mascota o héroe quieres agregar! 