# Trabajo Práctico Integrador - Etapa Backend
### Profesora: MARÍA BELÉN ALEGRE

### Alumno:
    Jeremias Seminario
    Legajo: 0118252

### Instalación:
~~~
1. > npm install
~~~
~~~
2. Configurar base de datos en app/config/config.js
   Información adjunta en la entrega.
~~~

### Ejecución:
~~~
1. > npm start
~~~
~~~
2. > Probar endpoints en test.http (Recomiendo instalar extensión REST Client en VSCode. Probar presionando `Send Request` arriba de cada bloque).
~~~

### Estructura (MVC)
- `test.http`
- `loadProducts.js`
- `server.js`
- app
    - config
        - config.js
        - database.js
    -controllers
        - CustomerController.js
        - ProductController.js
        - RentalController.js
    - models
        - CustomerModel.js
        - ProductModel.js
        - RentalModel.js
    - routes
        - customer.js
        - product.js
        - rental.js
    - services
        - RentalService.js
    - app.js

El servidor (server.js) inicia con el comando npm start. Entonces se lanza la app (app.js) que carga express y las rutas de los endpoint.

loadProducts.js es el archivo con el que precargué los productos a Atlas, si se corré probablemente las IDs cambien, por lo que se tendrían que cambiar en el archivo test.http que es para probar los endpoints.


