// Módulos
var express = require('express');
var app = express();
app.use(express.static('public'));

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
app.use("/canciones/agregar",routerUsuarioSession);
app.use("/publicaciones",routerUsuarioSession);

//routerAudios
var routerAudios = express.Router();
routerAudios.use(function(req, res, next) {
    console.log("routerAudios");
    var path = require('path');
    var idCancion = path.basename(req.originalUrl, '.mp3');
    gestorBD.obtenerCanciones(
        {id : mongo.ObjectID(idCancion) }, function (canciones) {
            if(req.session.usuario && canciones[0].autor == req.session.usuario ){
                next();
            } else {
                res.redirect("/tienda");
            }
        })
});
//Aplicar routerAudios
app.use("/audios/",routerAudios);


var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var swig = require('swig');

var mongo = require('mongodb');

var fileUpload = require('express-fileupload');
app.use(fileUpload());

var crypto = require('crypto');

var gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);

// Variables
app.set('port', 8081);
app.set('db', 'mongodb://admin:sdi1203@tiendamusica-shard-00-00-96snv.mongodb.net:27017,tiendamusica-shard-00-01-96snv.mongodb.net:27017,tiendamusica-shard-00-02-96snv.mongodb.net:27017/test?ssl=true&replicaSet=tiendamusica-shard-0&authSource=admin&retryWrites=true');
//app.set('db', 'mongodb://localhost:27017/uomusic');
app.set('clave','abcdefg');
app.set('crypto',crypto);


//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app, swig, gestorBD); // (app, param1, param2, etc.)
require("./routes/rcanciones.js")(app, swig, gestorBD); // (app, param1, param2, etc.)

// lanzar el servidor
app.listen(app.get('port'), function() {
    console.log("Servidor activo");
});