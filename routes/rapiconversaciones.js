module.exports = function (app, gestorBD) {

    app.get("/api/conversaciones/", function (req, res) {

        let criterio = {
            $or:[{
            autoremail: {$eq: req.headers['email']}},
            {interesadoemail: {$eq: req.headers['email']}}
            ]
        };
        gestorBD.obtenerConversaciones(criterio, function (productos) {
            if (productos == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
              //  console.log(JSON.stringify(productos));
                res.send(JSON.stringify(productos));
            }
        });
    });

    app.get("/api/producto/conversacion/:id", function (req, res) {
        console.log('id: /producto/conversacion: ' + req.params.id);
        console.log(req.headers['email']);

        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)}
        gestorBD.obtenerProductos(criterio, function (productos) {
            console.log("buscamos producto");
            if (productos == null) {
                console.log("no se encontro el producto");
                res.status(500);
                res.json({

                    error: "no se encontro el producto"
                })
            } else {


                var criterio2 = {productoid: productos[0]._id};
                gestorBD.obtenerConversaciones(criterio2, function (conversaciones) {
                    console.log("buscamos conversacion");
                    if (conversaciones == null || conversaciones == undefined || conversaciones.size == 0 || conversaciones.toString()=="") {
                        //la conversación no existe, por lo que creamos una
                        console.log("la conversación no existe, por lo que creamos una");
                        var conversacion = {
                            productoid: productos[0]._id,
                            autoremail: productos[0].autoremail,
                           interesadoemail: req.headers['email'],
                        }

                        gestorBD.insertarConversacion(conversacion, function (conversacionid) {
                            console.log("intentamos insertar");
                            if (conversacionid == null || conversacionid == undefined ) {
                                res.status(500);
                                console.log("no se pudo comenzar la conversacion");
                                app.get("logger").error("no se pudo comenzar la conversacion");

                                res.json({
                                    error: "no se pudo comenzar la conversacion"
                                })
                            }
                            else{
                             //  res.status(200);
                                //res.redirect("/api/conversacion/"+conversacionid);

                                res.send(conversacionid);


                            }

                        });
                    } else {
                         res.status(200);
                        console.log("encontrado");

                     //   console.log(conversaciones.toString());
                      //  res.redirect("/api/conversacion/"+conversaciones._id);
                        res.send(conversaciones[0]._id);
                        //res.redirect("/fail");

                    }
                    });
                }
        });
    });


    app.get("/api/conversacion/:id", function (req, res) {
        console.log('id /api/conversacion/: ' + req.params.id);
        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)}
        gestorBD.obtenerConversaciones(criterio, function (conversaciones) {
            if (conversaciones == null || conversaciones == undefined) {
                res.status(500);
                res.json({
                    error: "no se encontro la conversacion"
                })
            } else {
                res.status(200);
                res.send(JSON.stringify(conversaciones));
            }
        });
    });

    app.get("/api/mensajes/conversacion/:id", function (req, res) {
        var criterio = {"conversacionid": req.params.id,};
        gestorBD.obtenerMensajes(criterio, function (conversaciones) {
            if (conversaciones == null || conversaciones == undefined) {
                res.status(500);
                res.json({
                    error: "no se encontro la conversacion"
                })
            } else {
                res.status(200);
                res.send(JSON.stringify(conversaciones));
            }
        });
    });


    app.get("/api/insertamensaje/conversacion/:id", function (req, res) {
      //  console.log('id inserta mensaje:' + req.params.id);
     //   var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};
        console.log(req.headers['mensaje']);
        gestorBD.insertarMensaje(JSON.parse(req.headers['mensaje']), function (conversaciones) {
            if (conversaciones == null || conversaciones == undefined) {
                res.status(500);
                console.log("no se pudo insertar el mensaje");
                app.get("logger").error("no se pudo insertar el mensaje");
                res.json({
                    error: "no se pudo insertar el mensaje"
                })
            } else {
                res.status(200);
            //    console.log(conversaciones);
                res.send(conversaciones);
            }
        });
    });

    app.delete("/api/conversacion/:id", function (req, res) {
        console.log("correo: "+req.headers['email']);
        console.log(gestorBD.mongo.ObjectID(req.params.id));
        var criterio = { $and: [{
                "_id": {$eq: gestorBD.mongo.ObjectID(req.params.id)}},{
                $or: [{
                "autoremail": {$eq:  req.headers['email']}
                },
                    {
                        "interesadoemail": {$eq: req.headers['email']}
                    }
                    ]


            }
            ]};
        gestorBD.eliminarConversacion(criterio, function (productos) {
            if (productos == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);

                console.log("se elimino la conversación");
                res.send(JSON.stringify(productos));
            }
        });
    });






}