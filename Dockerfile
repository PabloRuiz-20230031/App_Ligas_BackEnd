# Usa una imagen base oficial de Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto (usa el mismo que tu backend)
EXPOSE 3000

# Comando para iniciar tu servidor
CMD ["npm", "start"]
