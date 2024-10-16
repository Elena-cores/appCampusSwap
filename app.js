var express = require('express');   // importar framework Express
var createError = require('http-errors');   // módulo para manejar errores HTTP
var path = require('path');     //modulo para manejar rutas de archivos
var http = require('http');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var listadoRouter = require('./routes/listado');
var perfilRouter = require('./routes/perfil');
var favoritosRouter = require('./routes/favoritos');
var buzonRouter = require('./routes/buzon');
var valoracionesRouter = require('./routes/valoraciones');
var olvidadoRouter = require('./routes/olvidado');
var modificarRouter = require('./routes/modificar');
var nuevaPublicacionRouter = require('./routes/nuevaPublicacion');


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
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/listado', listadoRouter);
app.use('/perfil', perfilRouter);
app.use('/favoritos', favoritosRouter);
app.use('/buzon', buzonRouter);
app.use('/valoraciones', valoracionesRouter);
app.use('/olvidado', olvidadoRouter);
app.use('/modificar', modificarRouter);
app.use('/nuevaPublicacion', nuevaPublicacionRouter);


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
  const bind = `Port ${port}`;

  // Manejar errores específicos de puerto
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
