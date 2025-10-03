// -*- mode: c++ -*-
// ServicioEnEmisora.h: representa un servicio BLE con sus características, pensado para cuando la placa actúe como un periférico al que un cliente (móvil, PC) se pueda conectar y leer/escribir datos.
// La clase interna Caracteristica.h permite definir cada dato individual del servicio (ej. CO₂, temperatura, etc.), con sus propiedades (lectura, escritura, notificación), permisos de acceso y tamaño de datos.
// ----------------------------------------------------------
// Jordi Bataller i Mascarell
// 2019-07-17
// ----------------------------------------------------------
#ifndef SERVICIO_EMISORA_H_INCLUIDO
#define SERVICIO_EMISORA_H_INCLUIDO

// ----------------------------------------------------
// ----------------------------------------------------
#include <vector>

//ERROR DE LIBRERÍAS
#include <bluefruit.h>     // para asegurarte de que se define BLESecurityMode
using BleSecurityMode = SecureMode_t; // alias para mantener compatibilidad

// ----------------------------------------------------
// alReves() utilidad
// pone al revés el contenido de una array en el mismo array

// Se usa porque los UUIDs en BLE se guardan en un orden distinto al que se escriben normalment
// ----------------------------------------------------
template< typename T >
T *  alReves( T * p, int n ) {
  T aux;

  for( int i=0; i < n/2; i++ ) {
	aux = p[i];
	p[i] = p[n-i-1];
	p[n-i-1] = aux;
  }
  return p;
} // ()

// ----------------------------------------------------
// ----------------------------------------------------
// Convierte un string en un array uint8_t, copiándolo al revés
uint8_t * stringAUint8AlReves( const char * pString, uint8_t * pUint, int tamMax ) {

	int longitudString =  strlen( pString );
	int longitudCopiar = ( longitudString > tamMax ? tamMax : longitudString );
	// copio nombreServicio -> uuidServicio pero al revés
	for( int i=0; i<=longitudCopiar-1; i++ ) {
	  pUint[ tamMax-i-1 ] = pString[ i ];
	} // for

	return pUint;
} // ()

// ----------------------------------------------------------
// ----------------------------------------------------------
class ServicioEnEmisora {

public:


  // --------------------------------------------------------
  // --------------------------------------------------------

  // .........................................................
  // .........................................................
  using CallbackCaracteristicaEscrita = void ( uint16_t conn_handle,
											   BLECharacteristic * chr,
											   uint8_t * data, uint16_t len); 
  // .........................................................
  // .........................................................

// En Bluetooth Low Energy (BLE) hay tres sitios distintos donde aparecen UUIDs:
//
// 1. Beacon (iBeacon/Eddystone) → se usa para anunciar datos al aire.
//    En este código: Publicador → beaconUUID.
//
// 2. Servicio → como un "contenedor" de datos dentro de una conexión BLE.
//    En este código: ServicioEnEmisora → uuidServicio.
//
// 3. Característica → cada valor concreto dentro de un servicio.
//    En este código: uuidCaracteristica.
//
// 🔹 En este proyecto actual solo se está trabajando con el modo beacon,
//    que únicamente anuncia valores por el aire.
//    Los UUIDs de servicio/característica están definidos pero no se usan aún,
//    porque no se está montando un servicio BLE con conexión, solo anuncios.

  // .........................................................
  // .........................................................

  /*
  Beacon (lo que usa ahora) → sirve para broadcast: tu placa grita “¡estoy aquí!” + un identificador o pequeño valor. No hay conexión, el móvil solo escucha.
🔹 Ideal para: publicidad, presencia, valores muy simples como un número.

Servicio (uuidServicio) → sirve cuando quieras que tu placa sea reconocida como un dispositivo BLE estándar (ej. un sensor de CO₂). El móvil se conecta y descubre qué servicios ofrece.
🔹 Lo usarías si en el futuro quieres que el móvil vea tu placa como un sensor ambiental oficial, con un “menú de servicios” accesible.

Característica (uuidCaracteristica) → sirve para datos concretos dentro de un servicio. Cada característica es como una “variable compartida” (ej. una para CO₂, otra para temperatura). El móvil puede leer, escribir o suscribirse a cambios.
🔹 Lo usarías si quieres enviar varios datos separados, no solo uno comprimido en un beacon.
*/

  // .........................................................
  // .........................................................


  class Caracteristica {
  private:
	uint8_t uuidCaracteristica[16] = { // el uuid se copia aquí (al revés) a partir de un string-c
	  // least signficant byte, el primero
	  '0', '1', '2', '3', 
	  '4', '5', '6', '7', 
	  '8', '9', 'A', 'B', 
	  'C', 'D', 'E', 'F'
	};

	// 
	// 
	// 
	BLECharacteristic laCaracteristica;

  public:

	// .........................................................
	// .........................................................
	Caracteristica( const char * nombreCaracteristica_ )
	  :
	  laCaracteristica( stringAUint8AlReves( nombreCaracteristica_, &uuidCaracteristica[0], 16 ) )
	{
	  
	} // ()

	// .........................................................
	// .........................................................
  // Constructor con nombre + propiedades + permisos + tamaño
	Caracteristica( const char * nombreCaracteristica_ ,
					uint8_t props,
					BleSecurityMode permisoRead,
					BleSecurityMode permisoWrite, 
					uint8_t tam ) 
	  :
	  Caracteristica( nombreCaracteristica_ ) // llamada al otro constructor
	{
	  (*this).asignarPropiedadesPermisosYTamanyoDatos( props, permisoRead, permisoWrite, tam );
	} // ()

  private:
	// .........................................................
	// CHR_PROPS_WRITE , CHR_PROPS_READ ,  CHR_PROPS_NOTIFY 
	// .........................................................
   // Configura propiedades (read, write, notify)
	void asignarPropiedades ( uint8_t props ) {
	  // no puedo escribir AUN si el constructor llama a esto: Serial.println( " laCaracteristica.setProperties( props ); ");
	  // si intentas hacer Serial.print dentro del constructor, a veces falla porque aún no se ha inicializado el puerto serie
    (*this).laCaracteristica.setProperties( props );
	} // ()

	// .........................................................
	// BleSecurityMode::SECMODE_OPEN  , BleSecurityMode::SECMODE_NO_ACCESS
	// .........................................................
  // Configura permisos de lectura/escritura
	void asignarPermisos( BleSecurityMode permisoRead, BleSecurityMode permisoWrite ) {
	  // no puedo escribir AUN si el constructor llama a esto: Serial.println( "laCaracteristica.setPermission( permisoRead, permisoWrite ); " );
	  (*this).laCaracteristica.setPermission( permisoRead, permisoWrite );
	} // ()

	// .........................................................
	// .........................................................
   // Configura tamaño máximo de datos
	void asignarTamanyoDatos( uint8_t tam ) {
	  // no puedo escribir AUN si el constructor llama a esto: Serial.print( " (*this).laCaracteristica.setFixedLen( tam = " );
	  // no puedo escribir AUN si el constructor llama a esto: Serial.println( tam );
	  // (*this).laCaracteristica.setFixedLen( tam );
	  (*this).laCaracteristica.setMaxLen( tam );
	} // ()

  public:
	// .........................................................
	// .........................................................
  // Configura todo junto
	void asignarPropiedadesPermisosYTamanyoDatos( uint8_t props,
												 BleSecurityMode permisoRead,
												 BleSecurityMode permisoWrite, 
												 uint8_t tam ) {
	  asignarPropiedades( props );
	  asignarPermisos( permisoRead, permisoWrite );
	  asignarTamanyoDatos( tam );
	} // ()
												 

	// .........................................................
	// .........................................................
  // Escribir datos en la característica
	uint16_t escribirDatos( const char * str ) {
	  // Serial.print( " return (*this).laCaracteristica.write( str  = " );
	  // Serial.println( str );

	  uint16_t r = (*this).laCaracteristica.write( str );

	  // Serial.print( ">>>Escritos " ); Serial.print( r ); Serial.println( " bytes con write() " );

	  return r;
	} // ()

	// .........................................................
	// .........................................................
  // Notificar datos a un cliente conectado
	uint16_t notificarDatos( const char * str ) {
	  
	  uint16_t r = laCaracteristica.notify( &str[0] );

	  return r;
	} //  ()

	// .........................................................
	// .........................................................
  // Instalar callback que se dispara cuando alguien escribe la característica
	void instalarCallbackCaracteristicaEscrita( CallbackCaracteristicaEscrita cb ) {
	  (*this).laCaracteristica.setWriteCallback( cb );
	} // ()

	// .........................................................
	// .........................................................
  // Activar la característica (inicializarla en el stack BLE)
	void activar() {
	  err_t error = (*this).laCaracteristica.begin();
	  Globales::elPuerto.escribir(  " (*this).laCaracteristica.begin(); error = " );
	  Globales::elPuerto.escribir(  error );
	} // ()

  }; // class Caracteristica
  
  // --------------------------------------------------------
  // --------------------------------------------------------
private:
  
  uint8_t uuidServicio[16] = { // el uuid se copia aquí (al revés) a partir de un string-c
	// least signficant byte, el primero
	'0', '1', '2', '3', 
	'4', '5', '6', '7', 
	'8', '9', 'A', 'B', 
	'C', 'D', 'E', 'F'
  };

  //
  //
  //
  BLEService elServicio;

  //
  //
  //
  std::vector< Caracteristica * > lasCaracteristicas; // lista de características añadidas

public:
  
  // .........................................................
  // .........................................................
  ServicioEnEmisora( const char * nombreServicio_ )
	:
	elServicio( stringAUint8AlReves( nombreServicio_, &uuidServicio[0], 16 ) )
  {
	
  } // ()
  
  // .........................................................
  // .........................................................
  // Muestra el UUID del servicio (debug)
  void escribeUUID() {
	Serial.println ( "**********" );
	for (int i=0; i<= 15; i++) {
	  Serial.print( (char) uuidServicio[i] );
	}
	Serial.println ( "\n**********" );
  } // ()

  // .........................................................
  // .........................................................
  // Añadir característica a la lista
  void anyadirCaracteristica( Caracteristica & car ) {
	(*this).lasCaracteristicas.push_back( & car );
  } // ()

  // .........................................................
  // .........................................................
  // Activar servicio y todas sus características
  void activarServicio( ) {
	// entiendo que al llegar aquí ya ha sido configurado
	// todo: características y servicio

	err_t error = (*this).elServicio.begin();
	Serial.print( " (*this).elServicio.begin(); error = " );
	Serial.println( error );

	for( auto pCar : (*this).lasCaracteristicas ) {
	  (*pCar).activar();
	} // for

  } // ()

  // .........................................................
  // .........................................................
  operator BLEService&() {
	// "conversión de tipo": si pongo esta clase en un sitio donde necesitan un BLEService
  // si pasas un ServicioEnEmisora donde se espera un BLEService&, se use automáticamente elServicio
	return elServicio;
  } // ()
	
}; // class

#endif

// ----------------------------------------------------------
// ----------------------------------------------------------
// ----------------------------------------------------------
// ----------------------------------------------------------

