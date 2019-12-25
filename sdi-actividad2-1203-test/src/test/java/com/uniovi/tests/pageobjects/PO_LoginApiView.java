package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_LoginApiView extends PO_NavView {
	
	public static void fillForm(WebDriver driver, String email, String pass) {
		WebElement dni = driver.findElement(By.name("email"));
		dni.click();
		dni.clear();
		dni.sendKeys(email);
		WebElement password = driver.findElement(By.name("password"));
		password.click();
		password.clear();
		password.sendKeys(pass);
		By boton = By.id("boton-login");
		driver.findElement(boton).click();
	}

}

