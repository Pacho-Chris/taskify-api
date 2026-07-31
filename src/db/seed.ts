import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import * as bcrypt from 'bcrypt';

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  // Bloquear ejecución si estamos en producción
  if (process.env.NODE_ENV === 'production') {
    console.error(
      '❌ Error: El script de seeding no se puede ejecutar en un entorno de producción.',
    );
    process.exit(1);
  }

  console.log('🌱 Iniciando el proceso de seeding para desarrollo...');

  // Limpiar datos existentes
  await db.delete(schema.tasks);
  await db.delete(schema.users);

  // Hashear contraseña de prueba
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Crear usuario de prueba
  const [user] = await db
    .insert(schema.users)
    .values({
      email: 'test@taskify.com',
      password: hashedPassword,
      name: 'Usuario de Prueba',
    })
    .returning();

  console.log(`👤 Usuario creado: ${user.email} (ID: ${user.id})`);

  // 2. Crear tareas asociadas
  await db.insert(schema.tasks).values([
    {
      userId: user.id,
      title: 'Configurar arquitectura base de NestJS',
      description: 'Revisar módulos, controladores y servicios principales.',
      status: 'COMPLETED',
      priority: 'HIGH',
    },
    {
      userId: user.id,
      title: 'Implementar autenticación con JWT',
      description: 'Asegurar los endpoints con Guards y Passport.js.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date(Date.now() + 86400000 * 2),
    },
    {
      userId: user.id,
      title: 'Documentar API con Swagger',
      description:
        'Agregar decoradores para que los reclutadores puedan probar la API fácilmente.',
      status: 'PENDING',
      priority: 'MEDIUM',
    },
  ]);

  console.log('📝 Tareas de prueba creadas correctamente.');
  console.log('✨ Seed de desarrollo completado con éxito.');

  // ⚡ Forzar la salida limpia para que el script termine solo
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Error durante el seeding:', err);
  process.exit(1);
});
