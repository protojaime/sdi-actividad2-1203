package com.uniovi.tests;


import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.text.ParseException;
import java.util.List;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;

import com.uniovi.tests.pageobjects.PO_ApiView;
import com.uniovi.tests.pageobjects.PO_ConversationView;
import com.uniovi.tests.pageobjects.PO_LoginApiView;
import com.uniovi.tests.pageobjects.PO_LoginView;
import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_PrivateView;
import com.uniovi.tests.pageobjects.PO_RegisterView;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.util.SeleniumUtils;

//Ordenamos las pruebas por el nombre del método
@FixMethodOrder( MethodSorters.NAME_ASCENDING)
public abstract class Sdi1203LabNodeApplicationTests {
	static MongoDBControl MongoDBControl = new MongoDBControl();
	//En Windows (Debe ser la versión 65.0.1 y desactivar las actualizacioens automáticas)):
	static String PathFirefox64 = "C:\\Program Files\\Mozilla Firefox 65.0.1\\firefox.exe";
	static String Geckdriver022 = "D:\\Desktop\\geckodriver022win64.exe";
	//En MACOSX (Debe ser la versión 65.0.1 y desactivar las actualizacioens automáticas):
	//static String PathFirefox65 = "/Applications/Firefox.app/Contents/MacOS/firefox-bin";
	//static String Geckdriver024 = "/Users/delacal/selenium/geckodriver024mac";
	//Común a Windows y a MACOSX
	static WebDriver driver = getDriver(PathFirefox64, Geckdriver022); 
	static String URL = "https://localhost:8081";
	public static WebDriver getDriver(String PathFirefox, String Geckdriver) {
	System.setProperty("webdriver.firefox.bin", PathFirefox);
	System.setProperty("webdriver.gecko.driver", Geckdriver);
	WebDriver driver = new FirefoxDriver();
	return driver;

	}
	
	
	
	
	
//Antes de cada prueba se navega al URL home de la aplicaciónn
@Before
public void setUp(){
driver.navigate().to(URL);
}
//Después de cada prueba se borran las cookies del navegador
@After
public void tearDown(){
driver.manage().deleteAllCookies();
}
//Antes de la primera prueba
@BeforeClass
static public void begin() throws ParseException {
	driver.manage().deleteAllCookies();
	MongoDBControl.prepararBase();
}
//Al finalizar la última prueba 
@AfterClass
static public void end() throws ParseException {
	MongoDBControl.prepararBase();
//Cerramos el navegador al finalizar las pruebas
driver.quit();
}

@Test
public void PR01() {
	// Vamos al formulario de registro
	driver.navigate().to(URL + "/registrarse");
	// Rellenamos el formulario.
	PO_RegisterView.fillForm(driver, "test6@gmail.com", "test6", "test6", "1234", "1234");
	// COmprobamos que salta el mensaje de registro correcto
	SeleniumUtils.esperarSegundos(driver, 2);
	PO_View.checkElement(driver, "text", "Nuevo usuario registrado");
}

@Test
public void PR02() {
	// Vamos al formulario de registro
	driver.navigate().to(URL + "/registrarse");
	// Rellenamos el formulario.
	PO_RegisterView.fillForm(driver, "", "", "", "1234", "1111");
	//COmprobamos el error de campo vacio de form esta activo en los campod(no lo podemos capturar con selenium)
	WebElement inputElement = driver.findElement(By.name("email"));
	JavascriptExecutor js = (JavascriptExecutor) driver;  
	boolean isRequired = (Boolean) js.executeScript("return arguments[0].required;",inputElement);
	if(isRequired )
	{
	   //element is required and validation error will popup if the field is empty.
	}
	 inputElement = driver.findElement(By.name("nombre"));
	 js = (JavascriptExecutor) driver;  
	 isRequired = (Boolean) js.executeScript("return arguments[0].required;",inputElement);
	if(isRequired )
	{
	   //element is required and validation error will popup if the field is empty.
	}
	 inputElement = driver.findElement(By.name("apellidos"));
	 js = (JavascriptExecutor) driver;  
	 isRequired = (Boolean) js.executeScript("return arguments[0].required;",inputElement);
	if(isRequired )
	{
	   //element is required and validation error will popup if the field is empty.
	}
	 inputElement = driver.findElement(By.name("password"));
	 js = (JavascriptExecutor) driver;  
	 isRequired = (Boolean) js.executeScript("return arguments[0].required;",inputElement);
	if(isRequired )
	{
	   //element is required and validation error will popup if the field is empty.
	}
	inputElement = driver.findElement(By.name("repeatPassword"));
	js = (JavascriptExecutor) driver;  
	isRequired = (Boolean) js.executeScript("return arguments[0].required;",inputElement);
	if(isRequired )
	{
	  //element is required and validation error will popup if the field is empty.
	}
}


@Test
public void PR03() {
	// Vamos al formulario de registro
	driver.navigate().to(URL + "/registrarse");
	// Rellenamos el formulario.
	PO_RegisterView.fillForm(driver, "test1@gmail.com", "aaaaa", "aaaaa", "aaaaa", "aaaaa");
	SeleniumUtils.esperarSegundos(driver, 2);
	PO_View.checkElement(driver, "text", "ya existe un usuario con ese correo");
}


@Test
public void PR04() {
	// Vamos al formulario de logueo.
	driver.navigate().to(URL + "/identificarse");
	// Rellenamos el formulario
	PO_LoginView.fillForm(driver, "test1@gmail.com", "1234");
	//COmprobamos que entramos en la pagina privada de Alumno
	SeleniumUtils.esperarSegundos(driver, 2);
	PO_View.checkElement(driver, "@href", "desconectarse");
}

@Test
public void PR05() {
	// Vamos al formulario de logueo.
	driver.navigate().to(URL + "/identificarse");
	// Rellenamos el formulario
	PO_LoginView.fillForm(driver, "test1@gmail.com", "admin");
	// COmprobamos que entramos en la pagina privada del usuario
	PO_View.checkElement(driver, "text", "Email o password incorrecto");
}

@Test
public void PR06() {
	// Vamos al formulario de logueo.
	driver.navigate().to(URL + "/identificarse");
	// Rellenamos el formulario
	PO_LoginView.fillForm(driver, "", "");
	// COmprobamos que entramos en la pagina privada del usuario
	PO_View.checkElement(driver, "text", "Identificación de usuario");
}


@Test
public void PR07() {
	// Vamos al formulario de logueo.
	driver.navigate().to(URL + "/identificarse");
	// Rellenamos el formulario
	PO_LoginView.fillForm(driver, "Esteemail@noexiste.com", "1234");
	// COmprobamos que entramos en la pagina privada del usuario
	PO_View.checkElement(driver, "text", "Email o password incorrecto");
}

@Test
public void PR08() {
	// Vamos al formulario de logueo.
		driver.navigate().to(URL + "/identificarse");
	// Rellenamos el formulario
	PO_LoginView.fillForm(driver, "test1@gmail.com", "1234");
	// COmprobamos que entramos en la pagina privada del usuario
	PO_View.checkElement(driver, "@href", "desconectarse");
	// Ahora nos desconectamos
	PO_NavView.clickOption(driver, "desconectarse", "@href", "identificarse");
	//PO_View.checkElement(driver, "@href", "identificarse");
}



@Test
public void PR09() {
	ExpectedConditions.invisibilityOfElementLocated(By.partialLinkText("Desconectarse"));
}



@Test
public void PR10() {
	// Vamos al formulario de logueo.
		driver.navigate().to(URL + "/identificarse");
	PO_LoginView.fillForm(driver, "admin@gmail.com", "admin");
	PO_View.checkElement(driver, "@href", "desconectarse");
	
	// Comprobar los 5 usuarios
	PO_View.checkElement(driver, "text", "test1@gmail.com");
	PO_View.checkElement(driver, "text", "test2@gmail.com");
	PO_View.checkElement(driver, "text", "test3@gmail.com");
	PO_View.checkElement(driver, "text", "test4@gmail.com");
		PO_View.checkElement(driver, "text", "borrame@gmail.com");
	// Ahora nos desconectamos
	PO_NavView.clickOption(driver, "desconectarse", "@href", "identificarse");
	
}


@Test
public void PR11() {
	// Vamos al formulario de logueo.
		driver.navigate().to(URL + "/identificarse");
	PO_LoginView.fillForm(driver, "admin@gmail.com", "admin");
	PO_View.checkElement(driver, "@href", "desconectarse");
	
	// buscamos los usuarios
	PO_View.checkElement(driver, "text", "test1@gmail.com");
	PO_View.checkElement(driver, "text", "test2@gmail.com");
	PO_View.checkElement(driver, "text", "test3@gmail.com");
	PO_View.checkElement(driver, "text", "test4@gmail.com");
	PO_View.checkElement(driver, "text", "borrame@gmail.com");
	// Marcar el primero y borrarlo
	driver.findElement(By.xpath(
			"(.//*[normalize-space(text()) and normalize-space(.)='test1@gmail.com'])[1]/following::input[1]"))
			.click();
	By boton = By.className("btn");
	driver.findElement(boton).click();
	// Comprobar que no esta
    SeleniumUtils.esperarSegundos(driver, 2);
	ExpectedConditions.invisibilityOfElementLocated(By.partialLinkText("test1"));
	// Ahora nos desconectamos
	PO_NavView.clickOption(driver, "desconectarse", "@href", "identificarse");
	
}


@Test
public void PR12() {
	// Vamos al formulario de logueo.
		driver.navigate().to(URL + "/identificarse");
	PO_LoginView.fillForm(driver, "admin@gmail.com", "admin");
	PO_View.checkElement(driver, "@href", "desconectarse");
	
	// buscamos los usuarios restantes
	PO_View.checkElement(driver, "text", "test2@gmail.com");
	PO_View.checkElement(driver, "text", "test3@gmail.com");
	PO_View.checkElement(driver, "text", "test4@gmail.com");
	PO_View.checkElement(driver, "text", "borrame@gmail.com");
	// Marcar el primero y borrarlo
	driver.findElement(By
			.xpath("(.//*[normalize-space(text()) and normalize-space(.)='borrame@gmail.com'])[1]/following::input[1]"))
			.click();
	By boton = By.className("btn");
	driver.findElement(boton).click();
	// Comprobar que no esta
    SeleniumUtils.esperarSegundos(driver, 2);
	ExpectedConditions.invisibilityOfElementLocated(By.partialLinkText("borrame"));
	// Ahora nos desconectamos
	PO_NavView.clickOption(driver, "desconectarse", "@href", "identificarse");

}


@Test
public void PR13() {
	// Vamos al formulario de logueo.
		driver.navigate().to(URL + "/identificarse");
	PO_LoginView.fillForm(driver, "admin@gmail.com", "admin");
	PO_View.checkElement(driver, "@href", "desconectarse");
	
	// buscamos los usuarios restantes
	PO_View.checkElement(driver, "text", "test2@gmail.com");
	PO_View.checkElement(driver, "text", "test3@gmail.com");
	PO_View.checkElement(driver, "text", "test4@gmail.com");
	// Marcar el primero y borrarlo
	driver.findElement(By.xpath(
			"(.//*[normalize-space(text()) and normalize-space(.)='test3@gmail.com'])[1]/following::input[1]"))
			.click();
	driver.findElement(By.xpath(
			"(.//*[normalize-space(text()) and normalize-space(.)='test2@gmail.com'])[1]/following::input[1]"))
			.click();
	driver.findElement(By
			.xpath("(.//*[normalize-space(text()) and normalize-space(.)='test4@gmail.com'])[1]/following::input[1]"))
			.click();
	By boton = By.className("btn");
	driver.findElement(boton).click();
	// Comprobar que no esta
	ExpectedConditions.invisibilityOfElementLocated(By.partialLinkText("test3"));
	ExpectedConditions.invisibilityOfElementLocated(By.partialLinkText("test4"));
	ExpectedConditions.invisibilityOfElementLocated(By.partialLinkText("test2"));
	// Ahora nos desconectamos
	PO_NavView.clickOption(driver, "desconectarse", "@href", "identificarse");
	
	
	//reiniciamos la base de datos
	try {
		MongoDBControl.prepararBase();
	} catch (ParseException e) {
		e.printStackTrace();
	}
	
}

@Test
public void PR14() {
	// Vamos al formulario de logueo.
		driver.navigate().to(URL + "/identificarse");
	PO_LoginView.fillForm(driver, "test1@gmail.com", "1234");
	PO_View.checkElement(driver, "@href", "desconectarse");
	//vamos al formulario de agregar

	driver.navigate().to(URL + "/productos/agregar");
	// Rellenamos el formulario.
	PO_PrivateView.fillFormAddProduct(driver, "Prueba 14", "descripcion 14", 100);
	PO_View.checkElement(driver, "text", "el producto se inserto correctamente");
	// Ahora nos desconectamos
	PO_NavView.clickOption(driver, "desconectarse", "@href", "identificarse");
	
}

@Test
public void PR15() {
	// Vamos al formulario de logueo.
		driver.navigate().to(URL + "/identificarse");
	PO_LoginView.fillForm(driver, "test1@gmail.com", "1234");
	PO_View.checkElement(driver, "@href", "desconectarse");
	driver.navigate().to(URL + "/productos/agregar");
	// Rellenamos el formulario.
	PO_PrivateView.fillFormAddProduct(driver, "", "", 100);


	//COmprobamos el error de campo vacio de form esta activo en los campod(no lo podemos capturar con selenium)
	WebElement inputElement = driver.findElement(By.name("descripcion"));
	JavascriptExecutor js = (JavascriptExecutor) driver;  
	boolean isRequired = (Boolean) js.executeScript("return arguments[0].required;",inputElement);
	if(isRequired )
	{
	   //element is required and validation error will popup if the field is empty.
	}
	 inputElement = driver.findElement(By.name("nombre"));
	 js = (JavascriptExecutor) driver;  
	 isRequired = (Boolean) js.executeScript("return arguments[0].required;",inputElement);
	if(isRequired )
	{
	   //element is required and validation error will popup if the field is empty.
	}
	 inputElement = driver.findElement(By.name("fecha"));
	 js = (JavascriptExecutor) driver;  
	 isRequired = (Boolean) js.executeScript("return arguments[0].required;",inputElement);
	if(isRequired )
	{
	   //element is required and validation error will popup if the field is empty.
	}
	 inputElement = driver.findElement(By.name("precio"));
	 js = (JavascriptExecutor) driver;  
	 isRequired = (Boolean) js.executeScript("return arguments[0].required;",inputElement);
	if(isRequired )
	{
	   //element is required and validation error will popup if the field is empty.
	}
	
	
	
	// Ahora nos desconectamos
	PO_NavView.clickOption(driver, "desconectarse", "@href", "identificarse");
	
}

// [Prueba16] Mostrar el listado de ofertas para dicho usuario y comprobar que
// se muestran todas los que existen para este usuario.
@Test
public void PR16() {
	// Vamos al formulario de logueo.
		driver.navigate().to(URL + "/identificarse");
	PO_LoginView.fillForm(driver, "test1@gmail.com", "1234");
	PO_View.checkElement(driver, "@href", "desconectarse");
	driver.navigate().to(URL + "/publicaciones");
	// Comprobar los productos
	PO_View.checkElement(driver, "text", "Producto 6");
	PO_View.checkElement(driver, "text", "Producto 1");
	PO_View.checkElement(driver, "text", "Prueba 14");
	// Ahora nos desconectamos
	PO_NavView.clickOption(driver, "desconectarse", "@href", "identificarse");
	
}


@Test
public void PR17() {
	// Vamos al formulario de logueo.
		driver.navigate().to(URL + "/identificarse");
	PO_LoginView.fillForm(driver, "test1@gmail.com", "1234");
	PO_View.checkElement(driver, "@href", "desconectarse");
	driver.navigate().to(URL + "/publicaciones");
	// Comprobarmos los productos
	PO_View.checkElement(driver, "text", "Producto 1");
	PO_View.checkElement(driver, "text", "Producto 6");
	PO_View.checkElement(driver, "text", "Prueba 14");
	//eliminamos 1 peosucto
	driver.findElement(
			By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='Producto 1'])[1]/following::td[2]"))
			.click();
	driver.findElement(By.linkText("Eliminar")).click();
	ExpectedConditions.invisibilityOfElementLocated(By.partialLinkText("Producto 1"));
	PO_View.checkElement(driver, "text", "el producto se borro correctamente");
	// Ahora nos desconectamos
	PO_NavView.clickOption(driver, "desconectarse", "@href", "identificarse");
	//
}


@Test
public void PR18() {
	// Vamos al formulario de logueo.
		driver.navigate().to(URL + "/identificarse");
	PO_LoginView.fillForm(driver, "test1@gmail.com", "1234");
	PO_View.checkElement(driver, "@href", "desconectarse");
	driver.navigate().to(URL + "/publicaciones");
	
	
	
	// Comprobarmos los productos
	PO_View.checkElement(driver, "text", "Producto 6");
	PO_View.checkElement(driver, "text", "Prueba 14");

	driver.findElement(
			By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='Prueba 14'])[1]/following::td[2]"))
			.click();
	driver.findElement(By.linkText("Eliminar")).click();
	ExpectedConditions.invisibilityOfElementLocated(By.partialLinkText("Prueba 14"));
	PO_View.checkElement(driver, "text", "el producto se borro correctamente");
	// Ahora nos desconectamos
	PO_NavView.clickOption(driver, "desconectarse", "@href", "identificarse");
	//reiniciamos la base de datos
	try {
		MongoDBControl.prepararBase();
	} catch (ParseException e) {
		e.printStackTrace();
	}
}

@Test
public void PR19() {
	// Vamos al formulario de logueo.
		driver.navigate().to(URL + "/identificarse");
	PO_LoginView.fillForm(driver, "test1@gmail.com", "1234");
	PO_View.checkElement(driver, "@href", "desconectarse");
	
	//vamos a la tienda
	driver.navigate().to(URL + "/tienda");
	//leemos los productos
	SeleniumUtils.esperarSegundos(driver, 1);
	List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
	        PO_View.getTimeout());
	assertEquals(5, elementos.size());

	PO_View.checkElement(driver, "text", "Producto 1");
	PO_View.checkElement(driver, "text", "Producto 2");
	PO_View.checkElement(driver, "text", "Producto 3");
	PO_View.checkElement(driver, "text", "Producto 4");
	PO_View.checkElement(driver, "text", "Producto 5");
	PO_PrivateView.search(driver, "");
	//leemos los productos de nuevo, comprobando que son los mismos
	PO_View.checkElement(driver, "text", "Producto 1");
	PO_View.checkElement(driver, "text", "Producto 2");
	PO_View.checkElement(driver, "text", "Producto 3");
	PO_View.checkElement(driver, "text", "Producto 4");
	PO_View.checkElement(driver, "text", "Producto 5");
	// Ahora nos desconectamos
	PO_NavView.clickOption(driver, "desconectarse", "@href", "identificarse");
	

}

@Test
public void PR20() {
	
	// Vamos al formulario de logueo.
	driver.navigate().to(URL + "/identificarse");
PO_LoginView.fillForm(driver, "test1@gmail.com", "1234");
PO_View.checkElement(driver, "@href", "desconectarse");

//vamos a la tienda
driver.navigate().to(URL + "/tienda");
//leemos los productos
SeleniumUtils.esperarSegundos(driver, 1);
List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
        PO_View.getTimeout());
assertEquals(5, elementos.size());
PO_View.checkElement(driver, "text", "Producto 1");
PO_View.checkElement(driver, "text", "Producto 2");
PO_View.checkElement(driver, "text", "Producto 3");
PO_View.checkElement(driver, "text", "Producto 4");
PO_View.checkElement(driver, "text", "Producto 5");
PO_PrivateView.search(driver, "No existente");
//comprobamos que hay 0 productos
SeleniumUtils.esperarSegundos(driver, 1);
try {
List<WebElement> elementos2 = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
        PO_View.getTimeout());
assertTrue(false);//esperamos a la excepcion
}catch(Exception e) {
	
}

//comprobar que los productos anteriores no aparecen
	ExpectedConditions.invisibilityOfElementLocated(By.partialLinkText("Producto 1"));
	ExpectedConditions.invisibilityOfElementLocated(By.partialLinkText("Producto 2"));
	ExpectedConditions.invisibilityOfElementLocated(By.partialLinkText("Producto 3"));
	ExpectedConditions.invisibilityOfElementLocated(By.partialLinkText("Producto 4"));
	ExpectedConditions.invisibilityOfElementLocated(By.partialLinkText("Producto 5"));

	// Ahora nos desconectamos
	PO_NavView.clickOption(driver, "desconectarse", "@href", "identificarse");
	

}

@Test
public void PR21() {
	// Vamos al formulario de logueo.
	driver.navigate().to(URL + "/identificarse");
PO_LoginView.fillForm(driver, "test1@gmail.com", "1234");
PO_View.checkElement(driver, "@href", "desconectarse");
//vamos a la tienda
driver.navigate().to(URL + "/tienda");
//leemos los productos
SeleniumUtils.esperarSegundos(driver, 1);
List<WebElement> productos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
        PO_View.getTimeout());
assertEquals(5, productos.size());
PO_View.checkElement(driver, "text", "Producto 1");
PO_View.checkElement(driver, "text", "Producto 2");
PO_View.checkElement(driver, "text", "Producto 3");
PO_View.checkElement(driver, "text", "Producto 4");
PO_View.checkElement(driver, "text", "Producto 5");
PO_PrivateView.search(driver, "producto");
//comprobar que los productos anteriores aparecen
//leemos los productos
PO_View.checkElement(driver, "text", "Producto 1");
PO_View.checkElement(driver, "text", "Producto 2");
PO_View.checkElement(driver, "text", "Producto 3");
PO_View.checkElement(driver, "text", "Producto 4");
PO_View.checkElement(driver, "text", "Producto 5");
PO_PrivateView.search(driver, "PRODUCTO");

//leemos los productos
SeleniumUtils.esperarSegundos(driver, 1);
List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
      PO_View.getTimeout());
assertEquals(5, elementos.size());

//comprobar que los productos anteriores aparecen
PO_View.checkElement(driver, "text", "Producto 1");
PO_View.checkElement(driver, "text", "Producto 2");
PO_View.checkElement(driver, "text", "Producto 3");
PO_View.checkElement(driver, "text", "Producto 4");
PO_View.checkElement(driver, "text", "Producto 5");
	// Ahora nos desconectamos
	PO_NavView.clickOption(driver, "desconectarse", "@href", "identificarse");
}

@Test
public void PR22() {
	// Vamos al formulario de logueo.
		driver.navigate().to(URL + "/identificarse");
	PO_LoginView.fillForm(driver, "test1@gmail.com", "1234");
	PO_View.checkElement(driver, "@href", "desconectarse");
	//vamos a la tienda
	driver.navigate().to(URL + "/tienda");
	SeleniumUtils.esperarSegundos(driver, 1);
//comprobamos cartera: 100 Euros
	assertEquals("100€",driver.findElement(By.id("cartera")).getText());
	PO_PrivateView.search(driver, "Producto 2");
	//leemos los productos
    List<WebElement> usersList = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
            PO_View.getTimeout());
    assertEquals(1, usersList.size());
    usersList.get(0).findElement(By.linkText("Comprar")).click();
    SeleniumUtils.esperarSegundos(driver, 2);
  //comprobamos cartera: 50 Euros
  	assertEquals("50€",driver.findElement(By.id("cartera")).getText());

	PO_View.checkElement(driver, "text", "el producto se compró correctamente");
	// Ahora nos desconectamos
	PO_NavView.clickOption(driver, "desconectarse", "@href", "identificarse");
	

}

@Test
public void PR23() {
	// Vamos al formulario de logueo.
	driver.navigate().to(URL + "/identificarse");
PO_LoginView.fillForm(driver, "test1@gmail.com", "1234");
PO_View.checkElement(driver, "@href", "desconectarse");
//vamos a la tienda
driver.navigate().to(URL + "/tienda");
//comprobamos cartera: 50 Euros
SeleniumUtils.esperarSegundos(driver, 1);
assertEquals("50€",driver.findElement(By.id("cartera")).getText());
PO_PrivateView.search(driver, "Producto 3");
//leemos los productos
List<WebElement> usersList = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
        PO_View.getTimeout());
assertEquals(1, usersList.size());
usersList.get(0).findElement(By.linkText("Comprar")).click();
SeleniumUtils.esperarSegundos(driver, 2);
//comprobamos cartera: 50 Euros
	assertEquals("0€",driver.findElement(By.id("cartera")).getText());

PO_View.checkElement(driver, "text", "el producto se compró correctamente");
// Ahora nos desconectamos
PO_NavView.clickOption(driver, "desconectarse", "@href", "identificarse");


}

@Test
public void PR24() {
	// Vamos al formulario de logueo.
	driver.navigate().to(URL + "/identificarse");
PO_LoginView.fillForm(driver, "test1@gmail.com", "1234");
PO_View.checkElement(driver, "@href", "desconectarse");
//vamos a la tienda
driver.navigate().to(URL + "/tienda");
SeleniumUtils.esperarSegundos(driver, 1);
//comprobamos cartera: 0 Euros
assertEquals("0€",driver.findElement(By.id("cartera")).getText());
PO_PrivateView.search(driver, "Producto 4");
//leemos los productos
List<WebElement> usersList = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
        PO_View.getTimeout());
assertEquals(1, usersList.size());
usersList.get(0).findElement(By.linkText("Comprar")).click();
//comprobamos cartera: 0 Euros
	assertEquals("0€",driver.findElement(By.id("cartera")).getText());
//comprobamos que el mensaje de error ha saltado
PO_View.checkElement(driver, "text", "No tienes suficiente dinero en tu cartera para adquirir este producto");
// Ahora nos desconectamos
PO_NavView.clickOption(driver, "desconectarse", "@href", "identificarse");


}

@Test
public void PR25() {
	// Vamos al formulario de logueo.
		driver.navigate().to(URL + "/identificarse");
	PO_LoginView.fillForm(driver, "test1@gmail.com", "1234");
	PO_View.checkElement(driver, "@href", "desconectarse");
	driver.navigate().to(URL + "/compras");
//comprobamos que las oferta sson correctas
	PO_View.checkElement(driver, "text", "Producto 3");
	PO_View.checkElement(driver, "text", "Producto 2");

	// Ahora nos desconectamos
	PO_NavView.clickOption(driver, "desconectarse", "@href", "identificarse");

}

@Test
public void PR29() {
	driver.navigate().to(URL + "/cliente.html?w=login");
	// Rellenamos el formulario
	SeleniumUtils.esperarSegundos(driver, 2);
	PO_LoginApiView.fillForm(driver, "test1@gmail.com", "1234");
	// COmprobamos que entramos en la pagina privada del usuario
    SeleniumUtils.esperarSegundos(driver, 2);
	PO_View.checkElement(driver, "text","Mensajear");
}
@Test
public void PR30() {
	driver.navigate().to(URL + "/cliente.html?w=login");
	// Rellenamos el formulario
	PO_LoginApiView.fillForm(driver, "test1@gmail.com", "1111");
	// COmprobamos que entramos en la pagina privada del usuario
	PO_View.checkElement(driver, "text","Usuario no encontrado");
}

@Test
public void PR31() {
	driver.navigate().to(URL + "/cliente.html?w=login");
	// Rellenamos el formulario
	PO_LoginApiView.fillForm(driver, "", "");
	// COmprobamos que entramos en la pagina privada del usuario
	PO_View.checkElement(driver, "text","Usuario no encontrado");
}

@Test
public void PR32() {
	driver.navigate().to(URL + "/cliente.html?w=login");
	// Rellenamos el formulario
	SeleniumUtils.esperarSegundos(driver, 2);
	PO_LoginApiView.fillForm(driver, "test1@gmail.com", "1234");
    SeleniumUtils.esperarSegundos(driver, 2);
	// COmprobamos que entramos en la pagina privada del usuario
    SeleniumUtils.esperarSegundos(driver, 2);
   	PO_View.checkElement(driver, "text","Mensajear");
// los productos que pertenecen al usuario no aparecen
	ExpectedConditions.invisibilityOfElementLocated(By.partialLinkText("Producto 6"));
	ExpectedConditions.invisibilityOfElementLocated(By.partialLinkText("Producto 1"));
	
}

@Test
public void PR33() {
	
	driver.navigate().to(URL + "/cliente.html?w=login");
	// Rellenamos el formulario
	SeleniumUtils.esperarSegundos(driver, 2);
	PO_LoginApiView.fillForm(driver, "test1@gmail.com", "1234");
    SeleniumUtils.esperarSegundos(driver, 2);
	// COmprobamos que entramos en la pagina privada del usuario
    SeleniumUtils.esperarSegundos(driver, 2);
   	PO_View.checkElement(driver, "text","Mensajear");
	//leemos los productos
    List<WebElement> usersList = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
            PO_View.getTimeout());
    assertEquals(4, usersList.size());
    usersList.get(0).findElement(By.linkText("Mensajear")).click();
    //comprobamos que estamos en la conversacion
    SeleniumUtils.esperarSegundos(driver, 6);
    PO_View.checkElement(driver, "text", "Conversacion con el propietario de producto");
	//escribimos un mensaje
    PO_ConversationView.sendMessage(driver, "Deberia poder leer esto");
    SeleniumUtils.esperarSegundos(driver, 3);
    //comprobamos que dicho mensaje aparece
    PO_View.checkElement(driver, "text", "Deberia poder leer esto");
	
}
@Test
public void PR34() {
	
	driver.navigate().to(URL + "/cliente.html?w=login");
	// Rellenamos el formulario
	SeleniumUtils.esperarSegundos(driver, 2);
	PO_LoginApiView.fillForm(driver, "test1@gmail.com", "1234");
    SeleniumUtils.esperarSegundos(driver, 2);
	// COmprobamos que entramos en la pagina privada del usuario
    SeleniumUtils.esperarSegundos(driver, 2);
   	PO_View.checkElement(driver, "text","Mensajear");
	//leemos los productos
    List<WebElement> usersList = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
            PO_View.getTimeout());
    assertEquals(4, usersList.size());
    usersList.get(0).findElement(By.linkText("Mensajear")).click();
    //comprobamos que estamos en la conversacion
    SeleniumUtils.esperarSegundos(driver, 6);
    PO_View.checkElement(driver, "text", "Conversacion con el propietario de producto");
    //comprobamos que el mensaje anterior sigue ahi
    PO_View.checkElement(driver, "text", "Deberia poder leer esto");
	//escribimos un mensaje
    PO_ConversationView.sendMessage(driver, "Nuevo Mensaje");
    SeleniumUtils.esperarSegundos(driver, 3);
    //comprobamos que dicho mensaje aparece
    PO_ConversationView.sendMessage(driver, "Nuevo Mensaje");
	
}
@Test
public void PR36() {
	
	driver.navigate().to(URL + "/cliente.html?w=login");
	// Rellenamos el formulario
	SeleniumUtils.esperarSegundos(driver, 2);
	PO_LoginApiView.fillForm(driver, "test3@gmail.com", "1234");
    SeleniumUtils.esperarSegundos(driver, 2);
	// COmprobamos que entramos en la pagina privada del usuario
    SeleniumUtils.esperarSegundos(driver, 2);
   	PO_View.checkElement(driver, "text","Mensajear");
	//vamos a la lista de conversaciones
    PO_ApiView.gotoConversations(driver);
    //comprobamos que estamos en conversaciones
    PO_View.checkElement(driver, "text", "ID Producto");
  //leemos las conversaciones
    List<WebElement> usersList = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
            PO_View.getTimeout());
    //borramos la primera
    assertEquals(2, usersList.size());
    usersList.get(0).findElement(By.linkText("Borrar")).click();
      //comprobamos que se ha borrado la conversacion
    SeleniumUtils.esperarSegundos(driver, 3);
usersList = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
            PO_View.getTimeout());
    assertEquals(1, usersList.size());
    try {
		MongoDBControl.prepararBase();
	} catch (ParseException e) {
		e.printStackTrace();
	}
}
@Test
public void PR37() {
	
	driver.navigate().to(URL + "/cliente.html?w=login");
	// Rellenamos el formulario
	   SeleniumUtils.esperarSegundos(driver, 2);
	PO_LoginApiView.fillForm(driver, "test3@gmail.com", "1234");
    SeleniumUtils.esperarSegundos(driver, 2);
	// COmprobamos que entramos en la pagina privada del usuario
    SeleniumUtils.esperarSegundos(driver, 2);
   	PO_View.checkElement(driver, "text","Mensajear");
	//vamos a la lista de conversaciones
    PO_ApiView.gotoConversations(driver);
    //comprobamos que estamos en conversaciones
    PO_View.checkElement(driver, "text", "ID Producto");
  //leemos las conversaciones
    List<WebElement> usersList = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
            PO_View.getTimeout());
    //borramos la ultima
    assertEquals(2, usersList.size());
    usersList.get(1).findElement(By.linkText("Borrar")).click();
      //comprobamos que se ha borrado la conversacion
    SeleniumUtils.esperarSegundos(driver, 3);
usersList = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
            PO_View.getTimeout());
    assertEquals(1, usersList.size());

	
}


}

