import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Geolocation, Position } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  // Función para verificar y solicitar permisos de geolocalización
  async checkAndRequestPermission(): Promise<boolean> {
    const hasPermission = await Geolocation.checkPermissions();
    if (hasPermission.location === 'granted') {
      return true;
    } else {
      const permission = await Geolocation.requestPermissions();
      return permission.location === 'granted';
    }
  }

  // Función para obtener la posición actual del usuario

  async getCurrentPosition(): Promise<GeolocationPosition | Position> {
    // Verifica si la plataforma actual es web
    if (!Capacitor.isNativePlatform()) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          position => resolve(position),
          error => reject(error)
        );
      });
    } else {
      // Usar Capacitor para plataformas móviles
      this.checkAndRequestPermission();
      return await Geolocation.getCurrentPosition();
    }
  }

}
