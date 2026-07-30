export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'chore', 'docs', 'test'],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'auth', // todo lo relacionado con autentificaion
        'users', // gestion de usuarios
        'tasks', // sistema de tareas
        'db', // configuracion de la base de datos
        'config', // variables de entorno, configuracion global de la app
        'deps', // actualización o instalción de librerias y paquetes
        'ci', // configuracion de herramientas como Husky
      ],
    ],
  },
};
