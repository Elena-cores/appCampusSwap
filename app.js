var express = require('express');   // importar framework Express
var createError = require('http-errors');   // módulo para manejar errores HTTP
var path = require('path');     //modulo para manejar rutas de archivos
var http = require('http');
//var cookieParser = require('cookie-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var port = process.env.PORT || 3000;


// Configuración del motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);


// Manejo de errores 404 y reenvío al manejador de errores
// Si no se encuentra la ruta, se pasa un error 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Manejador de errores
app.use(function(err, req, res, next) {
  // Definir locales, solo proporcionar errores en desarrollo
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // Renderizar la página de error
  res.status(err.status || 500);
  res.render('error');
});


// Crear el servidor HTTP
const server = http.createServer(app);


// Escuchar en el puerto
server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

server.on('error', (error) => {
  if (error.syscall !== 'listen') throw error;
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // Manejar errores específicos
switch (error.code) {
  case 'EACCES':
    console.error(`${bind} requiere privilegios elevados`);
    process.exit(1);
    break;
  case 'EADDRINUSE':
    console.error(`${bind} ya está en uso`);
    process.exit(1);
    break;
  default:
    throw error;
  }
});

module.exports = app;
