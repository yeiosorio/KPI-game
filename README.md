# KPI Game

Una aplicación Angular moderna para aprender y practicar análisis de KPIs a través de gamificación.

## ✨ Funcionalidades Implementadas

### 🔐 Sistema de Autenticación
- **Login y Registro**: Formularios reactivos con validación
- **Gestión de Tokens**: Almacenamiento seguro en localStorage
- **Guards de Ruta**: Protección de rutas autenticadas
- **Interceptores HTTP**: Inyección automática de tokens de autorización
- **Logout Completo**: Limpieza de datos locales y llamada al endpoint de logout

### 📊 Dashboard de KPIs
- **Visualización de KPIs**: Cards interactivas con métricas clave
- **Filtros Dinámicos**: Por categoría y búsqueda de texto
- **Estados de Carga**: Indicadores visuales durante las peticiones
- **Responsive Design**: Adaptable a diferentes tamaños de pantalla
- **Logo Corporativo**: Integración de imagen de marca

### 🧪 Testing Unitario
- **Cobertura de Servicios**: Tests para AuthService y KpiService
- **Tests de Componentes**: Validación de funcionalidad del HomeComponent
- **Mocks y Spies**: Simulación de dependencias externas
- **Casos de Error**: Manejo de errores y estados fallidos

## 🚀 Tecnologías y Herramientas

- **Angular 19.2.12** - Framework principal
- **TypeScript** - Lenguaje de programación
- **SCSS** - Preprocesador CSS
- **Tailwind CSS** - Framework de utilidades CSS
- **Standalone Components** - Arquitectura moderna sin NgModules
- **Angular Signals** - Gestión de estado reactiva
- **Reactive Forms** - Formularios reactivos
- **Angular Router** - Navegación y lazy loading
- **HTTP Client** - Comunicación con APIs REST
- **Jasmine & Karma** - Testing unitario
- **RxJS** - Programación reactiva

## 📁 Estructura del Proyecto

```
src/app/
├── core/
│   ├── constants/           # Constantes globales y configuración
│   │   └── app.constants.ts
│   ├── guards/
│   │   └── auth.guard.ts    # Guard de autenticación
│   ├── interceptors/        # Interceptores HTTP
│   │   └── auth.interceptor.ts # Interceptor de autenticación
│   └── services/
│       └── api.service.ts   # Servicio base para APIs
├── shared/                  # Componentes y utilidades compartidas
│   └── index.ts
├── auth/
│   ├── login/              # Componente de inicio de sesión
│   │   ├── login.component.ts
│   │   ├── login.component.html
│   │   ├── login.component.scss
│   │   └── login.component.spec.ts
│   └── signup/             # Componente de registro
│       ├── signup.component.ts
│       ├── signup.component.html
│       ├── signup.component.scss
│       └── signup.component.spec.ts
├── feature/                # Funcionalidades principales
│   └── home/               # Página principal con listado de KPIs
│       ├── home.component.ts
│       ├── home.component.html
│       ├── home.component.scss
│       └── home.component.spec.ts
├── app.component.ts
├── app.config.ts
└── app.routes.ts

## 🏗️ Patrones de Diseño y Arquitectura

### Standalone Components
- **Sin NgModules**: Uso exclusivo de standalone components
- **Lazy Loading**: Carga diferida de componentes por rutas
- **Tree Shaking**: Optimización automática del bundle

### Gestión de Estado
- **Angular Signals**: Estado reactivo y eficiente
- **Computed Values**: Valores derivados automáticos
- **OnPush Strategy**: Detección de cambios optimizada

### Formularios Reactivos
- **FormBuilder**: Construcción declarativa de formularios
- **Validators**: Validación robusta y personalizada
- **Error Handling**: Manejo centralizado de errores

### Arquitectura de Servicios
- **Dependency Injection**: Inyección de dependencias moderna con `inject()`
- **Singleton Services**: Servicios globales con `providedIn: 'root'`
- **HTTP Interceptors**: Manejo centralizado de requests

## 🛡️ Seguridad y Guards

- **Auth Guard**: Protección de rutas autenticadas
- **HTTP Interceptor**: Inyección automática de tokens
- **Route Protection**: Control de acceso basado en autenticación

## 🎨 Características de UI/UX

- **Responsive Design**: Adaptable a todos los dispositivos
- **Modern CSS**: Gradientes, sombras y animaciones
- **Accessibility**: Formularios accesibles y semánticos
- **Loading States**: Estados de carga y feedback visual
- **Error Handling**: Mensajes de error claros y útiles

## 🚦 Rutas Configuradas

- `/` → Redirección a `/home`
- `/home` → Página principal (pública)
- `/login` → Inicio de sesión
- `/signup` → Registro de usuario
- `/dashboard` → Panel principal (protegido por auth guard)
- `/**` → Redirección a `/home` (404 handling)

## 🧪 Testing

- **Unit Tests**: Pruebas unitarias para todos los componentes
- **Component Testing**: Testing de interacciones y estados
- **Service Testing**: Pruebas de servicios y guards
- **Form Validation Testing**: Validación de formularios reactivos

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn
- Angular CLI (`npm install -g @angular/cli`)

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd KPI-game

# Instalar dependencias
npm install

# Configurar variables de entorno (opcional)
cp src/environments/environment.example.ts src/environments/environment.ts
```

### Configuración de API
Editar `src/app/core/constants/app.constants.ts` para configurar:
- URL base de la API
- Endpoints de autenticación
- Claves de almacenamiento

## 🔧 Comandos de Desarrollo

### Servidor de desarrollo
```bash
ng serve
# La aplicación estará disponible en http://localhost:4200
```

### Ejecutar tests
```bash
# Tests unitarios
ng test

# Tests con cobertura
ng test --code-coverage
```

### Build de producción
```bash
ng build --configuration production
```

## 📋 Instrucciones de Uso

### 1. Registro de Usuario
- Navegar a `/signup`
- Completar el formulario con:
  - Email válido
  - Nombre completo
  - Código de cliente
  - Contraseña (mínimo 6 caracteres)

### 2. Inicio de Sesión
- Navegar a `/login`
- Ingresar código de cliente y contraseña
- El sistema redirigirá automáticamente al dashboard

### 3. Dashboard de KPIs
- Visualizar métricas en tiempo real
- Filtrar por categorías (Ventas, Marketing, Operaciones, etc.)
- Buscar KPIs específicos usando la barra de búsqueda
- Hacer logout usando el botón en la barra superior

### 4. Funcionalidades Principales
- **Filtros**: Seleccionar categoría específica o "Todos"
- **Búsqueda**: Buscar KPIs por nombre
- **Responsive**: Funciona en desktop, tablet y móvil
- **Logout Seguro**: Limpia datos locales y cierra sesión en el servidor
Navega a `http://localhost:4200/`

### Build de producción
```bash
ng build
```

### Ejecutar tests
```bash
ng test
```

### Linting
```bash
ng lint
```

## 📦 Dependencias Principales

- `@angular/core` - Framework principal
- `@angular/common` - Módulos comunes
- `@angular/forms` - Formularios reactivos
- `@angular/router` - Sistema de rutas
- `rxjs` - Programación reactiva
