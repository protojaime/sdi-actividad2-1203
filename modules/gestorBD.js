module.exports = {
    mongo: null,
    app: null,
    init: function (app, mongo) {
        this.mongo = mongo;
        this.app = app;
    },
    obtenerProductosPg : function(criterio,pg,funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                app.get("logger").error(err.toString());
                funcionCallback(null);
            } else {
                var collection = db.collection('productos');
                collection.count(function(err, count){
                    collection.find(criterio).skip( (pg-1)*5 ).limit( 5 )
                        .toArray(function(err, productos) {
                            if (err) {
                                app.get("logger").error(err.toString());
                                funcionCallback(null);
                            } else {
                                funcionCallback(productos, count);
                            }
                            db.close();
                        });
                });
            }
        });
    },

    eliminarUsuarios: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                app.get("logger").error(err.toString());
                funcionCallback(null);
            } else {
                var collection = db.collection('usuarios');
                collection.removeMany(criterio, function (err, result) {
                    if (err) {
                        app.get("logger").error(err.toString());
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    obtenerCompras : function(criterio,funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                app.get("logger").error(err.toString());
                funcionCallback(null);
            } else {
                var collection = db.collection('productos');
                collection.find(criterio).toArray(function(err, usuarios) {
                    if (err) {
                        app.get("logger").error(err.toString());
                        funcionCallback(null);
                    } else {
                        funcionCallback(usuarios);
                    }
                    db.close();
                });
            }
        });
    },







    insertarCompra: function(compra, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                app.get("logger").error(err.toString());
                funcionCallback(null);
            } else {
                var collection = db.collection('compras');
                collection.insert(compra, function(err, result) {
                    if (err) {
                        app.get("logger").error(err.toString());
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
    eliminarTodosProductos: function( funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                app.get("logger").error(err.toString());
                funcionCallback(null);
            } else {
                var collection = db.collection('productos');
                collection.remove({}, function(err, result) {
                    if (err) {
                        app.get("logger").error(err.toString());
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    eliminarTodosConversaciones: function( funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('conversaciones');
                collection.remove({}, function(err, result) {
                    if (err) {
                        app.get("logger").error(err.toString());
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    eliminarConversacion: function(criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('conversaciones');
                collection.remove(criterio, function(err, result) {
                    if (err) {
                        app.get("logger").error(err.toString());
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },


    eliminarProducto : function(criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('productos');
                collection.remove(criterio, function(err, result) {
                    if (err) {
                        app.get("logger").error(err.toString());
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    eliminarCompra : function(criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                app.get("logger").error(err.toString());
                funcionCallback(null);
            } else {
                var collection = db.collection('compras');
                collection.remove(criterio, function(err, result) {
                    if (err) {
                        app.get("logger").error(err.toString());
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },
    modificarProducto : function(criterio, producto, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('productos');
                collection.update(criterio, {$set: producto}, function(err, result) {
                    if (err) {
                        app.get("logger").error(err.toString());
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },


    modificarProductoaComprado: function (criterio,criterio2, funcionCallback) {

    this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
        if (err) {
            funcionCallback(null);
        } else {
            let collection = db.collection('productos');
            collection.updateOne(criterio, {
                $set: criterio2
            }, function (err, result) {
                if (err) {
                    app.get("logger").error(err.toString());
                    funcionCallback(null);
                } else {
                    funcionCallback(result);
                }
                db.close();
            });
        }
    });
},

    obtenerUsuarios : function(criterio, funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                app.get("logger").error(err.toString());
                funcionCallback(null);
            } else {
                var collection = db.collection('usuarios');
                collection.find(criterio).toArray(function(err, usuarios) {
                    if (err) {
                        app.get("logger").error(err.toString());
                        funcionCallback(null);
                    } else {
                        funcionCallback(usuarios);
                    }
                    db.close();
                });
            }
        });
    },
    insertarUsuario : function(usuario, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                app.get("logger").error(err.toString());
                funcionCallback(null);
            } else {
                var collection = db.collection('usuarios');
                collection.insert(usuario, function(err, result) {
                    if (err) {
                        app.get("logger").error(err.toString());
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
    insertarConversacion : function(conversacion, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('conversaciones');
                collection.insert(conversacion, function(err, result) {
                    if (err) {
                        app.get("logger").error(err.toString());
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },

    insertarMensaje : function(mensaje, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('mensajes');
                collection.insert(mensaje, function(err, result) {
                    if (err) {
                        app.get("logger").error(err.toString());
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]);
                    }
                    db.close();
                });
            }
        });
    },

    obtenerMensajes: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('mensajes');
                collection.find(criterio).toArray(function (err, result) {
                    if (err) {
                        app.get("logger").error(err.toString());
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },

    obtenerConversaciones: function (criterio, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('conversaciones');
                collection.find(criterio).toArray(function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },

    obtenerProductos : function(criterio, funcionCallback){
        this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
            if (err) {
                funcionCallback(null);
            } else {

                var collection = db.collection('productos');
                collection.find(criterio).toArray(function(err, productos) {
                    if (err) {
                        app.get("logger").error(err.toString());
                        funcionCallback(null);
                    } else {
                        funcionCallback(productos);
                    }
                    db.close();
                });
            }
        });
    },
    /*
    insertarMensaje: function (idconversacion,mensaje, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('conversaciones');
                collection.update(
                    { "_id": idconversacion },
                    {$push: {mensajes: mensaje}},
                    function (err, result) {
                    if (err) {
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    },

     */
    insertarProducto: function (producto, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                var collection = db.collection('productos');
                collection.insert(producto, function (err, result) {
                    if (err) {
                        app.get("logger").error(err.toString());
                        funcionCallback(null);
                    } else {
                        funcionCallback(result.ops[0]._id);
                    }
                    db.close();
                });
            }
        });
    },
    actualizaCartera: function (criterio, criterio2, funcionCallback) {
        this.mongo.MongoClient.connect(this.app.get('db'), function (err, db) {
            if (err) {
                funcionCallback(null);
            } else {
                let collection = db.collection('usuarios');
                collection.updateOne(criterio, {
                    $set: criterio2
                }, function (err, result) {
                    if (err) {
                        app.get("logger").error(err.toString());
                        funcionCallback(null);
                    } else {
                        funcionCallback(result);
                    }
                    db.close();
                });
            }
        });
    }


};