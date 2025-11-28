**El comando `create-nodegui-app` ya no está disponible oficialmente. Para iniciar un proyecto NodeGUI con TypeScript, debes clonar manualmente un repositorio base.**

Aquí tienes una forma confiable y actualizada de comenzar:

---

### 🧱 Método alternativo: clonar plantilla TypeScript

#### 1. 📥 Clona el repositorio base

```bash
git clone https://github.com/sedwards2009/nodegui-simple-starter.git my-nodegui-app
cd my-nodegui-app
```

Este repositorio incluye soporte para TypeScript, empaquetado con `esbuild`, y scripts para desarrollo y distribución.

#### 2. 📦 Instala dependencias

```bash
npm install
```

#### 3. 🛠 Compila y ejecuta

```bash
npm run build
npm run run
```

Esto compila el código TypeScript y lanza la app con NodeGUI.

---

### 🧪 Estructura del proyecto

```plaintext
my-nodegui-app/
├── src/                  # Código fuente en TypeScript
│   └── index.ts
├── build/                # Salida intermedia de TypeScript
├── dist/                 # Bundle final para ejecución
├── packaging/            # Configuración para empaquetado
├── tsconfig.json         # Configuración de TypeScript
├── package.json
```

---

### 🧩 Scripts útiles

- `npm run build`: compila TypeScript y genera el bundle
- `npm run run`: ejecuta la app desde `dist`
- `npm run package`: crea instaladores con Jam Pack NodeGUI

---

### 🧠 Recomendaciones técnicas para Juan

Dado tu dominio en PySide6 y JetBrains IDEs, puedes adaptar este flujo fácilmente:

- Usa **WebStorm o PhpStorm** para editar el proyecto con soporte TypeScript.
- Puedes integrar SQLite, APIs locales o módulos nativos con `node-ffi` si necesitas lógica avanzada.
- Para estilos, NodeGUI acepta CSS-like sintaxis, útil para personalizar la UI sin complicaciones.

¡Perfecto, Juan! Si quieres que tu sistema CLI/API en Node.js + TypeScript guarde datos en una base de datos **PostgreSQL**, aquí tienes una guía práctica para integrarlo:

---

### 🧰 Requisitos

Instala el cliente PostgreSQL para Node.js:

```bash
npm install pg
npm install @types/pg --save-dev
```

---

### 🛠 Configuración básica

#### 1. 📄 `src/db.ts` — conexión a PostgreSQL

```ts
import { Pool } from 'pg';

export const pool = new Pool({
  user: 'tu_usuario',
  host: 'localhost',
  database: 'tu_base',
  password: 'tu_contraseña',
  port: 5432,
});
```

#### 2. 📄 `src/index.ts` — guardar datos

```ts
import { pool } from './db';

async function guardarDatos(titulo: string, contenido: string) {
  const query = 'INSERT INTO posts (title, body) VALUES ($1, $2)';
  await pool.query(query, [titulo, contenido]);
  console.log('Datos guardados en PostgreSQL');
}

guardarDatos('Hola desde Lloa', 'Este es un ejemplo de inserción');
```

---

### 🧪 Estructura de tabla en PostgreSQL

Ejecuta esto en tu consola de PostgreSQL:

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL
);
```

---

### 🧠 Tips para Juan

- Puedes usar `dotenv` para manejar credenciales de forma segura.
- Si prefieres ORM, puedes usar `TypeORM` o `Prisma`, aunque para CLI puro el cliente `pg` es más directo.
- Puedes integrar esto con tu sistema de comandos (`commander`) para que `npx ts-node src/index.ts guardar` ejecute la inserción.

Para tu CLI/API en Node.js + TypeScript, un archivo de configuración te permite centralizar parámetros como credenciales, rutas, puertos, y opciones de entorno. Aquí te muestro cómo hacerlo de forma segura y escalable:

---

### 🗂 Opción 1: Usar archivo `.env` con `dotenv`

#### 1. 📦 Instala dotenv

```bash
npm install dotenv
```

#### 2. 📄 Crea `.env` en la raíz del proyecto

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=juan
DB_PASS=secreta123
DB_NAME=mi_base
API_URL=https://api.ejemplo.com
```

#### 3. 📄 Usa en tu código (`src/config.ts`)

```ts
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  db: {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    user: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    name: process.env.DB_NAME!,
  },
  apiUrl: process.env.API_URL!,
};
```

---

### 🗂 Opción 2: Archivo JSON de configuración

#### 1. 📄 Crea `config.json`

```json
{
  "db": {
    "host": "localhost",
    "port": 5432,
    "user": "juan",
    "password": "secreta123",
    "name": "mi_base"
  },
  "apiUrl": "https://api.ejemplo.com"
}
```

#### 2. 📄 Usa en tu código (`src/config.ts`)

```ts
import fs from 'fs';

const raw = fs.readFileSync('config.json', 'utf-8');
export const config = JSON.parse(raw);
```

---

### 🧠 Recomendaciones para Juan

- Usa `.env` si quieres ocultar credenciales y facilitar despliegue.
- Usa `config.json` si prefieres editar parámetros sin recompilar.
- Puedes combinar ambos: `.env` para secretos, `config.json` para opciones públicas.
- Para entornos múltiples (dev, prod), puedes usar `dotenv-flow` o `config` package.

¿Quieres que te ayude a crear un sistema que cargue configuración según el entorno (`NODE_ENV`)? También puedo ayudarte a encriptar credenciales o validar configuración con `zod`. ¿Qué tipo de parámetros quieres centralizar?

### 🧠 Correr el CLI en modo de desarrollo

- Usa `npm run build:auto` para reconstruir el sistema ante cualquier cambio
- Usa `npx vites --no-silent` para correr las pruebas ante cualquier cambio
- Usa `node dist/index.js fromAirVisio --from=2025-11-19T21:59` para probar el sistema en línea

### 🧠 Correr el CLI en modo de desarrollo


