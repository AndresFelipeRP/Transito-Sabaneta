# 🚦 Sistema de Tránsito de Sabaneta

Sistema web desarrollado para la **Secretaría de Tránsito de Sabaneta** que permite gestionar matrículas, propietarios, vehículos e infracciones de tránsito, implementando el patrón de arquitectura **Modelo Vista Controlador (MVC)**.

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Arquitectura MVC](#arquitectura-mvc)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Base de Datos](#base-de-datos)
- [Funcionalidades](#funcionalidades)
- [Instalación](#instalación)
- [Uso](#uso)
- [Capturas](#capturas)
- [Autor](#autor)

---

## 📌 Descripción

Este proyecto fue desarrollado como solución a un requerimiento académico donde se solicita implementar un sistema web con patrón MVC y base de datos relacional. El sistema permite:

- Registrar propietarios de vehículos (personas o empresas)
- Gestionar vehículos y sus matrículas
- Registrar infracciones de tránsito detectadas por agentes o cámaras
- Generar reportes en pantalla y exportarlos a PDF
- Visualizar estadísticas con gráficas interactivas

---

## 🛠️ Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Node.js | v24+ | Entorno de ejecución |
| Express.js | 4.x | Framework servidor web |
| EJS | 3.x | Motor de vistas (plantillas HTML) |
| MySQL | 8.0 | Base de datos relacional |
| mysql2 | 3.x | Conector Node.js ↔ MySQL |
| PDFKit | 0.x | Generación de reportes PDF |
| Chart.js | CDN | Gráficas estadísticas |
| CSS3 | — | Estilos personalizados |

---

## 🏗️ Arquitectura MVC

```
Cliente (Navegador)
       │
       ▼
   [ Rutas ]          → Dirigen las peticiones HTTP
       │
       ▼
[ Controladores ]     → Lógica de negocio
       │
       ▼
  [ Modelos ]         → Consultas a la base de datos
       │
       ▼
  [ MySQL BD ]        → Persistencia de datos
       │
       ▼
   [ Vistas ]         → Presentación HTML con EJS
```

---

## 📁 Estructura del Proyecto

```
transito-sabaneta/
│
├── config/
│   └── db.js                        # Conexión a MySQL
│
├── controllers/
│   ├── propietarioController.js     # Lógica propietarios
│   ├── vehiculoController.js        # Lógica vehículos
│   ├── matriculaController.js       # Lógica matrículas
│   ├── infraccionController.js      # Lógica infracciones
│   ├── reporteController.js         # Lógica reportes PDF
│   └── estadisticaController.js     # Lógica estadísticas
│
├── models/
│   ├── propietarioModel.js          # Consultas propietarios
│   ├── vehiculoModel.js             # Consultas vehículos
│   ├── matriculaModel.js            # Consultas matrículas
│   ├── infraccionModel.js           # Consultas infracciones
│   ├── reporteModel.js              # Consultas reportes
│   └── estadisticaModel.js          # Consultas estadísticas
│
├── routes/
│   ├── propietarioRoutes.js         # Rutas /propietarios
│   ├── vehiculoRoutes.js            # Rutas /vehiculos
│   ├── matriculaRoutes.js           # Rutas /matriculas
│   ├── infraccionRoutes.js          # Rutas /infracciones
│   └── reporteRoutes.js             # Rutas /reportes
│
├── views/
│   ├── partials/
│   │   ├── navbar.ejs               # Barra de navegación
│   │   └── footer.ejs               # Pie de página
│   ├── propietarios/                # Vistas propietarios
│   ├── vehiculos/                   # Vistas vehículos
│   ├── matriculas/                  # Vistas matrículas
│   ├── infracciones/                # Vistas infracciones
│   ├── reportes/                    # Vistas reportes
│   └── index.ejs                    # Panel principal
│
├── public/
│   ├── css/
│   │   └── style.css                # Estilos globales
│   └── logosabaneta.jpeg            # Logo institucional
│
├── app.js                           # Archivo principal
├── package.json                     # Dependencias
└── README.md                        # Documentación
```

---

## 🗄️ Base de Datos

### Diagrama de tablas

```
propietario ──┬── persona
              └── empresa

vehiculo ─────┬── automovil
              ├── moto
              └── carro_pesado

matricula ────┬── vehiculo
              └── propietario

infraccion ───┬── vehiculo
              └── fuente_deteccion ──┬── agente_transito
                                     └── camara_deteccion
```

### Configuración

```javascript
// config/db.js
host:     'localhost'
user:     'root'
password: 'tu_contraseña'
database: 'transito_sabaneta'
```

---

## ✅ Funcionalidades

### Gestión
| Módulo | Crear | Listar | Editar | Eliminar |
|--------|-------|--------|--------|----------|
| Propietarios | ✅ | ✅ | ✅ | ✅ |
| Vehículos | ✅ | ✅ | ✅ | ✅ |
| Matrículas | ✅ | ✅ | ✅ | ✅ |
| Infracciones | ✅ | ✅ | ✅ | ✅ |

### Funcionalidades adicionales
- 🔍 Búsqueda de vehículos por placa
- 🚨 Ver infracciones por vehículo con total de multas
- 📊 Panel de estadísticas con 3 gráficas (Chart.js)
- 📄 Reportes exportables a PDF (PDFKit)
- 🔧 Gestión de fuentes de detección (agentes y cámaras)

---

## ⚙️ Instalación

### Prerrequisitos
- Node.js v18 o superior
- MySQL 8.0
- MySQL Workbench (opcional)

### Pasos

**1. Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/transito-sabaneta.git
cd transito-sabaneta
```

**2. Instalar dependencias**
```bash
npm install
```

**3. Crear la base de datos**

Abrir MySQL Workbench y ejecutar el script de creación de tablas:
```sql
CREATE DATABASE transito_sabaneta;
USE transito_sabaneta;
-- (ejecutar el script completo de tablas)
```

**4. Configurar la conexión**

Abrir `config/db.js` y actualizar la contraseña:
```javascript
const connection = mysql.createConnection({
    host:     'localhost',
    user:     'root',
    password: 'tu_contraseña',  // ← cambiar aquí
    database: 'transito_sabaneta'
});
```

**5. Iniciar el servidor**
```bash
node app.js
```

**6. Abrir en el navegador**
```
http://localhost:3000
```

---

## 🚀 Uso

Una vez iniciado el servidor:

| URL | Descripción |
|-----|-------------|
| `/` | Panel principal con estadísticas |
| `/propietarios` | Gestión de propietarios |
| `/vehiculos` | Gestión de vehículos |
| `/matriculas` | Gestión de matrículas |
| `/infracciones` | Gestión de infracciones |
| `/reportes` | Reportes y exportación PDF |

---

## 👤 Autor

**Andrés Felipe Ríos**
Estudiante de Ingeniería — Curso de Aprendizaje Automático e IA
Medellín, Colombia 🇨🇴

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos para la materia de programación.
