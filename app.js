// Módulos
var express = require('express');
var app = express();
app.use(express.static('public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    // Debemos especificar todas las headers que se aceptan. Content-Type , token
    next();
});


//logger
let log4js = require('log4js');
log4js.configure({
    appenders: {myWallapop: {type: 'file', filename: 'logs/AppLogs.log'}},
    categories: {default: {appenders: ['app'], level: 'trace'}}
});
let logger = log4js.getLogger('app');
app.set('logger', logger);

var jwt = require('jsonwebtoken');
app.set('jwt', jwt);

var fs = require('fs');
var https = require('https');

var rest = require('request');
app.set('rest',rest);



var expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

var expressSession = require('express-session');
// routerUsuarioSession
var routerUsuarioSession = express.Router();
routerUsuarioSession.use(function(req, res, next) {
    console.log("routerUsuarioSession");
    if ( req.session.usuario ) {
        // dejamos correr la petición
        next();
    } else {
        console.log("va a : "+req.session.destino)
        res.redirect("/identificarse");
    }
});
//Aplicar routerUsuarioSession
app.use("/productos/agregar",routerUsuarioSession);
app.use("/publicaciones",routerUsuarioSession);
app.use("/producto/comprar",routerUsuarioSession);
app.use("/compras",routerUsuarioSession);

//routerAudios
var routerAudios = express.Router();
routerAudios.use(function(req, res, next) {
    console.log("routerAudios");
    var path = require('path');
    var idProducto = path.basename(req.originalUrl, '.mp3');
    gestorBD.obtenerProductoes(
        {id : mongo.ObjectID(idProducto) }, function (productos) {
            if(productos[0].autor == req.session.usuario ){
                next();
            } else {
                var criterio = {
                    usuario : req.session.usuario,
                    productoId : mongo.ObjectID(idProducto)
                };

                gestorBD.obtenerCompras(criterio ,function(compras){
                    if (compras != null && compras.length > 0 ){
                        next();
                        return;
                    } else {
                        res.redirect("/tienda");
                    }
                });
            }
        })
});
//Aplicar routerAudios
app.use("/audios/",routerAudios);

//routerUsuarioAutor
var routerUsuarioAutor = express.Router();
routerUsuarioAutor.use(function(req, res, next) {
    console.log("routerUsuarioAutor");
    var path = require('path');
    var id = path.basename(req.originalUrl);
// Cuidado porque req.params no funciona
// en el router si los params van en la URL.
    gestorBD.obtenerProductos(
        {_id: mongo.ObjectID(id) }, function (productos) {
            if(productos[0].autor.email == req.session.usuario.email ){
                next();
            } else {
                res.redirect("/tienda");
            }
        })
});
//Aplicar routerUsuarioAutor
app.use("/producto/modificar",routerUsuarioAutor);
app.use("/producto/eliminar",routerUsuarioAutor);

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routerUsuarioToken
var routerUsuarioToken = express.Router();
routerUsuarioToken.use(function(req, res, next) {
    // obtener el token, vía headers (opcionalmente GET y/o POST).
    var token = req.headers['token'] || req.body.token || req.query.token;
    if (token != null) {
        // verificar el token
        jwt.verify(token, 'secreto', function(err, infoToken) {
            if (err || (Date.now()/1000 - infoToken.tiempo) > 240 ){
                res.status(403); // Forbidden
                res.json({
                    acceso : false,
                    error: 'Token invalido o caducado'
                });
                // También podríamos comprobar que intoToken.usuario existe
                return;

            } else {
                // dejamos correr la petición
                res.usuario = infoToken.usuario;
                next();
            }
        });

    } else {
        res.status(403); // Forbidden
        res.json({
            acceso : false,
            mensaje: 'No hay Token'
        });
    }
});
// Aplicar routerUsuarioToken
app.use('/api/producto', routerUsuarioToken);

var swig = require('swig');

var mongo = require('mongodb');

var fileUpload = require('express-fileupload');
app.use(fileUpload());

var crypto = require('crypto');

var gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);

// Variables
app.set('port', 8081);
    app.set('db', 'mongodb://admin:sdi1203@sdi-actividad2-1203-shard-00-00-96snv.mongodb.net:27017,sdi-actividad2-1203-shard-00-01-96snv.mongodb.net:27017,sdi-actividad2-1203-shard-00-02-96snv.mongodb.net:27017/test?ssl=true&replicaSet=sdi-actividad2-1203-shard-0&authSource=admin&retryWrites=true&w=majority');
//app.set('db', 'mongodb://localhost:27017/uomusic');
app.set('clave','abcdefg');
app.set('crypto',crypto);


//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app, swig, gestorBD); // (app, param1, param2, etc.)
require("./routes/rproductos.js")(app, swig, gestorBD); // (app, param1, param2, etc.)
require("./routes/rapiproductos.js")(app, gestorBD);

app.get('/', function (req, res) {
    res.redirect('/tienda');
})

app.use( function (err, req, res, next ) {
    console.log("Error producido: " + err); //we log the error in our db
    if (! res.headersSent) {
        res.status(400);
        res.send("Recurso no disponible");
    }
});

// lanzar el servidor
https.createServer({
    key: fs.readFileSync('certificates/alice.key'),
    cert: fs.readFileSync('certificates/alice.crt')
}, app).listen(app.get('port'), function() {
    console.log("Servidor activo");
});
