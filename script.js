// ==================== VARIABLES GLOBALES ====================

let gameState = {
    currentHero: null,
    currentPet: null,
    token: null,
    userCoins: 0,
    petAccessories: [],
    ownedItems: []
};

// ==================== FUNCIONES DE UTILIDAD ====================

function loadLocalCoins() {
    const savedCoins = localStorage.getItem('userCoins');
    gameState.userCoins = savedCoins ? parseInt(savedCoins) : 0;
    console.log('💰 Monedas cargadas desde localStorage:', gameState.userCoins);
    updateCoinsDisplay();
}

function saveLocalCoins() {
    localStorage.setItem('userCoins', gameState.userCoins.toString());
    console.log('💰 Monedas guardadas en localStorage:', gameState.userCoins);
}

function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.getElementById('notification-container').appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showScreen(screenId) {
    // Ocultar todas las pantallas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Mostrar la pantalla seleccionada
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

// ==================== FUNCIONES DE API ====================

async function apiRequest(endpoint, method = 'GET', body = null) {
    const url = window.getAPIUrl() + endpoint;
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors'
    };
    
    if (gameState.token) {
        options.headers['Authorization'] = `Bearer ${gameState.token}`;
    }
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    console.log('🌐 API Request:', url);
    console.log('📤 Request Options:', options);
    
    try {
        const response = await fetch(url, options);
        console.log('📥 Response Status:', response.status);
        console.log('📥 Response Headers:', response.headers);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.log('❌ API Error', response.status + ':', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('✅ API Response:', data);
        return data;
        
    } catch (error) {
        console.log('🚨 API Error:', error);
        console.log('🚨 Error Type:', error.constructor.name);
        console.log('🚨 Error Message:', error.message);
        throw error;
    }
}

async function testAPIConnection() {
    console.log('🔍 Probando conexión con la API...');
    try {
        const response = await apiRequest('/api/heroes');
        console.log('✅ API conectada correctamente');
        return true;
    } catch (error) {
        console.error('❌ Error conectando a la API:', error);
        return false;
    }
}

async function testAPIDirectly() {
    console.log('🔍 Probando API directamente...');
    try {
        const response = await fetch(window.getAPIUrl() + '/api/heroes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });
        
        console.log('📥 Response Status:', response.status);
        console.log('📥 Response Headers:', response.headers);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API responde correctamente:', data);
            showNotification(`✅ API conectada: ${data.length} héroes disponibles`, 'success');
        } else {
            console.error('❌ API Error:', response.status);
            showNotification('❌ Error conectando a la API', 'error');
        }
    } catch (error) {
        console.error('❌ Error:', error);
        showNotification('❌ Error conectando a la API', 'error');
    }
}

// ==================== FUNCIONES DE AUTENTICACIÓN ====================

async function login(name, password) {
    try {
        showLoading();
        
        const response = await apiRequest('/api/login', 'POST', { name, password });
        
        if (response.token) {
            gameState.token = response.token;
            localStorage.setItem('jwtToken', response.token);
            localStorage.setItem('loggedInHeroName', name);
            
            await loadHeroInfo();
            showGame();
            showNotification('¡Login exitoso!', 'success');
        }
        
    } catch (error) {
        console.error('❌ Error en login:', error);
        showNotification('Error en el login. Verifica tus credenciales.', 'error');
    } finally {
        hideLoading();
    }
}

async function register(heroData) {
    try {
        showLoading();
        
        const response = await apiRequest('/api/heroes', 'POST', heroData);
        
        if (response.id) {
            showNotification('¡Superhéroe creado exitosamente!', 'success');
            showLogin();
        }
        
    } catch (error) {
        console.error('❌ Error en registro:', error);
        showNotification('Error al crear el superhéroe.', 'error');
    } finally {
        hideLoading();
    }
}

function logout() {
    gameState.token = null;
    gameState.currentHero = null;
    gameState.currentPet = null;
    
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('loggedInHeroName');
    
    // Ocultar header
    const header = document.querySelector('.header');
    if (header) {
        header.classList.add('hidden');
    }
    
    showLogin();
    showNotification('Sesión cerrada', 'info');
}

// ==================== FUNCIONES DE HÉROES ====================

async function loadHeroInfo() {
    const loggedInHeroName = localStorage.getItem('loggedInHeroName');
    console.log('DEBUG: loadHeroInfo - loggedInHeroName from localStorage:', loggedInHeroName);
    
    if (!loggedInHeroName) return;
    
    try {
        const heroes = await apiRequest('/api/heroes');
        const hero = heroes.find(h => h.name === loggedInHeroName);
        
        console.log('DEBUG: loadHeroInfo - Found hero:', hero);
        
        if (hero) {
            gameState.currentHero = hero;
            updateHeroDisplay();
            
            // Cargar monedas después de cargar el héroe
            loadLocalCoins();
            updateCoinsDisplay();
        }
        
    } catch (error) {
        console.error('❌ Error cargando información del héroe:', error);
    }
}

function updateHeroDisplay() {
    if (gameState.currentHero) {
        const heroSprite = document.querySelector('#profile-hero-avatar .hero-sprite');
        if (heroSprite) {
            heroSprite.className = `hero-sprite ${gameState.currentHero.alias}`;
            console.log('✅ Sprite de héroe actualizado:', gameState.currentHero.alias);
        }
        
        const heroName = document.getElementById('profile-hero-name');
        if (heroName) {
            heroName.textContent = gameState.currentHero.name;
        }
        
        const heroDetails = document.getElementById('profile-hero-details');
        if (heroDetails) {
            heroDetails.textContent = `${gameState.currentHero.alias} - ${gameState.currentHero.city} - ${gameState.currentHero.team}`;
        }
    }
}

// ==================== FUNCIONES DE MONEDAS ====================

function updateCoinsDisplay() {
    const coinsElement = document.getElementById('user-coins');
    if (coinsElement) {
        coinsElement.textContent = gameState.userCoins;
    }
    console.log('💰 Monedas actualizadas:', gameState.userCoins);
}

function addCoins(amount) {
    gameState.userCoins += amount;
    saveLocalCoins();
    updateCoinsDisplay();
    console.log('💰 +' + amount + ' monedas agregadas. Total:', gameState.userCoins);
}

function spendCoins(amount) {
    if (gameState.userCoins >= amount) {
        gameState.userCoins -= amount;
        saveLocalCoins();
        updateCoinsDisplay();
        return true;
    }
    return false;
}

// ==================== FUNCIONES DE MASCOTAS ====================

// Función para mapear estadísticas de la API al formato del frontend
function mapPetStats(pet) {
    if (!pet) return null;
    
    console.log('📊 Mapeando estadísticas para mascota:', pet);
    console.log('📊 Stats disponibles:', Object.keys(pet));
    
    // Si ya tiene stats en formato inglés, usarlas
    if (pet.stats) {
        console.log('✅ Usando stats en inglés:', pet.stats);
        return pet.stats;
    }
    
    // Mapear estadísticas de español a inglés
    const mappedStats = {
        happiness: pet.felicidad || pet.happiness || 80,
        hunger: pet.hambre || pet.hunger || 60,
        energy: pet.energia || pet.energy || 70,
        cleanliness: pet.limpieza || pet.cleanliness || 90
    };
    
    console.log('🔄 Stats mapeados:', mappedStats);
    return mappedStats;
}

async function loadPetInfo() {
    if (!gameState.currentHero) return;
    
    try {
        console.log('🔍 Cargando mascotas para:', gameState.currentHero.name);
        const pets = await apiRequest(`/api/pets/by-owner/${gameState.currentHero.name}`);
        console.log('📋 Mascotas encontradas:', pets);
        
        if (pets && pets.length > 0) {
            gameState.currentPet = pets[0];
            console.log('✅ Mascota cargada:', gameState.currentPet);
            
            // Actualizar estadísticas y estado de salud
            updatePetStats();
            updateStatsDisplay();
            updateHealthStatus();
            
            // Actualizar display completo
            updatePetDisplay();
            
            // Ocultar mensaje de no mascota
            const noPetMessage = document.getElementById('no-pet-message');
            if (noPetMessage) {
                noPetMessage.style.display = 'none';
            }
        } else {
            console.log('⚠️ No se encontraron mascotas para este héroe');
            
            // Limpiar mascota actual
            gameState.currentPet = null;
            
            // Limpiar display de mascota
            clearPetDisplay();
            
            // Mostrar mensaje de no mascota
            const noPetMessage = document.getElementById('no-pet-message');
            if (noPetMessage) {
                noPetMessage.style.display = 'block';
            }
        }
        
    } catch (error) {
        console.error('❌ Error cargando mascotas:', error);
        showNotification('Error cargando mascotas', 'error');
        
        // Limpiar display en caso de error
        clearPetDisplay();
    }
}

function updatePetDisplay() {
    if (!gameState.currentPet) {
        console.log('⚠️ No hay mascota para mostrar');
        return;
    }
    
    console.log('🎨 Actualizando display de mascota:', gameState.currentPet);
    
    // Actualizar nombre
    const nameElement = document.getElementById('pet-name-display');
    if (nameElement) {
        nameElement.textContent = gameState.currentPet.name;
        nameElement.style.display = 'block';
        console.log('✅ Nombre actualizado:', gameState.currentPet.name);
    }
    
    // Actualizar emoji de mascota
    const petAvatar = document.getElementById('game-pet-avatar');
    if (petAvatar) {
        // Limpiar contenido existente
        petAvatar.innerHTML = '';
        petAvatar.style.display = 'block';
        
        // Mapeo de tipos de mascota a emojis
        const emojiMapping = {
            'perro': '🐕',
            'gato': '🐱', 
            'caballo': '🐎',
            'tortuga': '🐢',
            'conejo': '🐰',
            'pajaro': '🐦',
            'leon': '🦁',
            'tigre': '🐯',
            'dog': '🐕',
            'cat': '🐱',
            'horse': '🐎',
            'turtle': '🐢',
            'rabbit': '🐰',
            'bird': '🐦',
            'lion': '🦁',
            'tiger': '🐯',
            'dragon': '🐲'
        };
        
        const petType = gameState.currentPet.type || 'dog';
        const emoji = emojiMapping[petType.toLowerCase()] || '🐕';
        
        console.log('🎭 Tipo de mascota:', petType, '-> Emoji:', emoji);
        
        // Crear elemento con emoji
        const emojiElement = document.createElement('div');
        emojiElement.className = 'pet-emoji';
        emojiElement.textContent = emoji;
        emojiElement.style.fontSize = '80px';
        emojiElement.style.textAlign = 'center';
        emojiElement.style.margin = '20px 0';
        
        // Agregar emoji al contenedor
        petAvatar.appendChild(emojiElement);
    }
    
    // Actualizar accesorios
    updatePetAccessories();
    
    // Forzar actualización de estadísticas y estado de salud
    setTimeout(() => {
        updatePetStats();
        updateStatsDisplay();
        updateHealthStatus();
    }, 200);
    
    console.log('✅ Display de mascota actualizado completamente');
}

function updatePetStats() {
    if (!gameState.currentPet) {
        console.log('⚠️ No hay mascota para actualizar estadísticas');
        return;
    }
    
    console.log('📊 Actualizando estadísticas para mascota:', gameState.currentPet.name);
    
    // Mapeo directo de estadísticas
    const stats = {
        happiness: gameState.currentPet.felicidad || gameState.currentPet.happiness || 80,
        hunger: gameState.currentPet.hambre || gameState.currentPet.hunger || 60,
        energy: gameState.currentPet.energia || gameState.currentPet.energy || 70,
        cleanliness: gameState.currentPet.limpieza || gameState.currentPet.cleanliness || 90
    };
    
    console.log('🔄 Estadísticas mapeadas:', stats);
    
    // Guardar estadísticas en el objeto mascota
    gameState.currentPet.stats = stats;
    
    // Actualizar display inmediatamente
    updateStatsDisplay();
}

function updateHealthStatus() {
    if (!gameState.currentPet || !gameState.currentPet.stats) {
        console.log('⚠️ No hay estadísticas para calcular estado de salud');
        return;
    }
    
    const stats = gameState.currentPet.stats;
    console.log('🏥 Calculando estado de salud con stats:', stats);
    
    // Calcular puntuación de salud basada en todas las estadísticas
    const healthScore = (
        (stats.happiness || 0) + 
        (100 - (stats.hunger || 0)) + 
        (stats.energy || 0) + 
        (stats.cleanliness || 0)
    ) / 4;
    
    console.log('🏥 Puntuación de salud:', healthScore);
    
    // Determinar estado de salud
    let healthStatus = 'Sano';
    let healthClass = 'healthy';
    
    if (healthScore < 30) {
        healthStatus = 'Crítico';
        healthClass = 'critical';
    } else if (healthScore < 50) {
        healthStatus = 'Enfermo';
        healthClass = 'sick';
    } else if (healthScore < 70) {
        healthStatus = 'Débil';
        healthClass = 'weak';
    } else if (healthScore < 90) {
        healthStatus = 'Bien';
        healthClass = 'good';
    } else {
        healthStatus = 'Sano';
        healthClass = 'healthy';
    }
    
    console.log('🏥 Estado de salud:', healthStatus);
    
    // Actualizar el display de estado de salud
    const statusElement = document.getElementById('pet-status');
    if (statusElement) {
        statusElement.textContent = healthStatus;
        statusElement.className = `pet-status ${healthClass}`;
        console.log('✅ Estado de salud actualizado:', healthStatus);
    }
    
    // Actualizar el estado en el objeto mascota
    gameState.currentPet.healthStatus = healthStatus;
    gameState.currentPet.healthScore = healthScore;
}

// ==================== FUNCIONES DE ENDPOINTS ====================

async function checkAvailableEndpoints() {
    console.log('🔍 Verificando endpoints disponibles...');
    try {
        // Verificar endpoints básicos
        const petsResponse = await apiRequest('/api/pets');
        console.log('✅ Endpoint /api/pets disponible');
        
        const heroesResponse = await apiRequest('/api/heroes');
        console.log('✅ Endpoint /api/heroes disponible');
        
        // Verificar endpoints de actividades (sin usar OPTIONS para evitar CORS)
        const testEndpoints = [
            '/api/pets/16/feed',
            '/api/pets/16/play',
            '/api/pets/16/sleep',
            '/api/pets/16/cure'
        ];
        
        for (const endpoint of testEndpoints) {
            try {
                // Usar GET en lugar de OPTIONS para evitar problemas de CORS
                const response = await fetch(window.getAPIUrl() + endpoint, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.status === 404) {
                    console.log(`❌ Endpoint ${endpoint}: No disponible (404)`);
                } else {
                    console.log(`✅ Endpoint ${endpoint}: Disponible (${response.status})`);
                }
            } catch (error) {
                console.log(`❌ Endpoint ${endpoint}: ${error.message}`);
            }
        }
        
        console.log('💡 Nota: Los endpoints de actividades pueden no estar implementados en tu API.');
        console.log('🎮 El juego funcionará con simulación local de actividades.');
        
    } catch (error) {
        console.error('Error verificando endpoints:', error);
    }
}

// ==================== FUNCIONES DE ACTIVIDADES ====================

async function playWithPet() {
    if (!gameState.currentPet) {
        showNotification('No tienes una mascota para jugar', 'error');
        return;
    }
    
    console.log('🎮 Jugando con mascota:', gameState.currentPet.name);
    
    try {
        const response = await apiRequest(`/api/pets/${gameState.currentPet.id}/play`, 'POST');
        
        if (response && response.pet) {
            console.log('✅ Juego exitoso via API');
            gameState.currentPet = response.pet;
            
            // Actualizar estadísticas inmediatamente
            updatePetStats();
            updateStatsDisplay();
            updatePetEmojiState();
            
            addCoins(3);
            showNotification('¡Juego exitoso!', 'success');
            animatePetAction('playing');
            createPlayEffect();
            
            // Posible batalla espacial
            triggerBattleOnAction();
        }
        
    } catch (error) {
        console.log('🎮 Simulando juego local');
        
        // Simulación local con cambios dramáticos
        console.log('🎮 Simulando juego local');
        
        // Cambios dramáticos para visualización
        gameState.currentPet.stats.happiness = Math.min(100, gameState.currentPet.stats.happiness + 30);
        gameState.currentPet.stats.energy = Math.max(0, gameState.currentPet.stats.energy - 20);
        gameState.currentPet.stats.hunger = Math.max(0, gameState.currentPet.stats.hunger - 5);
        
        // Agregar monedas
        gameState.userCoins += 3;
        saveLocalCoins();
        updateCoinsDisplay();
        
        // Actualizar display
        updatePetStats();
        updateStatsDisplay();
        
        // Efectos visuales
        updatePetEmojiState();
        createPlayEffect();
        triggerBattleOnAction();
    }
    
    updatePetDisplay();
}

async function feedPet() {
    if (!gameState.currentPet) {
        showNotification('No tienes una mascota para alimentar', 'error');
        return;
    }
    
    console.log('🍖 Alimentando mascota:', gameState.currentPet.name);
    
    try {
        const response = await apiRequest(`/api/pets/${gameState.currentPet.id}/feed`, 'POST');
        
        if (response && response.pet) {
            console.log('✅ Alimentación exitosa via API');
            gameState.currentPet = response.pet;
            
            // Actualizar estadísticas inmediatamente
            updatePetStats();
            updateStatsDisplay();
            updatePetEmojiState();
            
            addCoins(5);
            showNotification('¡Alimentación exitosa!', 'success');
            animatePetAction('eating');
            createFeedEffect();
            
            // Posible batalla espacial
            triggerBattleOnAction();
        }
        
    } catch (error) {
        console.log('🍖 Simulando alimentación local');
        
        // Simulación local con cambios dramáticos
        console.log('🍖 Simulando alimentación local');
        
        // Cambios dramáticos para visualización
        gameState.currentPet.stats.happiness = Math.min(100, gameState.currentPet.stats.happiness + 25);
        gameState.currentPet.stats.hunger = Math.min(100, gameState.currentPet.stats.hunger + 35);
        gameState.currentPet.stats.energy = Math.max(0, gameState.currentPet.stats.energy - 10);
        
        // Agregar monedas
        gameState.userCoins += 5;
        saveLocalCoins();
        updateCoinsDisplay();
        
        // Actualizar display
        updatePetStats();
        updateStatsDisplay();
        
        // Efectos visuales
        updatePetEmojiState();
        createFeedEffect();
        triggerBattleOnAction();
    }
    
    updatePetDisplay();
}

async function sleepPet() {
    if (!gameState.currentPet) {
        showNotification('No tienes una mascota para dormir', 'error');
        return;
    }
    
    console.log('😴 Durmiendo mascota:', gameState.currentPet.name);
    
    try {
        const response = await apiRequest(`/api/pets/${gameState.currentPet.id}/sleep`, 'POST');
        
        if (response && response.pet) {
            console.log('✅ Sueño exitoso via API');
            gameState.currentPet = response.pet;
            
            // Actualizar estadísticas inmediatamente
            updatePetStats();
            updateStatsDisplay();
            
            addCoins(3);
            showNotification('¡Tu mascota durmió! +3 monedas', 'success');
            animatePetAction('sleeping');
        }
        
    } catch (error) {
        console.log('😴 Simulando sueño local');
        
        // Simulación local con cambios dramáticos
        console.log('😴 Simulando sueño local');
        
        // Cambios dramáticos para visualización
        gameState.currentPet.stats.energy = Math.min(100, gameState.currentPet.stats.energy + 40);
        gameState.currentPet.stats.happiness = Math.min(100, gameState.currentPet.stats.happiness + 10);
        gameState.currentPet.stats.hunger = Math.max(0, gameState.currentPet.stats.hunger - 10);
        
        // Agregar monedas
        gameState.userCoins += 3;
        saveLocalCoins();
        updateCoinsDisplay();
        
        // Actualizar display
        updatePetStats();
        updateStatsDisplay();
        
        // Efectos visuales
        updatePetEmojiState();
        createSleepEffect();
        triggerBattleOnAction();
    }
    
    updatePetDisplay();
}

async function curePet() {
    if (!gameState.currentPet) {
        showNotification('No tienes una mascota para curar', 'error');
        return;
    }
    
    console.log('💊 Curando mascota:', gameState.currentPet.name);
    
    try {
        const response = await apiRequest(`/api/pets/${gameState.currentPet.id}/cure`, 'POST');
        
        if (response && response.pet) {
            console.log('✅ Curación exitosa via API');
            gameState.currentPet = response.pet;
            
            // Actualizar estadísticas inmediatamente
            updatePetStats();
            updateStatsDisplay();
            updatePetEmojiState();
            
            addCoins(2);
            showNotification('¡Curaste a tu mascota! +2 monedas', 'success');
            animatePetAction('curing');
            createHealEffect();
            
            // Posible batalla espacial
            triggerBattleOnAction();
        }
        
    } catch (error) {
        console.log('💊 Simulando curación local');
        
        // Simulación local con cambios dramáticos
        console.log('💊 Simulando curación local');
        
        // Cambios dramáticos para visualización
        gameState.currentPet.stats.happiness = Math.min(100, gameState.currentPet.stats.happiness + 20);
        gameState.currentPet.stats.energy = Math.min(100, gameState.currentPet.stats.energy + 30);
        gameState.currentPet.stats.hunger = Math.max(0, gameState.currentPet.stats.hunger - 10);
        gameState.currentPet.stats.cleanliness = Math.min(100, gameState.currentPet.stats.cleanliness + 20);
        
        // Agregar monedas
        gameState.userCoins += 2;
        saveLocalCoins();
        updateCoinsDisplay();
        
        // Actualizar display
        updatePetStats();
        updateStatsDisplay();
        
        // Efectos visuales
        updatePetEmojiState();
        createHealEffect();
        triggerBattleOnAction();
    }
    
    updatePetDisplay();
}

async function cleanPet() {
    if (!gameState.currentPet) {
        showNotification('No tienes una mascota para limpiar', 'error');
        return;
    }
    
    console.log('🧼 Limpiando mascota:', gameState.currentPet.name);
    
    try {
        const response = await apiRequest(`/api/pets/${gameState.currentPet.id}/clean`, 'POST');
        
        if (response && response.pet) {
            console.log('✅ Limpieza exitosa via API');
            gameState.currentPet = response.pet;
            
            // Actualizar estadísticas inmediatamente
            updatePetStats();
            updateStatsDisplay();
            updatePetEmojiState();
            
            addCoins(2);
            showNotification('¡Limpieza exitosa!', 'success');
            animatePetAction('cleaning');
            createCleanEffect();
            
            // Posible batalla espacial
            triggerBattleOnAction();
        }
        
    } catch (error) {
        console.log('🧼 Simulando limpieza local');
        
        // Simulación local con cambios dramáticos
        console.log('🧼 Simulando limpieza local');
        
        // Cambios dramáticos para visualización
        gameState.currentPet.stats.cleanliness = Math.min(100, gameState.currentPet.stats.cleanliness + 40);
        gameState.currentPet.stats.happiness = Math.min(100, gameState.currentPet.stats.happiness + 15);
        gameState.currentPet.stats.energy = Math.max(0, gameState.currentPet.stats.energy - 5);
        
        // Agregar monedas
        gameState.userCoins += 2;
        saveLocalCoins();
        updateCoinsDisplay();
        
        // Actualizar display
        updatePetStats();
        updateStatsDisplay();
        
        // Efectos visuales
        updatePetEmojiState();
        createCleanEffect();
        triggerBattleOnAction();
    }
    
    updatePetDisplay();
}

// Función para animar efectos de limpieza
function animateCleanEffect() {
    // Crear partículas de limpieza
    const petAvatar = document.getElementById('game-pet-avatar');
    if (petAvatar) {
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                createCleanParticle(petAvatar);
            }, i * 100);
        }
    }
    
    // Efecto de brillo en las barras
    const cleanlinessBar = document.getElementById('cleanliness-bar');
    if (cleanlinessBar) {
        cleanlinessBar.style.animation = 'cleanGlow 1s ease-in-out';
        setTimeout(() => {
            cleanlinessBar.style.animation = '';
        }, 1000);
    }
}

// Función para crear partículas de limpieza
function createCleanParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'clean-particle';
    particle.innerHTML = '✨';
    particle.style.cssText = `
        position: absolute;
        font-size: 20px;
        pointer-events: none;
        z-index: 1000;
        animation: cleanParticleFloat 2s ease-out forwards;
    `;
    
    // Posición aleatoria alrededor de la mascota
    const rect = container.getBoundingClientRect();
    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height;
    
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    container.appendChild(particle);
    
    // Remover partícula después de la animación
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 2000);
}

// ==================== FUNCIONES DE NAVEGACIÓN ====================

function showLogin() {
    showScreen('login-screen');
}

function showRegister() {
    showScreen('register-screen');
}

function showGame() {
    showScreen('game-screen');
    showHeader();
    loadLocalCoins();
    updateCoinsDisplay();
    
    // Crear fondo y efectos
    createBackground();
    createParticles();
    
    // Cargar información del héroe y mascota
    loadHeroInfo().then(() => {
        // Después de cargar el héroe, cargar la mascota
        loadPetInfo();
    });
}

function showProfile() {
    showScreen('profile-screen');
    updateHeroDisplay();
}

function showShop() {
    showScreen('shop-screen');
    loadShopItems();
}

function showWardrobe() {
    showScreen('wardrobe-screen');
    loadWardrobeItems(); // Recargar items para mostrar estado actual
    console.log('👕 Guardarropa abierto, accesorios actuales:', gameState.petAccessories);
}

function showPetScreen() {
    showScreen('pet-screen');
}

function showHeader() {
    const header = document.querySelector('.header');
    if (header) {
        header.classList.remove('hidden');
    }
}

// ==================== FUNCIONES DE TIENDA ====================

async function loadShopItems() {
    try {
        // Items gratuitos (recompensas diarias)
        const freeItems = [
            { id: 1, name: 'Comida Básica', description: 'Restaura 10 puntos de hambre', price: 0, icon: '🍖', type: 'food' },
            { id: 2, name: 'Pelota Simple', description: 'Aumenta 5 puntos de felicidad', price: 0, icon: '⚽', type: 'toy' },
            { id: 3, name: 'Cepillo', description: 'Aumenta 10 puntos de limpieza', price: 0, icon: '🪮', type: 'grooming' }
        ];
        
        // Items premium (comprados con monedas)
        const premiumItems = [
            { id: 4, name: 'Comida Premium', description: 'Restaura 25 puntos de hambre', price: 25, icon: '🥩', type: 'food' },
            { id: 5, name: 'Consola de Juegos', description: 'Aumenta 20 puntos de felicidad', price: 50, icon: '🎮', type: 'toy' },
            { id: 6, name: 'Juguete Mágico', description: 'Aumenta 15 puntos de felicidad y energía', price: 75, icon: '✨', type: 'toy' },
            { id: 7, name: 'Comida Gourmet', description: 'Restaura 40 puntos de hambre', price: 100, icon: '🍖', type: 'food' },
            { id: 8, name: 'Cama Premium', description: 'Aumenta 30 puntos de energía', price: 150, icon: '🛏️', type: 'furniture' }
        ];
        
        renderShopItems('free-section', freeItems);
        renderShopItems('premium-section', premiumItems);
        
        console.log('🛍️ Tienda cargada con items gratuitos y premium');
        
    } catch (error) {
        console.error('❌ Error al cargar la tienda:', error);
        showNotification('Error al cargar la tienda', 'error');
    }
}

function renderShopItems(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = items.map(item => `
        <div class="shop-item">
            <div class="item-icon">${item.icon}</div>
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
            </div>
            <button class="buy-btn ${item.price === 0 ? 'free' : 'premium'}" 
                    onclick="buyItem(${item.id}, ${item.price})">
                ${item.price === 0 ? 'Gratis' : `${item.price} 💰`}
            </button>
        </div>
    `).join('');
}

function showShopSection(section) {
    // Ocultar todas las secciones
    document.querySelectorAll('.shop-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
    
    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(`${section}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Activar la pestaña correspondiente
    const targetTab = event.target;
    if (targetTab) {
        targetTab.classList.add('active');
    }
}

async function buyItem(itemId, price) {
    if (price === 0) {
        // Items gratuitos
        await applyItemEffect(itemId);
        showNotification('¡Item gratuito obtenido!', 'success');
        return;
    }
    
    if (!spendCoins(price)) {
        showNotification(`No tienes suficientes monedas. Necesitas ${price} monedas.`, 'error');
        return;
    }
    
    try {
        // Aplicar efecto del item a la mascota
        await applyItemEffect(itemId);
        
        showNotification(`¡Item comprado exitosamente! -${price} monedas`, 'success');
        
    } catch (error) {
        console.error('❌ Error al comprar item:', error);
        showNotification('Error al comprar el item', 'error');
    }
}

async function applyItemEffect(itemId) {
    if (!gameState.currentPet) {
        showNotification('No tienes una mascota para usar el item', 'error');
        return;
    }
    
    try {
        // Aquí implementarías el uso del item con tu API
        // Por ahora, simulamos el efecto
        const effects = {
            1: { hunger: -10 }, // Comida Básica
            2: { happiness: 5 }, // Pelota Simple
            3: { cleanliness: 10 }, // Cepillo
            4: { hunger: -25 }, // Comida Premium
            5: { happiness: 20 }, // Consola de Juegos
            6: { happiness: 15, energy: 15 }, // Juguete Mágico
            7: { hunger: -40 }, // Comida Gourmet
            8: { energy: 30 } // Cama Premium
        };
        
        const effect = effects[itemId];
        if (effect) {
            // Aplicar efecto a las estadísticas de la mascota
            if (!gameState.currentPet.stats) {
                gameState.currentPet.stats = { happiness: 80, hunger: 60, energy: 70, cleanliness: 90 };
            }
            
            Object.keys(effect).forEach(stat => {
                if (effect[stat] > 0) {
                    gameState.currentPet.stats[stat] = Math.min(100, gameState.currentPet.stats[stat] + effect[stat]);
                } else {
                    gameState.currentPet.stats[stat] = Math.max(0, gameState.currentPet.stats[stat] + effect[stat]);
                }
            });
            
            updatePetDisplay();
            showNotification('¡Efecto del item aplicado!', 'success');
        }
        
    } catch (error) {
        console.error('❌ Error aplicando efecto del item:', error);
        showNotification('Error al usar el item', 'error');
    }
}

// ==================== FUNCIONES DE GUARDARROPA ====================

async function loadWardrobeItems() {
    try {
        const accessories = [
            { id: 1, name: 'Collar', type: 'neck', icon: '🦮' },
            { id: 2, name: 'Sombrero', type: 'head', icon: '🎩' },
            { id: 3, name: 'Gafas', type: 'face', icon: '👓' },
            { id: 4, name: 'Capa', type: 'back', icon: '🦸' },
            { id: 5, name: 'Corona', type: 'head', icon: '👑' },
            { id: 6, name: 'Lentes', type: 'face', icon: '🕶️' },
            { id: 7, name: 'Mochila', type: 'back', icon: '🎒' },
            { id: 8, name: 'Corbata', type: 'neck', icon: '👔' },
            { id: 9, name: 'Gorro', type: 'head', icon: '🎧' },
            { id: 10, name: 'Máscara', type: 'face', icon: '🎭' },
            { id: 11, name: 'Alas', type: 'back', icon: '🦋' },
            { id: 12, name: 'Pulsera', type: 'neck', icon: '💎' }
        ];
        
        renderWardrobeItems(accessories);
        
    } catch (error) {
        console.error('❌ Error al cargar guardarropa:', error);
    }
}

function renderWardrobeItems(accessories) {
    const container = document.getElementById('accessory-grid');
    if (!container) return;
    
    container.innerHTML = accessories.map(accessory => {
        const isEquipped = gameState.petAccessories && gameState.petAccessories.find(item => item.id === accessory.id);
        const equippedClass = isEquipped ? 'equipped' : '';
        const equippedText = isEquipped ? ' (Equipado)' : '';
        
        return `
            <div class="accessory-item ${equippedClass}" onclick="equipAccessory(${accessory.id})">
                <div class="accessory-icon">${accessory.icon}</div>
                <div class="accessory-name">${accessory.name}${equippedText}</div>
                <div class="equip-status">${isEquipped ? '✅' : '➕'}</div>
            </div>
        `;
    }).join('');
}

async function equipAccessory(accessoryId) {
    try {
        console.log('👕 Equipando accesorio:', accessoryId);
        
        // Definir los accesorios disponibles
        const accessories = {
            1: { id: 1, name: 'Collar', type: 'neck', icon: '🦮' },
            2: { id: 2, name: 'Sombrero', type: 'head', icon: '🎩' },
            3: { id: 3, name: 'Gafas', type: 'face', icon: '👓' },
            4: { id: 4, name: 'Capa', type: 'back', icon: '🦸' },
            5: { id: 5, name: 'Corona', type: 'head', icon: '👑' },
            6: { id: 6, name: 'Lentes', type: 'face', icon: '🕶️' },
            7: { id: 7, name: 'Mochila', type: 'back', icon: '🎒' },
            8: { id: 8, name: 'Corbata', type: 'neck', icon: '👔' },
            9: { id: 9, name: 'Gorro', type: 'head', icon: '🎧' },
            10: { id: 10, name: 'Máscara', type: 'face', icon: '🎭' },
            11: { id: 11, name: 'Alas', type: 'back', icon: '🦋' },
            12: { id: 12, name: 'Pulsera', type: 'neck', icon: '💎' }
        };
        
        const accessory = accessories[accessoryId];
        if (!accessory) {
            console.error('❌ Accesorio no encontrado:', accessoryId);
            return;
        }
        
        // Inicializar array de accesorios si no existe
        if (!gameState.petAccessories) {
            gameState.petAccessories = [];
        }
        
        // Verificar si ya está equipado
        const alreadyEquipped = gameState.petAccessories.find(item => item.id === accessoryId);
        if (alreadyEquipped) {
            // Desequipar
            gameState.petAccessories = gameState.petAccessories.filter(item => item.id !== accessoryId);
            showNotification(`¡${accessory.name} desequipado!`, 'success');
        } else {
            // Equipar
            gameState.petAccessories.push(accessory);
            showNotification(`¡${accessory.name} equipado!`, 'success');
        }
        
        // Guardar en localStorage
        localStorage.setItem('petAccessories', JSON.stringify(gameState.petAccessories));
        
        // Actualizar visualmente
        updatePetAccessories();
        
        console.log('✅ Accesorios actuales:', gameState.petAccessories);
        
    } catch (error) {
        console.error('❌ Error equipando accesorio:', error);
        showNotification('Error al equipar accesorio', 'error');
    }
}

// ==================== FUNCIONES DE CREACIÓN ====================

async function createHero(heroData) {
    try {
        showLoading();
        
        console.log('🎯 Intentando crear superhéroe con datos:', heroData);
        console.log('🌐 URL de la API:', window.getAPIUrl());
        
        const response = await apiRequest('/api/heroes', 'POST', heroData);
        
        if (response.id) {
            console.log('✅ Superhéroe creado exitosamente:', response);
            
            // Hacer login automático
            console.log('🔐 Haciendo login automático...');
            const loginResponse = await apiRequest('/api/login', 'POST', {
                name: heroData.name,
                password: heroData.password
            });
            
            if (loginResponse.token) {
                gameState.token = loginResponse.token;
                gameState.currentHero = response;
                
                localStorage.setItem('jwtToken', loginResponse.token);
                localStorage.setItem('loggedInHeroName', heroData.name);
                
                console.log('✅ Login automático exitoso, token obtenido');
                
                showNotification('¡Superhéroe creado y login exitoso!', 'success');
                showGame();
            }
        }
        
    } catch (error) {
        console.error('❌ Error detallado al crear superhéroe:', error);
        showNotification('Error al crear el superhéroe. Verifica los datos.', 'error');
    } finally {
        hideLoading();
    }
}

async function adoptPet(petData) {
    try {
        showLoading();
        
        console.log('🐾 Adoptando mascota con token:', gameState.token ? 'SÍ' : 'NO');
        
        // Crear la mascota
        const createResponse = await apiRequest('/api/pets', 'POST', petData);
        console.log('✅ Mascota creada con ID:', createResponse.id);
        
        // Adoptar la mascota
        console.log('🔗 Adoptando mascota con ID:', createResponse.id);
        const adoptResponse = await apiRequest(`/api/pets/${createResponse.id}/adopt`, 'POST');
        console.log('✅ Mascota adoptada exitosamente:', adoptResponse);
        
        gameState.currentPet = adoptResponse;
        
        showNotification('¡Mascota adoptada exitosamente!', 'success');
        showGame();
        
    } catch (error) {
        console.error('❌ Error al adoptar mascota:', error);
        showNotification('Error al adoptar la mascota', 'error');
    } finally {
        hideLoading();
    }
}

// ==================== FUNCIONES DE REINICIO ====================

function resetGame() {
    localStorage.removeItem('loggedInHeroName');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userCoins');
    localStorage.removeItem('ownedItems');
    localStorage.removeItem('petAccessories');

    // Limpiar gameState
    gameState = {
        currentHero: null,
        currentPet: null,
        token: null,
        userCoins: 0,
        petAccessories: [],
        ownedItems: []
    };

    // Mostrar pantalla de login
    showScreen('login-screen');
    console.log('🔄 Juego reiniciado - Pantalla de login mostrada');
}

// ==================== FUNCIONES DE ANIMACIÓN ====================

function animatePetAction(action) {
    const petSprite = document.querySelector('#game-pet-avatar .pet-sprite');
    if (!petSprite) return;
    
    petSprite.classList.add(action);
    
    setTimeout(() => {
        petSprite.classList.remove(action);
    }, 2000);
}

function createParticles() {
    const container = document.querySelector('#game-pet-avatar');
    if (!container) return;
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 0.5 + 's';
        container.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 2000);
    }
}

function animateHeroAction(action) {
    const heroSprite = document.querySelector('#profile-hero-avatar .hero-sprite');
    if (!heroSprite) return;
    
    heroSprite.classList.add(action);
    
    setTimeout(() => {
        heroSprite.classList.remove(action);
    }, 2000);
}

// ==================== FUNCIONES DE ESTADÍSTICAS ====================

function updateStatsDisplay() {
    if (!gameState.currentPet || !gameState.currentPet.stats) {
        console.log('⚠️ No hay estadísticas para mostrar');
        return;
    }
    
    const stats = gameState.currentPet.stats;
    console.log('📊 Actualizando display de estadísticas:', stats);
    
    // Mapear barras de estadísticas
    const statBars = {
        'happiness': { bar: 'happiness-bar', value: 'happiness-value' },
        'hunger': { bar: 'hunger-bar', value: 'hunger-value' },
        'energy': { bar: 'energy-bar', value: 'energy-value' },
        'cleanliness': { bar: 'cleanliness-bar', value: 'cleanliness-value' }
    };
    
    // Actualizar cada barra inmediatamente
    Object.entries(statBars).forEach(([statName, elements]) => {
        const barElement = document.getElementById(elements.bar);
        const valueElement = document.getElementById(elements.value);
        
        if (barElement && valueElement) {
            const currentValue = stats[statName] || 0;
            const percentage = Math.max(0, Math.min(100, currentValue));
            
            // Obtener el valor anterior para comparar
            const previousWidth = barElement.style.width || '0%';
            const previousPercentage = parseInt(previousWidth) || 0;
            
            console.log(`📊 ${statName}: ${previousPercentage}% → ${percentage}%`);
            
            // Actualizar inmediatamente
            barElement.style.width = percentage + '%';
            valueElement.textContent = Math.round(percentage) + '%';
            
            // Agregar clase de animación temporal
            barElement.classList.add('changing');
            valueElement.classList.add('changing');
            
            // Remover clase después de un tiempo
            setTimeout(() => {
                barElement.classList.remove('changing');
                valueElement.classList.remove('changing');
            }, 500);
            
            console.log(`✅ ${statName} actualizada: ${percentage}%`);
        }
    });
    
    // Actualizar estado de salud después de un pequeño delay
    setTimeout(() => {
        updateHealthStatus();
    }, 300);
}

function updatePetAccessories() {
    if (!gameState.currentPet) return;
    
    console.log('👕 Actualizando accesorios de la mascota');
    
    // Obtener el contenedor de la mascota
    const petContainer = document.querySelector('#game-pet-avatar');
    if (!petContainer) return;
    
    // Limpiar accesorios existentes
    const existingAccessories = petContainer.querySelectorAll('.pet-accessory');
    existingAccessories.forEach(acc => acc.remove());
    
    // Obtener items equipados
    const equippedItems = gameState.petAccessories || [];
    console.log('👕 Items equipados:', equippedItems);
    
    // Crear elementos visuales para cada accesorio
    equippedItems.forEach((item, index) => {
        const accessoryElement = document.createElement('div');
        accessoryElement.className = 'pet-accessory';
        accessoryElement.style.position = 'absolute';
        accessoryElement.style.top = '0';
        accessoryElement.style.left = '0';
        accessoryElement.style.width = '100%';
        accessoryElement.style.height = '100%';
        accessoryElement.style.pointerEvents = 'none';
        accessoryElement.style.zIndex = '10';
        accessoryElement.style.display = 'flex';
        accessoryElement.style.alignItems = 'center';
        accessoryElement.style.justifyContent = 'center';
        
        // Posicionar accesorios según su tipo
        let position = '';
        let size = 'font-size: 25px;';
        
        switch(item.type) {
            case 'head':
                position = 'top: -15px; left: 50%; transform: translateX(-50%);';
                size = 'font-size: 30px;';
                break;
            case 'neck':
                position = 'bottom: 5px; left: 50%; transform: translateX(-50%);';
                size = 'font-size: 28px;';
                break;
            case 'face':
                position = 'top: 50%; left: 50%; transform: translate(-50%, -50%);';
                size = 'font-size: 35px;';
                break;
            case 'back':
                position = 'top: 0; right: -15px;';
                size = 'font-size: 32px;';
                break;
            default:
                position = 'top: 50%; left: 50%; transform: translate(-50%, -50%);';
                size = 'font-size: 30px;';
        }
        
        accessoryElement.style.cssText += position;
        
        // Agregar el emoji del item con efecto neon mejorado
        accessoryElement.innerHTML = `
            <div style="
                ${size}
                text-shadow: 0 0 15px rgba(0, 255, 255, 0.8);
                filter: drop-shadow(0 0 8px rgba(0, 255, 255, 0.6));
                animation: accessoryGlow 2s ease-in-out infinite alternate;
            ">${item.icon || '🎁'}</div>
        `;
        
        petContainer.appendChild(accessoryElement);
        console.log('✅ Accesorio agregado:', item.name, 'en posición:', position);
    });
    
    if (equippedItems.length > 0) {
        console.log('🎨 Total de accesorios equipados:', equippedItems.length);
    }
}

function clearPetDisplay() {
    console.log('🧹 Limpiando display de mascota');
    
    // Limpiar nombre
    const nameElement = document.getElementById('pet-name-display');
    if (nameElement) {
        nameElement.textContent = '';
        nameElement.style.display = 'none';
    }
    
    // Limpiar avatar
    const petAvatar = document.getElementById('game-pet-avatar');
    if (petAvatar) {
        petAvatar.innerHTML = '';
        petAvatar.style.display = 'none';
    }
    
    // Limpiar estado de salud
    const statusElement = document.getElementById('pet-status');
    if (statusElement) {
        statusElement.textContent = '';
        statusElement.style.display = 'none';
    }
    
    // Limpiar barras de estadísticas
    const statBars = ['happiness', 'hunger', 'energy', 'cleanliness'];
    statBars.forEach(stat => {
        const barElement = document.getElementById(`${stat}-bar`);
        const valueElement = document.getElementById(`${stat}-value`);
        if (barElement) barElement.style.width = '0%';
        if (valueElement) valueElement.textContent = '0%';
    });
    
    console.log('✅ Display de mascota limpiado');
}

// ==================== FUNCIONES GLOBALES ====================

// Hacer funciones disponibles globalmente
window.showLogin = showLogin;
window.showRegister = showRegister;
window.showGame = showGame;
window.showProfile = showProfile;
window.showShop = showShop;
window.showWardrobe = showWardrobe;
window.showPetScreen = showPetScreen;
window.logout = logout;
window.playWithPet = playWithPet;
window.feedPet = feedPet;
window.sleepPet = sleepPet;
window.curePet = curePet;
window.cleanPet = cleanPet;
window.showShopSection = showShopSection;
window.buyItem = buyItem;
window.equipAccessory = equipAccessory;
window.checkAvailableEndpoints = checkAvailableEndpoints;
window.resetGame = resetGame;
window.testAPIDirectly = testAPIDirectly;

// ==================== INICIALIZACIÓN ====================

function initializeGame() {
    console.log('🎮 Inicializando juego...');
    
    // Cargar configuración guardada
    const savedCoins = localStorage.getItem('userCoins');
    if (savedCoins) {
        gameState.userCoins = parseInt(savedCoins);
        console.log('💰 Monedas cargadas desde localStorage:', gameState.userCoins);
    }
    
    // Cargar accesorios guardados
    const savedAccessories = localStorage.getItem('petAccessories');
    if (savedAccessories) {
        gameState.petAccessories = JSON.parse(savedAccessories);
        console.log('👕 Accesorios cargados:', gameState.petAccessories);
    }
    
    // Cargar héroe guardado
    const loggedInHeroName = localStorage.getItem('loggedInHeroName');
    if (loggedInHeroName) {
        console.log('🦸 Cargando héroe guardado:', loggedInHeroName);
        loadHeroInfo(loggedInHeroName);
    }
    
    // Inicializar barras de estadísticas con valores por defecto
    initializeStatBars();
    
    // Verificar conexión con API
    checkAPIConnection();
    
    // Verificar endpoints disponibles
    setTimeout(() => {
        checkAvailableEndpoints();
    }, 1000);
    
    console.log('✅ Juego inicializado correctamente');
}

// Función para inicializar las barras de estadísticas
function initializeStatBars() {
    console.log('📊 Inicializando barras de estadísticas...');
    
    const defaultStats = {
        happiness: 80,
        hunger: 60,
        energy: 70,
        cleanliness: 90
    };
    
    // Actualizar barras con valores por defecto
    const statBars = {
        'happiness': { bar: 'happiness-bar', value: 'happiness-value' },
        'hunger': { bar: 'hunger-bar', value: 'hunger-value' },
        'energy': { bar: 'energy-bar', value: 'energy-value' },
        'cleanliness': { bar: 'cleanliness-bar', value: 'cleanliness-value' }
    };
    
    Object.entries(statBars).forEach(([statName, elements]) => {
        const barElement = document.getElementById(elements.bar);
        const valueElement = document.getElementById(elements.value);
        
        if (barElement && valueElement) {
            const value = defaultStats[statName] || 0;
            barElement.style.width = value + '%';
            valueElement.textContent = value + '%';
            console.log(`✅ ${statName} inicializada: ${value}%`);
        }
    });
}

// ==================== EVENT LISTENERS ====================

document.addEventListener('DOMContentLoaded', function() {
    // Probar conexión con la API al cargar
    testAPIConnection();
    
    // Login form
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('login-name').value;
        const password = document.getElementById('login-password').value;
        await login(name, password);
    });
    
    // Register form
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const heroData = {
            name: document.getElementById('register-name').value,
            alias: document.getElementById('register-alias').value,
            city: document.getElementById('register-city').value,
            team: document.getElementById('register-team').value,
            password: document.getElementById('register-password').value
        };
        await createHero(heroData);
    });
    
    // Hero creation
    document.getElementById('create-hero-btn').addEventListener('click', async () => {
        const heroData = {
            name: document.getElementById('hero-name').value,
            alias: document.getElementById('hero-alias').value,
            city: document.getElementById('hero-city').value,
            team: document.getElementById('hero-team').value
        };
        await createHero(heroData);
    });
    
    // Pet adoption
    document.getElementById('adopt-pet-btn').addEventListener('click', async () => {
        const petData = {
            name: document.getElementById('pet-name').value,
            type: document.getElementById('pet-type').value,
            superPower: document.getElementById('pet-superpower').value,
            ownerId: gameState.currentHero ? gameState.currentHero.name : 'default'
        };
        await adoptPet(petData);
    });
    
    // Color selectors
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            const color = this.dataset.color;
            const preview = this.closest('.hero-creator') ? 
                document.getElementById('hero-preview') : 
                document.getElementById('pet-preview');
            
            if (preview) {
                const body = preview.querySelector('.hero-body, .pet-body');
                if (body) {
                    body.style.background = color;
                }
            }
        });
    });
    
    // Inicializar el juego
    initializeGame();
});

// ==================== EFECTOS VISUALES ====================

function createParticles() {
    const container = document.createElement('div');
    container.className = 'particles-container';
    document.body.appendChild(container);
    
    // Crear partículas flotantes
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createParticle(container);
        }, i * 300);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Posición aleatoria
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    
    container.appendChild(particle);
    
    // Remover partícula después de la animación
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 6000);
}

function createActionEffect(type, x, y) {
    const effect = document.createElement('div');
    effect.className = `action-effect ${type}-effect`;
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    
    document.body.appendChild(effect);
    
    // Remover efecto después de la animación
    setTimeout(() => {
        if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    }, 1200);
}

function updatePetEmojiState() {
    if (!gameState.currentPet || !gameState.currentPet.stats) return;
    
    const emojiElement = document.querySelector('.pet-emoji');
    if (!emojiElement) return;
    
    const stats = gameState.currentPet.stats;
    const healthScore = (stats.happiness + (100 - stats.hunger) + stats.energy + stats.cleanliness) / 4;
    
    // Remover clases anteriores
    emojiElement.classList.remove('happy', 'sick', 'energetic');
    
    // Aplicar clase según el estado
    if (healthScore >= 80) {
        emojiElement.classList.add('happy');
    } else if (healthScore < 50) {
        emojiElement.classList.add('sick');
    } else if (stats.energy > 80) {
        emojiElement.classList.add('energetic');
    }
}

function createBackground() {
    // Crear fondo con gradiente
    const background = document.createElement('div');
    background.className = 'game-background';
    document.body.insertBefore(background, document.body.firstChild);
    
    // Crear estrellas
    const stars = document.createElement('div');
    stars.className = 'stars';
    document.body.insertBefore(stars, background.nextSibling);
}

function createHealEffect() {
    const petAvatar = document.getElementById('game-pet-avatar');
    if (petAvatar) {
        const rect = petAvatar.getBoundingClientRect();
        createActionEffect('heal', rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
}

function createFeedEffect() {
    const petAvatar = document.getElementById('game-pet-avatar');
    if (petAvatar) {
        const rect = petAvatar.getBoundingClientRect();
        createActionEffect('feed', rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
}

function createPlayEffect() {
    const petAvatar = document.getElementById('game-pet-avatar');
    if (petAvatar) {
        const rect = petAvatar.getBoundingClientRect();
        createActionEffect('play', rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
}

function createCleanEffect() {
    const petAvatar = document.getElementById('game-pet-avatar');
    if (petAvatar) {
        const rect = petAvatar.getBoundingClientRect();
        createActionEffect('clean', rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
}

function createSleepEffect() {
    const petAvatar = document.getElementById('game-pet-avatar');
    if (petAvatar) {
        const rect = petAvatar.getBoundingClientRect();
        createActionEffect('sleep', rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
}

// ==================== BATALLA ESPACIAL ====================

function createSpaceBattle() {
    const battleContainer = document.createElement('div');
    battleContainer.className = 'battle-container';
    document.body.appendChild(battleContainer);
    
    // Crear estrellas de batalla
    for (let i = 0; i < 50; i++) {
        createBattleStar(battleContainer);
    }
    
    // Crear naves espaciales
    setTimeout(() => createSpaceship('ally'), 1000);
    setTimeout(() => createSpaceship('enemy'), 3000);
    
    // Iniciar batalla
    setTimeout(() => startBattle(), 5000);
}

function createBattleStar(container) {
    const star = document.createElement('div');
    star.className = 'battle-star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 2 + 's';
    
    container.appendChild(star);
}

function createSpaceship(type) {
    const spaceship = document.createElement('div');
    spaceship.className = `spaceship ${type === 'enemy' ? 'enemy' : ''}`;
    spaceship.style.top = Math.random() * 50 + 25 + '%';
    
    document.body.appendChild(spaceship);
    
    // Remover nave después de la animación
    setTimeout(() => {
        if (spaceship.parentNode) {
            spaceship.parentNode.removeChild(spaceship);
        }
    }, 8000);
}

function startBattle() {
    // Crear múltiples naves
    for (let i = 0; i < 3; i++) {
        setTimeout(() => createSpaceship('ally'), i * 2000);
        setTimeout(() => createSpaceship('enemy'), i * 2000 + 1000);
    }
    
    // Disparar láseres
    setTimeout(() => shootLasers(), 3000);
}

function shootLasers() {
    // Disparar láseres aleatorios
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createLaser(Math.random() * window.innerWidth, Math.random() * window.innerHeight, Math.random() > 0.5);
        }, i * 500);
    }
    
    // Crear explosiones
    setTimeout(() => createExplosions(), 2000);
}

function createLaser(x, y, isEnemy = false) {
    const laser = document.createElement('div');
    laser.className = `laser ${isEnemy ? 'enemy' : ''}`;
    laser.style.left = x + 'px';
    laser.style.top = y + 'px';
    
    document.body.appendChild(laser);
    
    // Remover láser después de la animación
    setTimeout(() => {
        if (laser.parentNode) {
            laser.parentNode.removeChild(laser);
        }
    }, 800);
}

function createExplosions() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const explosion = document.createElement('div');
            explosion.className = 'explosion';
            explosion.style.left = Math.random() * window.innerWidth + 'px';
            explosion.style.top = Math.random() * window.innerHeight + 'px';
            
            document.body.appendChild(explosion);
            
            // Crear escombros
            createDebris(explosion.style.left, explosion.style.top);
            
            // Remover explosión
            setTimeout(() => {
                if (explosion.parentNode) {
                    explosion.parentNode.removeChild(explosion);
                }
            }, 1000);
        }, i * 300);
    }
}

function createDebris(x, y) {
    for (let i = 0; i < 8; i++) {
        const debris = document.createElement('div');
        debris.className = 'battle-debris';
        debris.style.left = x;
        debris.style.top = y;
        debris.style.animationDelay = Math.random() * 0.5 + 's';
        
        document.body.appendChild(debris);
        
        // Remover escombro
        setTimeout(() => {
            if (debris.parentNode) {
                debris.parentNode.removeChild(debris);
            }
        }, 3000);
    }
}

function createVictoryEffect() {
    const victory = document.createElement('div');
    victory.className = 'victory-effect';
    victory.textContent = '🚀';
    
    document.body.appendChild(victory);
    
    // Remover efecto de victoria
    setTimeout(() => {
        if (victory.parentNode) {
            victory.parentNode.removeChild(victory);
        }
    }, 2000);
}

function triggerSpaceBattle() {
    console.log('🚀 Iniciando batalla espacial...');
    createSpaceBattle();
    
    // Efecto de victoria después de la batalla
    setTimeout(() => {
        createVictoryEffect();
        showNotification('¡Batalla espacial completada! 🚀', 'success');
    }, 15000);
}

// Función para activar la batalla espacial cuando se hace una acción
function triggerBattleOnAction() {
    // 20% de probabilidad de que ocurra una batalla espacial
    if (Math.random() < 0.2) {
        setTimeout(() => {
            triggerSpaceBattle();
        }, 2000);
    }
}
