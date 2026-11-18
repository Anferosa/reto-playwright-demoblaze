# Laboratorio de automatización con Playwright y TypeScript

## Datos del estudiante
- Nombre: Andrés Felipe Rodríguez Salinas
- Asignatura: Ingeniería de Software III
- Universidad Libre, Seccional Bogotá

## 1. Lo que hicimos en clase

- Configuramos Node.js, npm y Playwright, y verificamos que el navegador Chromium pudiera ejecutar las pruebas.
- Creamos la primera prueba para abrir una página y comprobar su contenido con Playwright Test.
- Aprendimos a localizar elementos con selectores accesibles como texto, roles y etiquetas.
- Organizamos cada prueba por funcionalidades y casos de usuario para facilitar su lectura y mantenimiento.
- Aplicamos el patrón Page Object Model para separar locators y acciones de las pruebas.
- Utilizamos fixtures para preparar las páginas necesarias antes de ejecutar cada escenario.
- Movimos datos sensibles y configuraciones a variables de entorno mediante `.env`.
- Generamos capturas, videos y trazas, además de un reporte HTML para revisar los resultados.

## 2. Reto integrador

### 2.1 Página escogida
**Demoblaze** — https://www.demoblaze.com

Tienda en línea de demostración creada para practicar pruebas. La escogí porque no exige CAPTCHA, tiene los flujos típicos de un comercio electrónico (inicio de sesión, catálogo por categorías, carrito y compra simulada) y la compra no genera cobros reales.

Funcionalidades automatizadas: inicio de sesión, consulta del catálogo, carrito de compras y compra.

### 2.2 Historias de usuario

**HU-01 Inicio de sesión**
Como cliente registrado, quiero iniciar sesión con mi usuario y contraseña, para acceder a mi cuenta.

```gherkin
Escenario: inicio de sesión exitoso
  Dado que estoy en la página de inicio y tengo una cuenta registrada
  Cuando ingreso mi usuario y contraseña correctos
  Entonces veo el mensaje "Welcome" con mi nombre de usuario

Escenario: inicio de sesión con datos inválidos
  Dado que estoy en el formulario de inicio de sesión
  Cuando ingreso una contraseña incorrecta, un usuario inexistente o dejo los campos vacíos
  Entonces el sistema muestra una alerta con el motivo y no inicio sesión
```

**HU-02 Consulta del catálogo**
Como visitante, quiero filtrar los productos por categoría y ver el detalle de cada uno, para decidir qué comprar.

```gherkin
Escenario: filtrar por categoría
  Dado que estoy en la página de inicio
  Cuando selecciono la categoría "Monitors"
  Entonces veo únicamente los productos de esa categoría

Escenario: ver el detalle de un producto
  Dado que estoy en la página de inicio
  Cuando abro el producto "Samsung galaxy s6"
  Entonces veo su nombre y su precio
```

**HU-03 Carrito de compras**
Como visitante, quiero agregar y quitar productos del carrito, para controlar lo que voy a comprar.

```gherkin
Escenario: agregar un producto
  Dado que estoy en el detalle de un producto
  Cuando hago clic en "Add to cart"
  Entonces el sistema avisa "Product added" y el producto aparece en el carrito

Escenario: eliminar un producto
  Dado que tengo un producto en el carrito
  Cuando hago clic en "Delete"
  Entonces el producto desaparece del carrito
```

**HU-04 Realizar una compra**
Como visitante, quiero completar mis datos y confirmar el pedido, para finalizar la compra.

```gherkin
Escenario: compra exitosa
  Dado que tengo un producto en el carrito
  Cuando diligencio nombre, país, ciudad, tarjeta, mes y año y hago clic en "Purchase"
  Entonces veo el mensaje "Thank you for your purchase!"

Escenario: compra sin datos obligatorios
  Dado que tengo un producto en el carrito
  Cuando hago clic en "Purchase" sin diligenciar el formulario
  Entonces el sistema muestra una alerta pidiendo nombre y tarjeta
```

### 2.3 Casos de prueba

| ID | HU | Nombre | Datos | Resultado esperado | Resultado obtenido |
|----|----|--------|-------|--------------------|--------------------|
| CP-R01 | HU-01 | Login exitoso con usuario registrado | Usuario y contraseña de la cuenta de pruebas (`.env`) | Aparece "Welcome" con el nombre de usuario | Omitido: faltan las credenciales |
| CP-R02 | HU-01 | Login fallido con contraseña incorrecta | Usuario válido, contraseña `clave_incorrecta_123` | Alerta "Wrong password." y no inicia sesión | Omitido: falta el usuario |
| CP-R03 | HU-01 | Login fallido con usuario inexistente | Usuario `usuario_inexistente_qa_98765` | Alerta "User does not exist." | Pasó |
| CP-R04 | HU-01 | Login fallido con campos vacíos | Usuario y contraseña vacíos | Alerta "Please fill out Username and Password." | Pasó |
| CP-R05 | HU-02 | Filtrar productos por la categoría Monitors | Categoría: Monitors | Se listan solo 2 productos: Apple monitor 24 y ASUS Full HD | Pasó |
| CP-R06 | HU-02 | El detalle del producto muestra nombre y precio | Producto: Samsung galaxy s6 | Se ve el nombre y el precio $360 | Pasó |
| CP-R07 | HU-03 | Agregar un producto al carrito | Producto: Samsung galaxy s6 | Alerta "Product added" y el producto aparece en el carrito | Pasó |
| CP-R08 | HU-03 | Eliminar un producto del carrito | Producto: Samsung galaxy s6 | El carrito queda sin el producto | Pasó |
| CP-R09 | HU-04 | Compra completa de un producto | Datos ficticios de comprador y tarjeta | Mensaje "Thank you for your purchase!" | Pasó |
| CP-R10 | HU-04 | Compra sin diligenciar los datos obligatorios | Formulario vacío | Alerta "Please fill out Name and Creditcard." | Pasó |

### 2.4 Cómo está construido

```
reto/
├── pages/
│   ├── HomePage.ts      # inicio, catálogo y barra de navegación
│   ├── LoginModal.ts    # ventana de inicio de sesión
│   ├── ProductPage.ts   # detalle de producto
│   ├── CartPage.ts      # carrito
│   └── OrderModal.ts    # formulario de compra y confirmación
├── tests/               # 4 archivos, 10 casos (CP-R01 a CP-R10)
├── utils/alertas.ts     # escucha los alert() del sitio para verificar su texto
└── fixtures.ts          # homePage, loginModal, productPage, cartPage, orderModal y productoEnCarrito
utils/acciones.ts        # clic/escribir/seleccionar con captura y elemento resaltado en rojo
playwright.config.ts     # dos projects: saucedemo (clase) y reto (Demoblaze)
```

- **Page Object Model:** una clase por pantalla o ventana emergente; los locators viven en la clase y los `expect` en la prueba.
- **Fixtures:** cada prueba recibe sus Page Objects listos. `productoEnCarrito` deja un producto agregado como precondición de CP-R08, CP-R09 y CP-R10.
- **Alertas:** Demoblaze usa `alert()` del navegador para muchos resultados. `esperarAlerta()` las captura para verificar el texto y lo adjunta al reporte (las alertas nativas no salen en las capturas de pantalla).
- **Datos sensibles:** el usuario y la contraseña de la cuenta de pruebas están en `.env`, que no se sube a GitHub (ver `.env.example`).

### 2.5 Evidencias

Las capturas de todos los pasos ejecutados se almacenan en `evidencias/`, organizadas por caso de prueba.

**CP-R05 — Filtro de monitores**

![Categoría Monitors](evidencias/CP-R05%20Filtrar%20productos%20por%20la%20categoría%20Monitors/02%20-%20Seleccionar%20la%20categoría%20Monitors.png)

![Resultado del filtro](evidencias/CP-R05%20Filtrar%20productos%20por%20la%20categoría%20Monitors/03%20-%20Resultado%20solo%20se%20listan%20los%202%20monitores.png)

**CP-R07 — Producto agregado al carrito**

![Producto en el carrito](evidencias/CP-R07%20Agregar%20un%20producto%20al%20carrito/05%20-%20Resultado%20el%20producto%20aparece%20en%20el%20carrito.png)

**CP-R09 — Compra confirmada**

![Compra confirmada](evidencias/CP-R09%20Compra%20completa%20de%20un%20producto/13%20-%20Resultado%20compra%20confirmada.png)

**CP-R10 — Validación de datos obligatorios**

![Formulario de compra](evidencias/CP-R10%20Compra%20sin%20diligenciar%20los%20datos%20obligatorios/05%20-%20Clic%20en%20Place%20Order.png)

### 2.6 Defectos encontrados

Ninguno en las ocho pruebas ejecutadas. Las pruebas CP-R01 y CP-R02 no pudieron ejecutarse porque no había una cuenta configurada en las variables `DEMOBLAZE_USER` y `DEMOBLAZE_PASSWORD`.

## 3. Cómo ejecutar el proyecto

```powershell
npm install
npx playwright install
# copiar .env.example como .env y llenar DEMOBLAZE_USER y DEMOBLAZE_PASSWORD
npx playwright test --project=reto
npx playwright show-report
```

La cuenta de pruebas se crea a mano en Demoblaze (botón "Sign up") con datos ficticios.

## 4. Dificultades y cómo las resolví

- El proyecto no incluía `package.json`: creé la configuración de npm con Playwright Test y dotenv.
- PowerShell no podía ejecutar `npm.ps1` por la política de ejecución: utilicé `npm.cmd` y `npx.cmd`, que ejecutan correctamente los comandos en Windows.
- Faltaban las dependencias: las instalé con `npm.cmd install`.
- El navegador Chromium no estaba disponible: lo instalé con `npx.cmd playwright install chromium`.
- Las pruebas de login con credenciales quedaron omitidas porque el archivo `.env` no contiene una cuenta de Demoblaze creada previamente.
- Las ejecuciones generan videos y trazas para facilitar la investigación de cualquier fallo.

## 5. Conclusiones

Playwright permitió automatizar los principales flujos de Demoblaze y comprobar el comportamiento real de la aplicación. La separación en Page Objects, fixtures y utilidades hizo que las pruebas fueran claras y fáciles de mantener.

La ejecución final pasó 8 de 10 casos y omitió 2 casos de login por falta de credenciales. Los resultados confirman el catálogo, las alertas, el carrito y el flujo de compra; la cuenta de pruebas solo necesita crearse en Demoblaze y configurarse en `.env` para completar esas dos verificaciones.
