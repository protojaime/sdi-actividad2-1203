module.exports = function (app, swig, gestorBD) {

    app.get('/compras', function (req, res) {
        var criterio = {"usuario": req.session.usuario};
        gestorBD.obtenerCompras(criterio, function (compras) {
            if (compras == null) {
                res.send("Error al listar ");
            } else {
                var productosCompradasIds = [];
                for (i = 0; i < compras.length; i++) {
                    productosCompradasIds.push(compras[i].productoId);
                }
                var criterio = {"_id": {$in: productosCompradasIds}}
                gestorBD.obtenerProductos(criterio, function (productos) {
                    var respuesta = swig.renderFile('views/bcompras.html',
                        {
                            productos: productos
                        });
                    res.send(respuesta);
                });
            }
        });
    });

    app.get('/producto/comprar/:id', function (req, res) {
        var productoId = gestorBD.mongo.ObjectID(req.params.id);
        var compra = {
            usuario: req.session.usuario,
            productoId: productoId
        }
        gestorBD.insertarCompra(compra, function (idCompra) {
            if (idCompra == null) {
                res.send(respuesta);
            } else {
                res.redirect("/compras");
            }
        });
    });


    app.get('/producto/eliminar/:id', function (req, res) {
        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
        gestorBD.eliminarProducto(criterio, function (productos) {
            if (productos == null) {
                res.send(respuesta);
            } else {
                res.redirect("/publicaciones");
            }
        });
    })

    app.get('/productos/agregar', function (req, res) {

        var respuesta = swig.renderFile('views/bagregar.html', {});
        res.send(respuesta);
    })

    app.get("/productos/:id", function (req, res) {
        var respuesta = 'id: ' + req.params.id;
        res.send(respuesta);
    });

    app.get('/producto/:id', function (req, res) {
        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
        gestorBD.obtenerProductos(criterio, function (productos) {
            if (productos == null) {
                res.send(respuesta);
            } else {
                var configuracion = {
                    url: "https://api.exchangeratesapi.io/latest?base=EUR",
                    method: "get",
                    headers: {
                        "token": "ejemplo",
                    }
                }
                var rest = app.get("rest");
                rest(configuracion, function (error, response, body) {
                    console.log("cod: " + response.statusCode + " Cuerpo :" + body);
                    var objetoRespuesta = JSON.parse(body);
                    var cambioUSD = objetoRespuesta.rates.USD;
// nuevo campo "usd"
                    productos[0].usd = cambioUSD * productos[0].precio;
                    var respuesta = swig.renderFile('views/bproducto.html',
                        {
                            producto: productos[0]
                        });
                    res.send(respuesta);
                })
            }
        })
    });


/*
    app.get("/productos/:genero/:id/", function (req, res) {
        var respuesta = 'id: ' + req.params.id + "<br>"
            + "Genero: " + req.params.genero;
        res.send(respuesta);
    });
*/



    app.post("/producto", function (req, res) {

        var producto = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
 fecha: req.body.fecha,
            precio: req.body.precio,
            autor: req.session.usuario
        }
        // Conectarse
        gestorBD.insertarProducto(producto, function (id) {
            if (id == null) {
                res.send("Error al insertar producto");
            }


            /*
            else {
                if (req.files.portada != null) {
                    var imagen = req.files.portada;
                    imagen.mv('public/portadas/' + id + '.png', function (err) {
                        if (err) {
                            res.send("Error al subir la portada");
                        } else {
                            if (req.files.audio != null) {
                                var audio = req.files.audio;
                                audio.mv('public/audios/' + id + '.mp3', function (err) {
                                    if (err) {
                                        res.send("Error al subir el audio");
                                    } else {
                                        res.redirect("/publicaciones");

                                    }
                                });
                            }
                        }
                    });
                }
            }
            */



        });
    });

    app.get('/promo*', function (req, res) {
        res.send('Respuesta patrón promo* ');
    })

    app.get("/productos", function (req, res) {
        var productos = [{"nombre": "Blank space", "precio": "1.2"}, {
            "nombre": "See you again",
            "precio": "1.3"
        }, {"nombre": "Uptown Funk", "precio": "1.1"}];
        var respuesta = swig.renderFile('views/btienda.html', {
            vendedor: 'Tienda de productos',
            productos: productos
        });

        res.send(respuesta);
    });

    app.get("/tienda", function (req, res) {
        var criterio = {};

        if (req.query.busqueda != null) {
            criterio = {"nombre": {$regex: ".*" + req.query.busqueda + ".*", $options: 'i'}};
        }

        var pg = parseInt(req.query.pg); // Es String !!!
        if (req.query.pg == null) { // Puede no venir el param
            pg = 1;
        }

        gestorBD.obtenerProductosPg(criterio, pg, function (productos, total) {
            if (productos == null) {
                res.send("Error al listar ");
            } else {
                var ultimaPg = total / 4;
                if (total % 4 > 0) { // Sobran decimales
                    ultimaPg = ultimaPg + 1;
                }
                var paginas = []; // paginas mostrar
                for (var i = pg - 2; i <= pg + 2; i++) {
                    if (i > 0 && i <= ultimaPg) {
                        paginas.push(i);
                    }
                }
                var respuesta = swig.renderFile('views/btienda.html',
                    {
                        productos: productos,
                        paginas: paginas,
                        actual: pg
                    });
                res.send(respuesta);
            }
        });
    });


    app.get("/publicaciones", function (req, res) {
        var criterio = {autor: req.session.usuario};
        gestorBD.obtenerProductos(criterio, function (productos) {
            if (productos == null) {
                res.send("Error al listar ");
            } else {
                var respuesta = swig.renderFile('views/bpublicaciones.html',
                    {
                        productos: productos
                    });
                res.send(respuesta);
            }
        });
    });

    app.get('/producto/modificar/:id', function (req, res) {
        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
        gestorBD.obtenerProductos(criterio, function (productos) {
            if (productos == null) {
                res.send(respuesta);
            } else {
                var respuesta = swig.renderFile('views/bproductoModificar.html',
                    {
                        producto: productos[0]
                    });
                res.send(respuesta);
            }
        });
    });

    app.post('/producto/modificar/:id', function (req, res) {
        var id = req.params.id;
        var criterio = {"_id": gestorBD.mongo.ObjectID(id)};
        var producto = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
 fecha: req.body.fecha,precio: req.body.precio
        }
        gestorBD.modificarProducto(criterio, producto, function (result) {
            if (result == null) {
                res.send("Error al modificar ");
            } else {
                res.redirect("/publicaciones");
            }
        });
    });

/*
    function paso1ModificarPortada(files, id, callback) {
        if (files.portada != null) {
            var imagen = files.portada;
            imagen.mv('public/portadas/' + id + '.png', function (err) {
                if (err) {
                    callback(null); // ERROR
                } else {
                    paso2ModificarAudio(files, id, callback); // SIGUIENTE
                }
            });
        } else {
            paso2ModificarAudio(files, id, callback); // SIGUIENTE
        }
    };

    function paso2ModificarAudio(files, id, callback) {
        if (files.audio != null) {
            var audio = files.audio;
            audio.mv('public/audios/' + id + '.mp3', function (err) {
                if (err) {
                    callback(null); // ERROR
                } else {
                    callback(true); // FIN
                }
            });
        } else {
            callback(true); // FIN
        }
    };
*/

}