#Imagen node (¿Cambiar versión?)
FROM node:14

#Exponer el puerto que utiliza la API
EXPOSE 3000

#Directorio de trabajo en el contenedor
WORKDIR /app

#Copiar package.json y el package-lock.json (¿Necesario?)
COPY .env .env

#Copiar package.json y el package-lock.json (¿Nnecesario?)
COPY package*.json ./

#Copiar el archivo de configuración de Sequelize
COPY .sequelizerc ./sequelizerc

#Copiar el resto de aplicación
COPY . /app

#Instalar las dependencias del proyecto
RUN npm install

#Definir comando para ejecutar la aplicación
CMD ["npm", "start"]