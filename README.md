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
1. > node loadProducts.js (Si se usa las ID de los productos en test.http van a ser incorrectas, teniendo que colocarlas nuevamente)
~~~
2. > npm start
~~~
3. > Probar endpoints en test.http (Recomiendo instalar extensión REST Client en VSCode. Probar presionando `Send Request` arriba de cada bloque).
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
