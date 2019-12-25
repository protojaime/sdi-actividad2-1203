package com.uniovi.tests.pageobjects;
import java.util.Date;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import com.uniovi.tests.util.SeleniumUtils;
public class PO_PrivateView extends PO_NavView{
	
	
	static public void search(WebDriver driver, String search) {
		WebElement input = driver.findElement(By.name("busqueda"));
		input.click();
		input.clear();
		input.sendKeys(search);
		By boton = By.className("btn");
		driver.findElement(boton).click();
	}
	
	
	
	
static public void fillFormAddProduct(WebDriver driver,  String descriptionp, 
String detalles, int costp)
{
 
//Esperamos 5 segundo a que carge el DOM porque en algunos equipos falla
 
SeleniumUtils.esperarSegundos(driver, 5);
 
//Rellenemos el campo de descripción
 
WebElement description = driver.findElement(By.name("nombre"));
description.click();
description.clear();
description.sendKeys(descriptionp);
WebElement score = driver.findElement(By.name("descripcion"));
score.click();
score.clear();
score.sendKeys(detalles);
WebElement fecha = driver.findElement(By.name("fecha"));
fecha.click();
fecha.clear();
fecha.sendKeys(new Date().toString());
WebElement cost = driver.findElement(By.name("precio"));
cost.click();
cost.clear();
cost.sendKeys(Integer.toString(costp));
By boton = By.className("btn");
driver.findElement(boton).click();
}
}
