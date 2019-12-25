package com.uniovi.tests.pageobjects;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
public class PO_ConversationView extends PO_NavView{
	
public static void sendMessage(WebDriver driver, String string) {
		WebElement input = driver.findElement(By.name("contenidoMensaje"));
		input.click();
		input.clear();
		input.sendKeys(string);
		By boton = By.id("BottonEnviar");
		driver.findElement(boton).click();


}
}