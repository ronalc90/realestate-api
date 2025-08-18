RealEstate API (Backend)

API REST para listar propiedades inmobiliarias con filtros sobre MongoDB Atlas. Desplegada en Render con Docker.

========================================
ENLACES ÚTILES (PRODUCCIÓN)
========================================
Healthcheck:
https://realestate-api-k012.onrender.com/healthz

Swagger:
https://realestate-api-k012.onrender.com/swagger

Listado (GET):
https://realestate-api-k012.onrender.com/api/Properties
Parámetros: name, address, minPrice, maxPrice, sort (price, -price, name, -name), page, pageSize
Ejemplo:
https://realestate-api-k012.onrender.com/api/Properties?name=Loft&address=Cra&minPrice=300&maxPrice=900000&sort=-price&page=1&pageSize=10

Detalle (GET):
https://realestate-api-k012.onrender.com/api/Properties/{id}
Ejemplo:
https://realestate-api-k012.onrender.com/api/Properties/68a24ec8beb2e9de8aee268b


![tests](https://github.com/ronalc90/realestate-api/actions/workflows/tests.yml/badge.svg)


========================================
Tech stack: .NET 8 (ASP.NET Core Web API), C#, MongoDB Driver, Swagger/OpenAPI, Docker (multi-stage), NUnit

========================================
ARQUITECTURA (RESUMEN)
========================================
Models/Property.cs → entidad Mongo: _id, ownerId, name, address, price, imageUrl

Dtos/PropertyDto.cs → contrato de salida (según reto): IdOwner, Name, AddressProperty, PriceProperty, ImageUrl

Data/MongoContext.cs → conexión a Atlas, DB/colecciones; índices en price, name, address

Controllers/PropertiesController.cs → listado (filtros/orden/paginación) y detalle

JSON en PascalCase configurado en Program.cs

========================================
ESTRUCTURA
========================================
RealEstate.Api/
 ├─ Controllers/
 │   └─ PropertiesController.cs
 ├─ Data/
 │   └─ MongoContext.cs
 ├─ Dtos/
 │   └─ PropertyDto.cs
 ├─ Filters/
 │   └─ PropertyFilter.cs
 ├─ Validators/
 │   └─ PropertyFilterValidator.cs
 ├─ Models/
 │   └─ Property.cs
 ├─ Properties/
 │   └─ launchSettings.json
 ├─ Program.cs
 ├─ appsettings.json
 ├─ appsettings.Development.json
 ├─ Dockerfile
 └─ .dockerignore

RealEstate.Tests/
 ├─ PropertiesControllerTests.cs
 └─ PropertyFilterValidatorTests.cs


========================================
CONFIGURACIÓN
========================================
Variables de entorno obligatorias:
- MONGODB_URI → cadena SRV de Atlas (usuario con permisos sobre la DB).

Variables opcionales:
- Mongo__Database (default: realestate)
- Mongo__PropertiesCollection (default: properties)


========================================
EJECUTAR LOCAL CON DOCKER
========================================

Bash (Linux/macOS/Git Bash)
docker build -t realestate-api ./RealEstate.Api

docker run -p 8080:8080 \
  -e ASPNETCORE_ENVIRONMENT=Development \
  -e MONGODB_URI="mongodb+srv://<user>:<pass>@<cluster>/?retryWrites=true&w=majority" \
  -e Mongo__Database=realestate \
  -e Mongo__PropertiesCollection=properties \
  realestate-api

# Probar
curl http://localhost:8080/healthz
# Abrir Swagger: http://localhost:8080/swagger

PowerShell (Windows)

docker build -t realestate-api .\RealEstate.Api

docker run -p 8080:8080 `
  -e ASPNETCORE_ENVIRONMENT=Development `
  -e MONGODB_URI="mongodb+srv://<user>:<pass>@<cluster>/?retryWrites=true&w=majority" `
  -e Mongo__Database=realestate `
  -e Mongo__PropertiesCollection=properties `
  realestate-api

3) Probar:
   http://localhost:8080/healthz
   http://localhost:8080/swagger

========================================
DESPLIEGUE EN RENDER (DOCKER)
========================================
- Root Directory: (vacío) y Dockerfile path: RealEstate.Api/Dockerfile
  (o Root Directory: RealEstate.Api con Dockerfile ajustado a rutas relativas).
- Port: 8080
- Health Check Path: /healthz
- Env vars: ASPNETCORE_ENVIRONMENT=Production, MONGODB_URI=<...>
- Auto deploy: ON

========================================
DETALLE DE ENDPOINTS
========================================
GET /healthz
- Devuelve: { "status": "ok" } (ping real a MongoDB).

GET /api/Properties
- Query params:
  name (prefijo, case-insensitive)
  address (prefijo, case-insensitive)
  minPrice, maxPrice (rango cerrado)
  sort: price | -price | name | -name
  page (>=1), pageSize (1–50)
- Respuesta 200 (ejemplo):
  {
    "items": [
  
      {
        "IdOwner": "66c03f2f9b1d4d0f0c100001",
        "Name": "Modern Loft",
        "AddressProperty": "Cra 7 #123-45, Bogotá",
        "PriceProperty": 450000000,
        "ImageUrl": "https://..."
      }
    ],
    "total": 40,
    "page": 1,
    "pageSize": 10
  }

GET /api/Properties/{id}
- Devuelve el DTO de la propiedad si existe (200) o 404 si no existe.

========================================
DATOS DE PRUEBA
========================================
Se cargaron 40 documentos de ejemplo (EE. UU. y Colombia) en realestate.properties.
Para reimportar: Atlas → Browse Collections → Import JSON → pegar el array (ownerId, name, address, price, imageUrl).

========================================
RENDIMIENTO
========================================
- Búsquedas por prefijo (^texto) para aprovechar índices (name, address).
- Paginación server-side (pageSize máx. 50).
- Órdenes por name/price usando índices.
- Compresión de respuestas (si se habilita ResponseCompression).

========================================
SEGURIDAD / CORS
========================================
- Desarrollo: CORS permisivo.
- Producción: restringir orígenes (WithOrigins).
- Mantener MONGODB_URI como secreto del proveedor.
- Swagger: útil para demo; en prod real, exponer solo en Development.

========================================
LICENCIA
========================================
Uso interno de evaluación técnica Million.
