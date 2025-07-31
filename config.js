// Configuración del juego para diferentes entornos
const CONFIG = {
    // URLs de la API
    API_URLS: {
        production: 'https://api-superheroes-v2-1.onrender.com',
        development: 'http://localhost:3001',
        staging: 'http://localhost:3001' // Para pruebas
    },
    
    // Detectar entorno
    getCurrentEnvironment() {
        // Siempre usar producción para evitar problemas de CORS
        return 'production';
    },
    
    // Obtener URL de API según entorno
    getAPIUrl() {
        const env = this.getCurrentEnvironment();
        return this.API_URLS[env] || this.API_URLS.production;
    },
    
    // Configuración de CORS
    CORS_CONFIG: {
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    },
    
    // Configuración de Swagger
    SWAGGER_URLS: {
        production: 'https://api-superheroes-v2-1.onrender.com/api-docs',
        development: 'http://localhost:3001/api-docs',
        staging: 'http://localhost:3001/api-docs'
    },
    
    // Obtener URL de Swagger
    getSwaggerUrl() {
        const env = this.getCurrentEnvironment();
        return this.SWAGGER_URLS[env] || this.SWAGGER_URLS.production;
    },
    
    // Configuración de puertos
    PORTS: {
        development: 3001,
        game: 8080 // Puerto para servir el juego localmente
    },
    
    // Configuración de debugging
    DEBUG: {
        enabled: true,
        showAPICalls: true,
        showErrors: true,
        logLevel: 'info' // 'debug', 'info', 'warn', 'error'
    },
    
    // Función para abrir Swagger en nueva pestaña
    openSwagger() {
        const swaggerUrl = this.getSwaggerUrl();
        window.open(swaggerUrl, '_blank');
    },
    
    // Función para verificar conflictos de puertos
    checkPortConflicts() {
        const currentPort = window.location.port;
        const apiPort = this.PORTS.development;
        
        if (currentPort === apiPort.toString()) {
            console.warn('⚠️ Posible conflicto: El juego y la API están en el mismo puerto');
            return true;
        }
        
        return false;
    },
    
    // Función para mostrar información de configuración
    showConfigInfo() {
        const env = this.getCurrentEnvironment();
        const apiUrl = this.getAPIUrl();
        const swaggerUrl = this.getSwaggerUrl();
        
        console.log('🔧 Configuración del Juego:');
        console.log(`   Entorno: ${env}`);
        console.log(`   API URL: ${apiUrl}`);
        console.log(`   Swagger URL: ${swaggerUrl}`);
        console.log(`   Puerto actual: ${window.location.port || '80/443'}`);
        console.log(`   Puerto API: ${this.PORTS.development}`);
        
        if (this.checkPortConflicts()) {
            console.warn('   ⚠️  Posible conflicto de puertos detectado');
        }
    }
};

// Exportar configuración globalmente
window.CONFIG = CONFIG;

// Función para abrir Swagger desde el juego
window.openSwagger = function() {
    CONFIG.openSwagger();
};

// Función para mostrar información de configuración
window.showConfigInfo = function() {
    CONFIG.showConfigInfo();
};

// Función global para obtener URL de API
window.getAPIUrl = function() {
    return CONFIG.getAPIUrl();
};

console.log('⚙️ Configuración cargada correctamente');
CONFIG.showConfigInfo(); 