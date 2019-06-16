module.exports = function (app, gestorBD) {

    app.post("/api/autenticar/", function (req, res) {
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        var criterio = {
            email: req.body.email,
            password: seguro
        }

        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                res.status(401); // Unauthorized
                res.json({
                    autenticado: false
                })
            } else {
                var token = app.get('jwt').sign(
                    {usuario: criterio.email, tiempo: Date.now() / 1000},
                    "secreto");
                res.status(200);
                res.json({
                    autenticado: true,
                    token : token
                })
            }

        });
    });

    app.get("/api/producto", function (req, res) {
        gestorBD.obtenerProductos({}, function (productos) {
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
            } else {
                res.status(201);
                res.json({
                    mensaje: "producto insertarda",
                    _id: id
                })
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
        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)}

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