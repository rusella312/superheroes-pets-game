# 🎨 Guía para Crear Sprites Personalizados

## 📋 Estructura de Sprite Sheet

### Mascotas (200x200px por frame):
```
┌─────────┬─────────┬─────────┬─────────┐
│ Frame 1 │ Frame 2 │ Frame 3 │ Frame 4 │ ← Idle
├─────────┼─────────┼─────────┼─────────┤
│ Frame 1 │ Frame 2 │ Frame 3 │ Frame 4 │ ← Walk
├─────────┼─────────┼─────────┼─────────┤
│ Frame 1 │ Frame 2 │ Frame 3 │ Frame 4 │ ← Eat
├─────────┼─────────┼─────────┼─────────┤
│ Frame 1 │ Frame 2 │ Frame 3 │ Frame 4 │ ← Sleep
├─────────┼─────────┼─────────┼─────────┤
│ Frame 1 │ Frame 2 │ Frame 3 │ Frame 4 │ ← Play
└─────────┴─────────┴─────────┴─────────┘
```

### Superhéroes (200x200px por frame):
```
┌─────────┬─────────┬─────────┐
│ Frame 1 │ Frame 2 │ Frame 3 │ ← Idle
├─────────┼─────────┼─────────┤
│ Frame 1 │ Frame 2 │ Frame 3 │ ← Walk
├─────────┼─────────┼─────────┤
│ Frame 1 │ Frame 2 │ Frame 3 │ ← Attack
└─────────┴─────────┴─────────┘
```

## 🛠️ Herramientas Recomendadas

### Gratuitas:
- **Piskel** (online) - https://www.piskelapp.com/
- **GIMP** - Editor de imágenes
- **Inkscape** - Editor vectorial
- **Aseprite** (pago) - Especializado en sprites

### Pasos para crear sprites:

1. **Diseñar el personaje base** (200x200px)
2. **Crear variaciones** para cada animación
3. **Organizar en sprite sheet** según la estructura
4. **Exportar como PNG** con transparencia
5. **Optimizar** para web (comprimir)

## 📁 Estructura de archivos recomendada:

```
sprites/
├── pets/
│   ├── dog-sprite.png
│   ├── cat-sprite.png
│   └── dragon-sprite.png
├── heroes/
│   ├── spiderman-sprite.png
│   ├── batman-sprite.png
│   └── superman-sprite.png
└── effects/
    ├── particles.png
    └── sparkles.png
```

## 🎯 Consejos de diseño:

1. **Mantener consistencia** en el estilo
2. **Usar colores vibrantes** para mascotas
3. **Agregar detalles** como accesorios
4. **Probar animaciones** antes de finalizar
5. **Optimizar para diferentes tamaños**

## 🔗 Enlaces útiles:

- **Paletas de colores**: https://lospec.com/palette-list
- **Referencias de sprites**: https://opengameart.org/
- **Tutoriales**: https://www.youtube.com/results?search_query=sprite+animation+tutorial 