import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonInput, IonGrid, IonRow, IonCol, IonSpinner, IonIcon, IonAvatar, IonCard, IonCardContent } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { searchCircleOutline } from 'ionicons/icons';
declare var google: any;

@Component({
  selector: 'app-seleccion-domicilio-mapa',
  templateUrl: './seleccion-domicilio-mapa.component.html',
  styleUrls: ['./seleccion-domicilio-mapa.component.scss'],
  standalone: true,
  imports: [IonCardContent, IonCard, IonAvatar, IonIcon, IonSpinner, IonCol, IonRow, IonGrid, IonInput, IonButton, FormsModule, ReactiveFormsModule]
})
export class SeleccionDomicilioMapaComponent implements OnInit {

  map: any;
  marker: any;

  latitud: number | null = null;
  longitud: number | null = null;
  domicilio: string | null = null;

  domicilioBuscar: string = '';
  formulario!: FormGroup;

// LGDD ini
  verificandoConexion!: boolean;
  showSpinner!: boolean;
// LGDD fin

  constructor(private renderer: Renderer2, private fb: FormBuilder) {
    addIcons({ searchCircleOutline });
    this.formulario = this.fb.group({
      'domicilioBuscar': new FormControl("", Validators.required),
    });
  }

  ngOnInit() {
// LGDD ini
    this.verificandoConexion = true;
    this.showSpinner = true;
// LGDD fin
    this.obtenerUbicacionActual();
// LGDD ini
    this.verificandoConexion = false;
    this.showSpinner = false;
// LGDD fin
  }

  obtenerUbicacionActual() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitud = position.coords.latitude;
        this.longitud = position.coords.longitude;
//        this.latitud = 21.88053455873729;
//        this.longitud = -102.29619026184082;
        this.mostrarMapa();
      });
    } else {
      alert("La geolocalización no es compatible con este dispositivo o navegador.");
    }
  }

  mostrarMapa() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: this.latitud, lng: this.longitud},
      zoom: 15,
      fullscreenControl: false,
      mapId: '1'
    });
    this.mostrarMarcador();
    this.mostrarCoordenadasYDomicilio({lat: this.latitud, lng: this.longitud});
}

  mostrarMarcador() {
    this.marker = new google.maps.marker.AdvancedMarkerElement({
      position: {lat: this.latitud, lng: this.longitud},
      map: this.map,
      title: '¡Tu ubicación actual!',
      content: this.crearContenidoMarcador()
    });
    this.map.addListener('click', (event: any) => {
      if (event.latLng) {
        this.moverMarcador(event.latLng);
      }
    });
  }

  crearContenidoMarcador(): HTMLElement {
    const markerElement = document.createElement('div');
    markerElement.style.backgroundImage = 'url(assets/icon/location-pin2.png)';
    markerElement.style.backgroundSize = 'contain';
    markerElement.style.width = '40px';
    markerElement.style.height = '40px';
    return markerElement;
  }

  moverMarcador(newPosition: any) {
    this.latitud = newPosition.lat();
    this.longitud = newPosition.lng();
    this.marker.position = newPosition;
    this.map.panTo(newPosition); // Opcional: Mueve el centro del mapa al nuevo marcador
    this.mostrarCoordenadasYDomicilio(newPosition);
  }

  mostrarCoordenadasYDomicilio(latlng: any) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latlng }, (results: any, status: any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.domicilio = results[0].formatted_address;
        } else {
          this.domicilio = 'No se han encontrado resultados';
        }
      } else {
        this.domicilio = 'La geolocalización falló debido a: ' + status;
      }
      this.renderer.setProperty(document.getElementById('domicilio'), 'textContent', `${this.domicilio}`);
      this.renderer.setProperty(document.getElementById('latitud'), 'textContent', `${this.latitud}`);
      this.renderer.setProperty(document.getElementById('longitud'), 'textContent', `${this.longitud}`);
      this.formulario.patchValue({
        domicilioBuscar: this.domicilio
      });
    });
  }

  buscarDomicilio() {
    var f = this.formulario.value;
    this.domicilioBuscar = f.domicilioBuscar;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: this.domicilioBuscar, region: 'MX', componentRestrictions: {country: 'MX'}
    }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        const newPosition = results[0].geometry.location;
        this.moverMarcador(newPosition);
        this.map.setCenter(newPosition);
      }else {
        alert('La geocodificación no tuvo éxito por el siguiente motivo: ' + status);
      }
    });
  }

}
