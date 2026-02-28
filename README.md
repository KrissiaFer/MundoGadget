# MundoGadget

MundoGadget es una tienda virtual de productos tecnológicos desarrollada con HTML, CSS y JavaScript puro por nuestro equipo de trabajo.  
La aplicación permite visualizar productos, buscarlos y filtrarlos por categorías utilizando datos cargados desde un archivo JSON.

El proyecto está diseñado para ejecutarse en el navegador y fue preparado para su publicación en internet como sitio web accesible al público.

---

## Acceso al proyecto

El sitio web se encuentra publicado en internet para su visualización en línea.

Las imágenes de los productos se cargan mediante URLs externas, por lo que no es necesario almacenar archivos de imágenes en el proyecto.

---

## Estructura del proyecto

MundoGadget/
│
├── index.html              Página principal de la tienda  
├── admin.html              Panel de administración  
├── login.html              Página de inicio de sesión  
├── registro.html           Registro de usuarios  
│
├── css/
│   └── style.css           Estilos de la aplicación  
│
├── js/
│   └── script.js           Lógica de la tienda  
│
├── data/
│   └── products.json       Base de datos de productos  
│
└── README.md               Documentación del proyecto  

---

## Tecnologías utilizadas

HTML5  
CSS3  
JavaScript  
JSON como almacenamiento de datos  
Git y GitHub para control de versiones  

El proyecto funciona completamente del lado del cliente (frontend).

---

## Funcionalidades implementadas

### Visualización de productos
Los productos se cargan dinámicamente desde `products.json` y muestran:

- nombre  
- descripción  
- precio  
- stock  
- categoría  
- imagen  

---

### Buscador de productos
Permite filtrar productos en tiempo real escribiendo en la barra de búsqueda.  
El sistema busca coincidencias en el nombre y la descripción.

---

### Filtro por categorías
Los productos pueden filtrarse por categoría desde el menú de navegación.

---

### Sistema de carrito básico
Los productos pueden agregarse al carrito.  
La información se guarda en el navegador mediante `localStorage`.

---

## Ejecución local

1. Clonar el repositorio:
   git clone https://github.com/HenryPR-svg/MundoGadget.git

2. Abrir la carpeta en Visual Studio Code

3. Ejecutar `index.html` con Live Server

---

## Propósito del proyecto

Proyecto académico enfocado en el aprendizaje de:

- manipulación del DOM  
- consumo de datos desde JSON  
- filtrado dinámico de información  
- estructura de una tienda virtual de productos tecnológicos  
- trabajo colaborativo con control de versiones
