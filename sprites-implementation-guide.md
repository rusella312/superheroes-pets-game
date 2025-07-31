# 🎮 Guía para Implementar Sprites Descargados

## **Paso 1: Organizar los Archivos**

1. **Crea una carpeta `sprites` en tu proyecto:**
   ```
   JUEGO_WEB/
   ├── index.html
   ├── styles.css
   ├── script.js
   ├── sprites/          ← Nueva carpeta
   │   ├── pets/
   │   │   ├── dog.png
   │   │   ├── cat.png
   │   │   ├── dragon.png
   │   │   └── horse.png
   │   └── heroes/
   │       ├── spiderman.png
   │       ├── batman.png
   │       ├── superman.png
   │       └── flash.png
   ```

## **Paso 2: Actualizar el CSS**

### Reemplazar los sprites CSS con imágenes reales:

```css
/* ==================== SPRITES CON IMÁGENES REALES ==================== */

/* Contenedor de sprite */
.sprite-container {
    width: 100px;
    height: 100px;
    position: relative;
    overflow: hidden;
    border-radius: 10px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    margin: 0 auto;
}

/* Sprite de mascota base */
.pet-sprite {
    width: 100%;
    height: 100%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    transition: all 0.3s ease;
    border-radius: 10px;
}

/* Sprite de héroe base */
.hero-sprite {
    width: 100%;
    height: 100%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    transition: all 0.3s ease;
    border-radius: 10px;
}

/* ==================== MASCOTAS CON IMÁGENES ==================== */

/* Perro */
.pet-sprite.dog, .pet-sprite.perro {
    background-image: url('./sprites/pets/dog.png');
}

/* Gato */
.pet-sprite.cat, .pet-sprite.gato {
    background-image: url('./sprites/pets/cat.png');
}

/* Dragón */
.pet-sprite.dragon {
    background-image: url('./sprites/pets/dragon.png');
}

/* Caballo */
.pet-sprite.horse {
    background-image: url('./sprites/pets/horse.png');
}

/* Tortuga */
.pet-sprite.tortuga {
    background-image: url('./sprites/pets/tortoise.png');
}

/* ==================== SUPERHÉROES CON IMÁGENES ==================== */

/* Spider-Man */
.hero-sprite.spiderman {
    background-image: url('./sprites/heroes/spiderman.png');
}

/* Batman */
.hero-sprite.batman {
    background-image: url('./sprites/heroes/batman.png');
}

/* Superman */
.hero-sprite.superman {
    background-image: url('./sprites/heroes/superman.png');
}

/* Flash */
.hero-sprite.flash {
    background-image: url('./sprites/heroes/flash.png');
}

/* ==================== ANIMACIONES ==================== */

/* Animación idle para mascotas */
@keyframes petIdle {
    0% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-5px) scale(1.05); }
    100% { transform: translateY(0px) scale(1); }
}

/* Animación idle para héroes */
@keyframes heroIdle {
    0% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-3px) scale(1.05); }
    100% { transform: translateY(0px) scale(1); }
}

/* Aplicar animaciones */
.pet-sprite {
    animation: petIdle 2s ease-in-out infinite;
}

.hero-sprite {
    animation: heroIdle 1.5s ease-in-out infinite;
}

/* ==================== ESTADOS DE ANIMACIÓN ==================== */

/* Mascota caminando */
.pet-sprite.walking {
    animation: petIdle 1s ease-in-out infinite;
    transform: scale(1.1);
}

/* Mascota comiendo */
.pet-sprite.eating {
    animation: petIdle 0.5s ease-in-out infinite;
    transform: scale(1.2);
}

/* Mascota durmiendo */
.pet-sprite.sleeping {
    animation: petIdle 3s ease-in-out infinite;
    opacity: 0.7;
    transform: scale(0.9);
}

/* Mascota jugando */
.pet-sprite.playing {
    animation: petIdle 0.8s ease-in-out infinite;
    transform: scale(1.3);
}

/* Héroe atacando */
.hero-sprite.attacking {
    animation: heroIdle 0.6s ease-in-out infinite;
    transform: scale(1.2);
}

/* Héroe caminando */
.hero-sprite.walking {
    animation: heroIdle 1s ease-in-out infinite;
    transform: scale(1.1);
}
```

## **Paso 3: Verificar Nombres de Archivos**

### Asegúrate de que los nombres de archivo coincidan:

**Para mascotas:**
- `dog.png` o `perro.png`
- `cat.png` o `gato.png`
- `dragon.png`
- `horse.png` o `caballo.png`
- `tortoise.png` o `tortuga.png`

**Para héroes:**
- `spiderman.png`
- `batman.png`
- `superman.png`
- `flash.png`

## **Paso 4: Si los Nombres No Coinciden**

### Si tus archivos tienen nombres diferentes, actualiza el CSS:

```css
/* Ejemplo: si tu archivo se llama "dog_sprite.png" */
.pet-sprite.dog, .pet-sprite.perro {
    background-image: url('./sprites/pets/dog_sprite.png');
}

/* Ejemplo: si tu archivo se llama "spider_man.png" */
.hero-sprite.spiderman {
    background-image: url('./sprites/heroes/spider_man.png');
}
```

## **¿Necesitas Ayuda?**

1. **¿Qué nombres tienen tus archivos descargados?**
2. **¿En qué formato están?** (PNG, JPG, etc.)
3. **¿Quieres que te ayude a organizarlos?**

¡Dime los nombres de tus archivos y te ayudo a configurarlos! 