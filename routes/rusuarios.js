module.exports = function(app, swig, gestorBD) {
    app.get("/usuarios", function(req, res) {
        res.send("ver usuarios");
    });

    app.get("/registrarse", function(req, res) {
        var respuesta = swig.renderFile('views/bregistro.html', {
            usuario: req.session.usuario
        });
        res.send(respuesta);
    });

    app.post('/usuario', function(req, res) {
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        var usuario = {
            nombre : req.body.nombre,
            apellidos : req.body.apellidos,
            email : req.body.email,
            cartera: 100,
            password : seguro,
            tipoUsuario: 1 //tipo 1 usuario normal, tipo 2 admin
        }

        var criterio = {
            email : usuario.email
        }

        gestorBD.obtenerUsuarios(criterio, function(usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                gestorBD.insertarUsuario(usuario, function(id) {
                    if (id == null){
                        res.redirect("/registrarse?mensaje=Error al registrar usuario"+
                            "&tipoMensaje=alert-danger ");
                    } else {
                        res.redirect("/identificarse?mensaje=Nuevo usuario registrado");
                    }
                });
            } else {
                res.redirect("/registrarse?mensaje=ya existe un usuario con ese correo"+
                    "&tipoMensaje=alert-danger");
            }
        });
    });

    app.get("/identificarse", function(req, res) {
        var respuesta = swig.renderFile('views/bidentificacion.html', {
            usuario: req.session.usuario,
        });
        res.send(respuesta);
    });

    app.post("/identificarse", function (req, res) {
            let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
                .update(req.body.password).digest('hex');
            let criterio = {
                email: req.body.email,
                password: seguro
            };
            gestorBD.obtenerUsuarios(criterio, function (usuarios) {
                    if (usuarios === undefined || usuarios.length === 0) {
                        req.session.usuario = undefined;
                        res.redirect("/identificarse" +
                            "?mensaje=Email o password incorrecto" +
                            "&tipoMensaje=alert-danger ");
                        console.log('Email o password incorrecto');
                    } else {
                        req.session.usuario = usuarios[0];
                        console.log('usuario ' + req.session.usuario.email + "logueado");
                        delete req.session.usuario.password;
                        if (req.session.usuario.tipoUsuario == 2)
                            res.redirect("/listadoUsuarios");
                        else
                            res.redirect("/publicaciones");

                        //res.send(respuesta);
                    }
                }
            );

    });


















    app.get("/listadoUsuarios", function(req, res) {
        /*metodo para listado*/
        let criterio = {
            $and: [
                {
                    email: {
                        $ne: req.session.usuario.email
                    }
                },
                {
                    valid: {
                        $ne: false
                    }
                }
            ]
        };
        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null) {
                res.send("Error al listar ");
            } else {
                var respuesta = swig.renderFile('views/blistadoUsuarios.html',
                    {
                        usuario: req.session.usuario,
                        usuarios: usuarios
                    });
                res.send(respuesta);
            }
        });
    });

    app.post("/identificarse", function(req, res) {
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        var criterio = {
            email : req.body.email,
            password : seguro
        }
        gestorBD.obtenerUsuarios(criterio, function(usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                req.session.usuario = null;
                res.redirect("/identificarse" +
                    "?mensaje=Email o password incorrecto"+
                    "&tipoMensaje=alert-danger ");

            } else {
                req.session.usuario = usuarios[0].email;
                res.redirect("/publicaciones");
            }
        });
    });
    app.get('/desconectarse', function (req, res) {
        req.session.usuario = null;
        res.redirect("/tienda");
        //res.send("Usuario desconectado");
    })
/*
    app.get('/EliminarTodosLosProductos', function (req, res) {

        gestorBD.eliminarTodosProductos(function (productos) {
                res.redirect("/tienda");
        });
    })
*/
    app.post('/EliminarUsuarios', function (req, res) {

        let idUsuariosBorrar = req.body.idUsuariosBorrar;
        if (!Array.isArray(idUsuariosBorrar)) {
            let aux = idUsuariosBorrar;
            idUsuariosBorrar = [];
            idUsuariosBorrar.push(aux);
        }
        let criterio = {
            email: {$in: idUsuariosBorrar}
        };
        gestorBD.eliminarUsuarios(criterio, function (usuarios) {
            if (usuarios == null) {
                console.log("Fallo al intentar eliminar los usuarios");
            } else {
                let criterio = {
                    autoremail:
                        {$in: idUsuariosBorrar}
                };
                gestorBD.eliminarProducto(criterio, function (productos) {
                    if (productos == null) {
                        res.redirect("/listadoUsuarios?mensaje=Los productos de alguno/s de los usuario/s borrados no pudieron ser borrados"+
                            "&tipoMensaje=alert-danger ");
                    } else {
                        res.redirect("/listadoUsuarios");
                    }
                });
            }
        });
    })



};