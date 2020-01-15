package com.uniovi.tests;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import java.text.ParseException;
import java.util.Date;

public class MongoDBControl {

	private MongoDatabase db;
	private MongoClient cliente;
	public void connectDatabase() {
		try {
			setMongoClient(new MongoClient(new MongoClientURI(
					"mongodb://admin:sdi1203@sdi-actividad2-1203-shard-00-00-96snv.mongodb.net:27017,sdi-actividad2-1203-shard-00-01-96snv.mongodb.net:27017,sdi-actividad2-1203-shard-00-02-96snv.mongodb.net:27017/test?ssl=true&replicaSet=sdi-actividad2-1203-shard-0&authSource=admin&retryWrites=true&w=majority")));
			setMongodb(getMongoClient().getDatabase("test"));
		} catch (Exception e) {
			System.out.println(e.getStackTrace().toString());
		}
	}

	public void insertarDatos() throws ParseException {
		try {
			
			
			MongoCollection<Document> collection = getMongodb().getCollection("usuarios");
			//admin
			collection.insertOne(new Document()
					.append("nombre", "Jaime")
					.append("apellidos", "F.S.")
					.append("email", "admin@gmail.com")
					//sha256, clave abcdefg del password 'admin'
					.append("password", "ebd5359e500475700c6cc3dd4af89cfd0569aa31724a1bf10ed1e3019dcfdb11")
					.append("tipoUsuario", 2).append("cartera", 100.0));
		
			//resto de usuarios
			collection.insertOne(new Document()
					.append("nombre", "Jaime")
					.append("apellidos", "F.S.")
					.append("email", "test1@gmail.com")
					//sha256, clave abcdefg del password '1234'
					.append("password", "353f9f25a52fbbe951bc1176019b58d9a7dd04b3094bc0334115862118846098")
					.append("tipoUsuario", 1).append("cartera", 100.0));
			collection.insertOne(new Document()
					.append("nombre", "Jaime")
					.append("apellidos", "F.S.")
					.append("email", "test2@gmail.com")
					//sha256, clave abcdefg del password '1234'
					.append("password", "353f9f25a52fbbe951bc1176019b58d9a7dd04b3094bc0334115862118846098")
					.append("tipoUsuario", 1).append("cartera", 100.0));
			collection.insertOne(new Document()
					.append("nombre", "Jaime")
					.append("apellidos", "F.S.")
					.append("email", "test3@gmail.com")
					//sha256, clave abcdefg del password '1234'
					.append("password", "353f9f25a52fbbe951bc1176019b58d9a7dd04b3094bc0334115862118846098")
					.append("tipoUsuario", 1).append("cartera", 100.0));
			collection.insertOne(new Document()
					.append("nombre", "Jaime")
					.append("apellidos", "F.S.")
					.append("email", "test4@gmail.com")
					//sha256, clave abcdefg del password '1234'
					.append("password", "353f9f25a52fbbe951bc1176019b58d9a7dd04b3094bc0334115862118846098")
					.append("tipoUsuario", 1).append("cartera", 100.0));
			collection.insertOne(new Document()
					.append("nombre", "Jaime")
					.append("apellidos", "F.S.")
					.append("email", "borrame@gmail.com")
					//sha256, clave abcdefg del password '1234'
					.append("password", "353f9f25a52fbbe951bc1176019b58d9a7dd04b3094bc0334115862118846098")
					.append("tipoUsuario", 1).append("cartera", 100.0));
			
			
			
			
			 
			
			
			
//productos
			collection = getMongodb().getCollection("productos");
			collection.insertOne(new Document().append("nombre", "Producto 1")
					.append("descripcion","Descripcion Producto 1")
					.append("fecha",new Date().toString())
					.append("precio", 10)
					.append("vendido",false)
					.append("autoremail","test1@gmail.com")
					.append("comprador",null)
					);
	
			collection = getMongodb().getCollection("productos");
			collection.insertOne(new Document().append("nombre", "Producto 2")
					.append("descripcion","Descripcion Producto 2")
					.append("fecha",new Date().toString())
					.append("precio", 50)
					.append("autoremail", "test2@gmail.com")
					.append("vendido",false)
					.append("comprador",null)
					);
			collection = getMongodb().getCollection("productos");
			collection.insertOne(new Document().append("nombre", "Producto 3")
					.append("descripcion","Descripcion Producto 3")
					.append("fecha",new Date().toString())
					.append("precio", 50)
					.append("autoremail", "test3@gmail.com")
					.append("vendido",false)
				
					.append("comprador",null)
					);
			collection = getMongodb().getCollection("productos");
			collection.insertOne(new Document().append("nombre", "Producto 4")
					.append("descripcion","Descripcion Producto 4")
					.append("fecha",new Date().toString())
					.append("precio", 120)
					.append("autoremail", "test4@gmail.com")
					.append("vendido",false)
					.append("comprador",null)
					);
			collection = getMongodb().getCollection("productos");
			collection.insertOne(new Document().append("nombre", "Producto 5")
					.append("descripcion","Descripcion Producto 5")
					.append("fecha",new Date().toString())
					.append("precio", 10)
					.append("autoremail", "test2@gmail.com")
					.append("vendido",false)
					.append("comprador",null)
					);
			collection = getMongodb().getCollection("productos");
			collection.insertOne(new Document().append("nombre", "Producto 6")
					.append("descripcion","Descripcion Producto 6")
					.append("fecha",new Date().toString())
					.append("precio", 10)
					.append("vendido",false)
					.append("autoremail","test1@gmail.com")
					.append("comprador",null)
					);
			
			//conversaciones
						collection = getMongodb().getCollection("conversaciones");
						collection.insertOne(new Document()
								.append("productoid","5e04866f9361dc56f0b8b159")
								.append("autoremail","test2@gmail.com")
								.append("interesadoemail","test3@gmail.com")
								);
						collection.insertOne(new Document()
								.append("productoid","5e04866f9361dc56f0b8b15b")
								.append("autoremail","test4@gmail.com")
								.append("interesadoemail","test3@gmail.com")
								);
						
									
			
			
			
			
			
		
		} catch (Exception ex) {
			System.out.print(ex.toString());
		}

	}


	public void prepararBase() throws ParseException {
		MongoDBControl javaMongodbInsertData = new MongoDBControl();
		javaMongodbInsertData.connectDatabase();	
		javaMongodbInsertData.limpiarBase();
		javaMongodbInsertData.insertarDatos();
	}
	public void limpiarBase() {
		getMongodb().getCollection("productos").drop();
		getMongodb().getCollection("usuarios").drop();
		getMongodb().getCollection("mensajes").drop();
		getMongodb().getCollection("conversaciones").drop();

	}
	
	public void setMongoClient(MongoClient mongoClient) {
		this.cliente = mongoClient;
	}
	public MongoDatabase getMongodb() {
		return db;
	}

	public void setMongodb(MongoDatabase mongodb) {
		this.db = mongodb;
	}

	public MongoClient getMongoClient() {
		return cliente;
	}

}
