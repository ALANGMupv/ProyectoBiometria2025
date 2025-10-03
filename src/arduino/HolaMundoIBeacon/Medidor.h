// -*- mode: c++ -*-
// Medidor.h: La clase proporciona métodos para inicializar el medidor y devolver valores de medidas.
// Actualmente devuelve valores fijos (666 para CO₂ y –12 para temperatura), funcionando como una simulación de un sensor real.
#ifndef MEDIDOR_H_INCLUIDO
#define MEDIDOR_H_INCLUIDO

// ------------------------------------------------------
// ------------------------------------------------------
class Medidor {

  // .....................................................
  // .....................................................
private:

public:

  // .....................................................
  // constructor
  // .....................................................
  Medidor(  ) {
  } // ()

  // .....................................................
  // .....................................................
  void iniciarMedidor() {
	// las cosas que no se puedan hacer en el constructor, if any
  } // ()

  // .....................................................
  // .....................................................
  int medirCO2() {
	return 666; //Aquí es donde tengo que poner el valor que pida Jordi.
  } // ()

  // .....................................................
  // .....................................................
  int medirTemperatura() {
	return -12; // qué frío !
  } // ()
	
}; // class

// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
// ------------------------------------------------------
#endif
