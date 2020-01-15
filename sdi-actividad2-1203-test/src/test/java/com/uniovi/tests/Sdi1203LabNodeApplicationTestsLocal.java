package com.uniovi.tests;


import org.junit.FixMethodOrder;

import org.junit.runners.MethodSorters;

import com.uniovi.tests.Sdi1203LabNodeApplicationTests;


//Ordenamos las pruebas por el nombre del método
@FixMethodOrder( MethodSorters.NAME_ASCENDING)
public class Sdi1203LabNodeApplicationTestsLocal extends Sdi1203LabNodeApplicationTests {
	static String URL = "https://localhost:8081";
}

