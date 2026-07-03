#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Validando configuración del BFF...\n');

const checks = {
  ✅: [],
  ⚠️: [],
  ❌: []
};

// 1. Verificar .env
if (fs.existsSync(path.join(__dirname, '.env'))) {
  checks['✅'].push('.env existe');
} else {
  checks['❌'].push('.env no encontrado (usar .env.example como plantilla)');
}

// 2. Verificar package.json
if (fs.existsSync(path.join(__dirname, 'package.json'))) {
  checks['✅'].push('package.json existe');
} else {
  checks['❌'].push('package.json no encontrado');
}

// 3. Verificar node_modules
if (fs.existsSync(path.join(__dirname, 'node_modules'))) {
  checks['✅'].push('node_modules existe (dependencias instaladas)');
} else {
  checks['⚠️'].push('node_modules no encontrado (ejecutar: npm install)');
}

// 4. Verificar estructura de carpetas
const requiredDirs = ['config', 'src', 'src/controllers', 'src/middleware', 'src/routes', 'src/services', 'src/utils'];
requiredDirs.forEach(dir => {
  if (fs.existsSync(path.join(__dirname, dir))) {
    checks['✅'].push(`Carpeta ${dir}/ existe`);
  } else {
    checks['❌'].push(`Carpeta ${dir}/ no encontrada`);
  }
});

// 5. Verificar archivos críticos
const criticalFiles = [
  'src/server.js',
  'src/routes/index.js',
  'config/logger.js',
  'package.json'
];
criticalFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    checks['✅'].push(`Archivo ${file} existe`);
  } else {
    checks['❌'].push(`Archivo ${file} no encontrado`);
  }
});

// 6. Verificar archivo .env.example
if (fs.existsSync(path.join(__dirname, '.env.example'))) {
  checks['✅'].push('.env.example existe (plantilla de configuración)');
} else {
  checks['⚠️'].push('.env.example no encontrado');
}

// 7. Verificar documentación
const docFiles = ['README.md', 'API_DOCUMENTATION.md', 'ARQUITECTURA.md', 'DEVELOPMENT.md'];
docFiles.forEach(doc => {
  if (fs.existsSync(path.join(__dirname, doc))) {
    checks['✅'].push(`Documentación: ${doc} ✓`);
  } else {
    checks['⚠️'].push(`Documentación faltante: ${doc}`);
  }
});

// Imprimir resultados
console.log('═══════════════════════════════════════\n');

if (checks['✅'].length > 0) {
  console.log('✅ VERIFICACIONES EXITOSAS:');
  checks['✅'].forEach(check => console.log(`   ✓ ${check}`));
  console.log('');
}

if (checks['⚠️'].length > 0) {
  console.log('⚠️  ADVERTENCIAS:');
  checks['⚠️'].forEach(check => console.log(`   ⚠ ${check}`));
  console.log('');
}

if (checks['❌'].length > 0) {
  console.log('❌ ERRORES:');
  checks['❌'].forEach(check => console.log(`   ✗ ${check}`));
  console.log('');
}

console.log('═══════════════════════════════════════\n');

// Resumen
const totalChecks = checks['✅'].length + checks['⚠️'].length + checks['❌'].length;
const passedChecks = checks['✅'].length;

console.log(`📊 Resultados: ${passedChecks}/${totalChecks} verificaciones exitosas\n`);

// Recomendaciones
if (checks['❌'].length === 0 && checks['⚠️'].length === 0) {
  console.log('🎉 ¡Todo está configurado correctamente!\n');
  console.log('Próximos pasos:');
  console.log('1. npm install (si aún no lo hiciste)');
  console.log('2. npm run dev (para iniciar el servidor)');
  console.log('3. Abre http://localhost:3000/api/health en tu navegador\n');
} else if (checks['❌'].length === 0) {
  console.log('⚠️  Por favor resuelve las advertencias antes de ejecutar\n');
} else {
  console.log('❌ Por favor resuelve los errores antes de ejecutar\n');
}

// Status code
process.exit(checks['❌'].length > 0 ? 1 : 0);
