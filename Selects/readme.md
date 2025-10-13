# 📍 Proyecto Dropdowns Dependientes

Aplicación web con dropdowns dependientes (País → Ciudad → Localidad) usando React, Node.js, Express y PostgreSQL.

---

## 📦 Requisitos Previos

- Node.js (versión 16+): https://nodejs.org/
- PostgreSQL (versión 12+): https://www.postgresql.org/download/
- Editor de código (VS Code recomendado)

---

## 🚀 Pasos de Instalación

### 1. Descargar el proyecto
```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
```

### 2. Instalar dependencias del Backend
```bash
cd backend
npm install
```

### 3. Instalar dependencias del Frontend
```bash
cd ../frontend
npm install
```

### 4. Crear la base de datos en PostgreSQL

Abre pgAdmin o psql y ejecuta el script : `postgressDB.sql`



### 5. Configurar variables de entorno

Crea el archivo `server/.env` con tus credenciales:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=dropdowns_db
PORT=8080
```

### 6. Iniciar el Backend

Abre una terminal en la carpeta `backend/`:
```bash
npm start
```

Deberías ver: `Servidor corriendo en http://localhost:8080`

### 7. Iniciar el Frontend

Abre **otra terminal** en la carpeta `frontend/`:
```bash
npm start
```

Se abrirá automáticamente en `http://localhost:3000`

### 8. ¡Probar la aplicación!

- Selecciona un país
- Selecciona una ciudad
- Selecciona una localidad
- Observa el resumen de tu selección

---

## 🧪 Probar Endpoints (Postman)

- `GET http://localhost:8080/api/health`
- `GET http://localhost:8080/api/countries`
- `GET http://localhost:8080/api/cities/1`
- `GET http://localhost:8080/api/localities/1`

---

## ❗ Problemas Comunes

**Error de conexión a BD:**
- Verifica que PostgreSQL esté corriendo
- Revisa credenciales en `.env`

**"Cannot find module":**
```bash
cd backend
npm install
```

**"Port already in use":**
- Cambia el puerto en `backend/.env`

**Dropdowns deshabilitados:**
- Verifica que el backend esté corriendo
- Abre la consola del navegador (F12) para ver errores

---

## 📁 Estructura del Proyecto

```
proyecto-dropdowns/
├── frontend/         # React app
│   ├── src/
│   └── package.json
├── backend/          # Node.js API
│   ├── server.js
│   ├── .env
│   └── package.json
└── README.md
```

---

## ⏱️ Tiempo Estimado

- Instalación: 5 minutos
- Configuración BD: 10 minutos
- Configuración .env: 5 minutos
- **Total: ~20 minutos**

---

¡Listo! 🎉