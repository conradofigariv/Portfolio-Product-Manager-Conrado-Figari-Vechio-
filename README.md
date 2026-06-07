# Portfolio de Conrado Figari - Product Manager

Portfolio personal de Conrado Figari, Product Manager apasionado por crear productos que generan impacto.

## 🚀 Características

- **Responsive Design**: Optimizado para mobile, tablet y desktop
- **Modern Stack**: Next.js 15, React 19, Tailwind CSS
- **SEO Optimizado**: Metadata y Open Graph configurados
- **Vercel Deployment**: Deployment automático en cada push
- **Dark Theme**: Tema oscuro moderno y sofisticado

## 📋 Secciones

- **Hero**: Introducción impactante
- **Sobre mí**: Experiencia y educación
- **Proyectos**: Casos de estudio con métricas
- **Habilidades**: Competencias y certificaciones
- **Contacto**: Formulario y redes sociales

## 🛠️ Stack Tecnológico

- **Frontend**: React 19
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Hosting**: Vercel

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>

# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🏗️ Estructura del Proyecto

```
.
├── app/
│   ├── components/          # Componentes React
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   ├── Contact.tsx
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Página de inicio
│   └── globals.css          # Estilos globales
├── public/                  # Archivos estáticos
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── vercel.json
```

## 🚀 Deployment

El proyecto se despliega automáticamente en Vercel. Simplemente haz push a la rama principal:

```bash
git push origin main
```

Vercel se encargará del build y deployment automáticamente.

## 📝 Personalizacion

Antes de deployar, actualiza:

1. **Información personal** en `app/components/About.tsx`
2. **Proyectos y casos de estudio** en `app/components/Projects.tsx`
3. **Habilidades y certificaciones** en `app/components/Skills.tsx`
4. **Enlaces sociales** en `app/components/Footer.tsx` y `app/components/Contact.tsx`
5. **Metadata** en `app/layout.tsx`

## 📄 Licencia

Este proyecto es de uso personal. Todos los derechos reservados © 2024 Conrado Figari.
