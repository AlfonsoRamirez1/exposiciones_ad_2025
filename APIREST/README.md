# API REST
# Guia de instalación y uso.
1. Acceder a esta carpeta a traves de powershell e iniciar el proyecto NODEJS.
    - cd APIREST
    - $ npm init -y (Inicializa un proyecto con configuración predeterminada)
2. Instalación de las dependencias a usar.
    - cd APIREST
    - npm install express
    - npm install swagger-ui-express swagger-jsdoc
    - npm install cors
    - npm install mysql2 
    - Para ahorrar todos los comandos tambien se puede ejecutar _npm install express swagger-ui-express swagger-jsdoc cors mysql2_
3. Crear BD e importar tabla. (Este ejemplo usa MySQL)
    - Abrir MySQL y crear una BD con el nombre api_test
    - Importar el archivo usuarios.sql de la carpeta db
    - Adaptar la conexión en db.js de ser necesario
4. Ejecutar la aplicación.
    - cd APIREST
    - npm start
    - Ejecutar public/index.html con una extensión como Go Live.
    - La página web se puede visualizar en http://127.0.0.1:5500/public/index.html
    - La documentación con Swagger se puede visualizar en http://localhost:3000/api-docs