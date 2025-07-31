# 🎨 Sprites Simples y Bonitos - Listos para Usar

## 🐕 **MASCOTAS - Sprites Gratuitos y Bonitos**

### Opción 1: Sprites de Pixel Art (Más Bonitos)
```css
/* Perro - Pixel Art Bonito */
.pet-sprite.dog {
    background-image: url('https://raw.githubusercontent.com/0x72/2D-Character-Pack/master/PNG/Animals/Dog.png');
    background-size: 400px 100px;
}

/* Gato - Pixel Art Bonito */
.pet-sprite.cat {
    background-image: url('https://raw.githubusercontent.com/0x72/2D-Character-Pack/master/PNG/Animals/Cat.png');
    background-size: 400px 100px;
}

/* Dragón - Pixel Art Bonito */
.pet-sprite.dragon {
    background-image: url('https://raw.githubusercontent.com/0x72/2D-Character-Pack/master/PNG/Animals/Dragon.png');
    background-size: 400px 100px;
}
```

### Opción 2: Sprites Simples con Colores (Más Fáciles)
```css
/* Perro Simple - Colores Bonitos */
.pet-sprite.dog {
    background: linear-gradient(45deg, #8B4513, #A0522D);
    border-radius: 50%;
    position: relative;
}

.pet-sprite.dog::before {
    content: '🐕';
    font-size: 60px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* Gato Simple - Colores Bonitos */
.pet-sprite.cat {
    background: linear-gradient(45deg, #FFA500, #FF8C00);
    border-radius: 50%;
    position: relative;
}

.pet-sprite.cat::before {
    content: '🐱';
    font-size: 60px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* Dragón Simple - Colores Bonitos */
.pet-sprite.dragon {
    background: linear-gradient(45deg, #FF4500, #DC143C);
    border-radius: 50%;
    position: relative;
}

.pet-sprite.dragon::before {
    content: '🐉';
    font-size: 60px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

## 🦸 **SUPERHÉROES - Sprites Gratuitos y Bonitos**

### Opción 1: Sprites de Pixel Art
```css
/* Spiderman - Pixel Art */
.hero-sprite.spiderman {
    background-image: url('https://raw.githubusercontent.com/0x72/2D-Character-Pack/master/PNG/Heroes/Spider-Man.png');
    background-size: 300px 100px;
}

/* Batman - Pixel Art */
.hero-sprite.batman {
    background-image: url('https://raw.githubusercontent.com/0x72/2D-Character-Pack/master/PNG/Heroes/Batman.png');
    background-size: 300px 100px;
}

/* Superman - Pixel Art */
.hero-sprite.superman {
    background-image: url('https://raw.githubusercontent.com/0x72/2D-Character-Pack/master/PNG/Heroes/Superman.png');
    background-size: 300px 100px;
}
```

### Opción 2: Sprites Simples con Emojis (Más Fáciles)
```css
/* Spiderman Simple */
.hero-sprite.spiderman {
    background: linear-gradient(45deg, #FF0000, #DC143C);
    border-radius: 50%;
    position: relative;
}

.hero-sprite.spiderman::before {
    content: '🕷️';
    font-size: 60px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* Batman Simple */
.hero-sprite.batman {
    background: linear-gradient(45deg, #000000, #2F2F2F);
    border-radius: 50%;
    position: relative;
}

.hero-sprite.batman::before {
    content: '🦇';
    font-size: 60px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

/* Superman Simple */
.hero-sprite.superman {
    background: linear-gradient(45deg, #0000FF, #4169E1);
    border-radius: 50%;
    position: relative;
}

.hero-sprite.superman::before {
    content: '🦸';
    font-size: 60px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

## 🎯 **¿CUÁL ELEGIR?**

### **Opción A: Sprites de Pixel Art** (Más Profesionales)
- ✅ Se ven muy profesionales
- ✅ Tienen animaciones reales
- ✅ Funcionan con las animaciones CSS que ya tienes
- ❌ Dependen de URLs externas

### **Opción B: Sprites Simples con Emojis** (Más Fáciles)
- ✅ **100% funcionales inmediatamente**
- ✅ No dependen de URLs externas
- ✅ Se ven bonitos y coloridos
- ✅ Fáciles de personalizar
- ❌ No tienen animaciones complejas

## 🚀 **RECOMENDACIÓN**

**Para empezar rápido y bonito: Usa la Opción B (Sprites Simples con Emojis)**

Son más fáciles, funcionan inmediatamente y se ven muy bonitos con los colores gradientes.

¿Quieres que implemente la Opción B en tu CSS? 🎨 