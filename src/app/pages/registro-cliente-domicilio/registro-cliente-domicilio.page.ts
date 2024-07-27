import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Utilerias } from 'src/app/utilities/utilerias';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonGrid, IonRow, IonCol, IonInput, IonTextarea, IonSpinner, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close, searchCircleOutline } from 'ionicons/icons';
// TODO LGDD (punto 4 naranja) Ubicación de domicilio en el mapa.
declare var google: any;

@Component({
  selector: 'app-registro-cliente-domicilio',
  templateUrl: './registro-cliente-domicilio.page.html',
  styleUrls: ['./registro-cliente-domicilio.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, 
    IonContent, IonGrid, IonRow, IonCol, IonInput, IonTextarea, IonSpinner, 
    FormsModule, ReactiveFormsModule]
})

export class RegistroClienteDomicilioPage implements OnInit {

  idDomicilioCliente: string = Utilerias.generaIdUnico();
  descripcion: string = '';
  punto: string = '';

  map: any;
  marker: any;

  latitud: number | null = null;
  longitud: number | null = null;
  domicilio: string  = '';

  domicilioBuscar: string = '';
  formulario!: FormGroup;

  verificandoConexion!: boolean;
  showSpinner!: boolean;
  
  constructor(private modalController: ModalController, private renderer: Renderer2, private fb: FormBuilder) {
    addIcons({ close, searchCircleOutline });
    this.formulario = this.fb.group({
      'domicilioBuscar': new FormControl("", Validators.required),
    });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
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

  cerrarModal() {
    this.modalController.dismiss();
  }

  agregarDomicilio() {
    console.log('domicilio->', this.domicilio);
    console.log('latitud->', this.latitud);
    console.log('longitud->', this.longitud);
    this.descripcion = this.domicilio;
    this.punto = this.latitud + ',' + this.longitud;
    if (this.descripcion && this.punto) {
      this.modalController.dismiss({
        idDomicilioCliente: this.idDomicilioCliente,
        descripcion: this.descripcion,
        punto: this.punto,
      });
    }
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
      } else {
        alert('La geocodificación no tuvo éxito por el siguiente motivo: ' + status);
      }
    });
  }

}
