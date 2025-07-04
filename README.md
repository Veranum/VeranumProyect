# Sistema de Gestión Hotelera - Veranum 🏨

Sistema de gestión hotelera para la cadena Veranum, diseñado para modernizar y optimizar la administración de reservas, servicios y reportes internos.

## 🚀 Sobre el Proyecto

VERANUM es una empresa hotelera con 30 años de experiencia, que posee 2 hoteles en Santiago y la V Región. Se ha destacado por ser cercana a sus clientes y mantener un contacto fluido con ellos.

Este proyecto implementa un sistema informático que será la columna vertebral para lograr los siguientes objetivos:
* Mejorar sus canales de difusión a través de un sitio web.
* Publicar nuevas ofertas en forma oportuna.
* Optimizar la gestión del restorán.
* Mejorar la forma de realizar reservas de servicios.
* Incluir nuevos servicios a su oferta.

## ✨ Funcionalidades Principales

El sistema implementa las siguientes funcionalidades clave:

* **Gestión de Hoteles y Habitaciones:** Inventario detallado de los hoteles, su ubicación, cantidad de habitaciones y tipos disponibles.
* **Reservas en Línea:** Los clientes pueden registrarse y realizar reservas directamente desde el sitio web, validando la disponibilidad en tiempo real.
* **Administración de Precios:** Permite definir precios por habitación y mantener un historial de tarifas.
* **Gestión de Servicios Adicionales:** Administración de servicios como gimnasio, piscina, spa y canchas de tenis, con su respectivo valor diario.
* **Arriendo de Centros de Eventos:** Permite administrar y ofrecer el arriendo de centros de eventos, validando su disponibilidad.
* **Publicación de Promociones:** El sistema permite ofrecer promociones de descuento, las cuales deben ser validadas por la gerencia.
* **Generación de Reportes:** Emite informes de gestión sobre el porcentaje de uso de habitaciones, servicios, centro de eventos y stock de insumos.
* **Mantenedores de Datos:** Módulos para administrar datos maestros como clientes, proveedores, usuarios, etc..

## 🛠️ Tecnologías Utilizadas

El proyecto está construido íntegramente sobre el ecosistema de JavaScript.

* **Entorno de Ejecución:** Node.js
* **Framework de Servidor:** Express.js.
* **Base de Datos:** MongoDB
* **Herramientas:** Visual Studio Code, Git, GitHub, npm

## ⚙️ Instalación y Puesta en Marcha

Para ejecutar este proyecto en un entorno local, sigue estos pasos:

1.  **Clonar el repositorio**
    ```sh
    git clone [https://github.com/Veranum/VeranumProyect.git](https://github.com/Veranum/VeranumProyect.git)
    ```
2.  **Navegar a la carpeta del proyecto**
    ```sh
    cd VeranumProyect
    ```
3.  **Instalar dependencias**
    Este proyecto utiliza Node.js, por lo que todas las dependencias se gestionan con npm.
    ```sh
    npm install
    ```

4.  **Ejecutar el Proyecto (Backend)**
    Utiliza el siguiente comando para iniciar el Backend (api):
    ```sh
    cd api
    npm run dev
    ```
5.  **Ejecutar el Proyecto (Frontend)**
    Utiliza el siguiente comando para iniciar el Frontend (client):
    ```sh
    cd client
    npm start
    ```
    Una vez ejecutado, el sistema estará corriendo. Abre tu navegador y ve a `http://localhost:3000` (o el puerto que hayas configurado en tu archivo .env).
