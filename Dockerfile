# Usar una imagen base oficial de Node.js
FROM node:20-alpine
# Establecer el directorio de trabajo en el contenedor
WORKDIR /app
# Copiar los archivos de la aplicación al contenedor
COPY package*.json ./
# Instalar las dependencias de la aplicación
RUN npm install
# Copiar el resto de los archivos de la aplicación al contenedor
COPY . .
# Construir la aplicación
RUN npm run build
# Exponer el puerto que usará la aplicación
EXPOSE 3000
# Comando para ejecutar la aplicación
CMD ["npm", "run", "preview"]