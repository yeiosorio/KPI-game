# KPI Game

Una aplicación Angular moderna para aprender y practicar análisis de KPIs a través de gamificación.

## 🚀 Tecnologías y Herramientas

- **Angular 19.2.12** - Framework principal
- **TypeScript** - Lenguaje de programación
- **SCSS** - Preprocesador CSS
- **Standalone Components** - Arquitectura moderna sin NgModules
- **Angular Signals** - Gestión de estado reactiva
- **Reactive Forms** - Formularios reactivos
- **Angular Router** - Navegación y lazy loading
- **Jasmine & Karma** - Testing unitario

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

## 🔧 Comandos de Desarrollo

### Servidor de desarrollo
```bash
ng serve
```
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
