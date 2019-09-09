module.exports = function (app, gestorBD) {




    app.get("/api/producto/", function (req, res) {
        console.log("correo: "+req.headers['email']);
        let criterio = {
            autoremail: {$ne: req.headers['email']}
        };
        gestorBD.obtenerProductos(criterio, function (productos) {
            if (productos == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send(JSON.stringify(productos));
            }
        });
    });

    app.post("/api/autenticar/", function (req, res) {
        console.log("intentando hacer login api");
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        var criterio = {
            email: req.body.email,
            password: seguro
        };
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                console.log("autenificacion no correcta");
                app.get("logger").error("autenificacion no correcta");
                res.status(401); // Unauthorized
                res.json({
                    autenticado: false
                })
            } else {
                console.log("autenificacion correcta");
                app.get("logger").info("autenificacion correcta");

                var token = app.get('jwt').sign(
                    {usuario: criterio.email, tiempo: Date.now() / 1000},
                    "secreto");
                res.status(200);
                res.json({
                    autenticado: true,
                    token : token
                })
                console.log("token:"+ token);
            }

        });
    });


    app.post("/api/producto", function (req, res) {
        var producto = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            fecha: req.body.fecha,
            precio: req.body.precio,
        }
        gestorBD.insertarProducto(producto, function (id) {

            if (id == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
                console.log("se ha producido un error insertando prodcuto desde la api");
                app.get("logger").error("se ha producido un error insertando prodcuto desde la api");
            }else if (req.body.precio < 0) {
                res.status(406);
                res.json({
                    error: "numero negativo"
                })
                console.log("error: se ha intentado introducir un numero negativo como precio");
                app.get("logger").error("error: se ha intentado introducir un numero negativo como precio");
            } else {
                res.status(201);
                res.json({
                    mensaje: "producto insertado",
                    _id: id
                })
                console.log("producto insertado desde la api");
                app.get("logger").info("producto insertado desde la api");
            }
        });
    });

    app.get("/api/producto/:id", function (req, res) {
        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.obtenerProductos(criterio, function (productos) {
            if (productos == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send(JSON.stringify(productos[0]));
            }
        });
  });




    app.delete("/api/producto/:id", function (req, res) {
        var criterio = { $and: [{
            "_id": {$eq: gestorBD.mongo.ObjectID(req.params.id)}},{
                "autoremail": {$eq:  gestorBD.mongo.ObjectID(req.body.email)}}
    ]};

        gestorBD.eliminarProducto(criterio, function (productos) {
            if (productos == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send(JSON.stringify(productos));
            }
        });
    });

    app.put("/api/producto/:id", function (req, res) {

        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};

        var producto = {}; // Solo los atributos a modificar
        if (req.body.nombre != null)
            producto.nombre = req.body.nombre;
        if (req.body.descripcion != null)
            producto.descripcion = req.body.descripcion;
        if (req.body.fecha != null)
            fecha: req.body.fecha;
        if (req.body.precio != null)
            producto.precio = req.body.precio;
        gestorBD.modificarProducto(criterio, producto, function (result) {
            if (result == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.json({
                    mensaje: "producto modificada",
                    _id: req.params.id
                })
            }
        });
    });

}