// src/lib/corsProxy.js

import { createProxyMiddleware } from 'http-proxy-middleware';

const corsProxy = createProxyMiddleware({
  target: 'https://api.dev.trocdigital.io', // Cambia esto por la URL de tu servidor API externo
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // Si tu API tiene un prefijo como /api, ajusta esto según sea necesario
  },
  // Opcional: Configura aquí opciones adicionales de CORS según tus necesidades
  // secure: false,
  // xfwd: true,
  // headers: {
  //   'Access-Control-Allow-Origin': '*', // Configura CORS aquí si es necesario
  // },
});

export default corsProxy;
