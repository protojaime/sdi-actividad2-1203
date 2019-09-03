module.exports = function (app, swig, gestorBD) {

    app.get('/compras', function (req, res) {
        var criterio = {
            vendido: true,
            comprador: req.session.usuario.email
        };
                gestorBD.obtenerProductos(criterio, function (productos) {
                    var respuesta = swig.renderFile('views/bcompras.html',
                        {
                            usuario: req.session.usuario,
                            cartera:  req.session.usuario.cartera,
                            productos: productos
                        });
                    res.send(respuesta);
                });


    });



    app.get('/producto/eliminar/:id', function (req, res) {
       // req.session.usuario
        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
        gestorBD.eliminarProducto(criterio, function (productos) {
            if (productos == null) {
                res.send(respuesta);
            } else {
                res.redirect("/publicaciones?mensaje=el producto se borro correctamente");
            }
        });
    })

    app.get('/productos/agregar', function (req, res) {

        var respuesta = swig.renderFile('views/bagregar.html', {
            usuario: req.session.usuario
        });
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
                            usuario: req.session.usuario,
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
            vendido: false,
            autor: req.session.usuario,
            autoremail: req.session.usuario.email,
            comprador: null
        }
        // Conectarse
        gestorBD.insertarProducto(producto, function (id) {
            if (id == null) {
                res.send("Error al insertar producto");
            }else  if (req.body.precio<0) {
                res.send("Error: se recibio un valor negativo de precio");
            }else {
                res.redirect("/publicaciones?mensaje=el producto se inserto correctamente");
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

    app.get('/producto/comprar/:id', function (req, res) {
     //   console.log("test");
        var criterio = {_id: gestorBD.mongo.ObjectID(req.params.id)};
     //   console.log(req.params.id);
        gestorBD.obtenerProductos(criterio, function (productos) {
            if (productos != null && productos != undefined && productos.length != 0) {
                if (productos[0].precio <= req.session.usuario.cartera) {
                    var criterio2 = {
                        vendido: true,
                        comprador: req.session.usuario.email
                    };
                    gestorBD.modificarProductoaComprado(criterio,criterio2, function (productosModificados) {
                        if (productosModificados != null && productosModificados.modifiedCount != 0) {
                            var criterio2 = {
                                email: req.session.usuario.email
                            };
                            var criterio3 = {
                                cartera: req.session.usuario.cartera - productos[0].precio
                            };
                        //    console.log(req.session.usuario.cartera);
                        //    console.log(productos[0].precio);
                            gestorBD.actualizaCartera(criterio2, criterio3, function (usuariosModificados) {
                                if (usuariosModificados != null && usuariosModificados.modifiedCount != 0) {
                                            req.session.usuario.cartera=req.session.usuario.cartera - productos[0].precio;
                                            res.redirect("/compras?mensaje=el producto se compró correctamente");
                                } else {
                                    res.redirect("/tienda?mensaje=la cartera no pudo actualizarse correctamente" +
                                        "&tipoMensaje=alert-danger");
                                }
                            })
                        } else {
                            res.redirect("/tienda?mensaje=el producto no pudo comprarse correctamente"+
                                "&tipoMensaje=alert-danger");
                        }
                    });
                } else {
                    res.redirect("/tienda?mensaje=No tienes suficiente dinero en tu cartera para adquirir este producto" +
                        "&tipoMensaje=alert-danger ");
                }
            } else {
                res.redirect("/tienda?mensaje=La compra no pudo completarse" +
                    "&tipoMensaje=alert-danger ");
            }
        })
    });



/*



    app.get("/productos", function (req, res) {
        var productos = [
            {"nombre": "Blank space",
                "descripcion": "Blank space",
                "fecha": "Blank space",
            "precio": "1.2"}, {
            "nombre": "See you again",
            "precio": "1.3"
        }, {"nombre": "Uptown Funk",
                "descripcion": "zapato",
                "fecha": "11/08/11",
                "precio": "1.1"}];
        var respuesta = swig.renderFile('views/btienda.html', {
            usuario: req.session.usuario,
            vendedor: 'Tienda de productos',
            productos: productos
        });

        res.send(respuesta);
    });


 */

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
                var ultimaPg = total / 5 ;
                if (total % 5 > 0) { // Sobran decimales
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
                        usuario: req.session.usuario,
                        productos: productos,
                        paginas: paginas,
                        actual: pg
                    });
                res.send(respuesta);
            }
        });
    });


    app.get("/publicaciones", function (req, res) {
        var criterio = {autoremail: req.session.usuario.email};
        gestorBD.obtenerProductos(criterio, function (productos) {
            if (productos == null) {
                res.send("Error al listar ");
            } else {
                var respuesta = swig.renderFile('views/bpublicaciones.html',
                    {
                        usuario: req.session.usuario,
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
            }else  if (req.params.precio<0) {
                res.send("Error: se recibio un valor negativo de precio");
            } else {
                var respuesta = swig.renderFile('views/bproductoModificar.html',
                    {
                        usuario: req.session.usuario,
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
            fecha: req.body.fecha,
            precio: req.body.precio
        }
        gestorBD.modificarProducto(criterio, producto, function (result) {
            if (result == null) {
                res.send("Error al modificar ");
            }else  if (req.body.precio<0) {
                res.send("Error: se recibio un valor negativo de precio");
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