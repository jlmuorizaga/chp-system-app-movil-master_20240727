import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, ModalController, IonGrid, IonRow, IonCol, IonList, IonLabel, IonItem } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';
import { AdministradorPedido } from 'src/app/model/administradorPedido';
import { Salsa } from 'src/app/model/salsa';
import { Utilerias } from 'src/app/utilities/utilerias';

@Component({
  selector: 'app-pedido-agrega-salsa',
  templateUrl: './pedido-agrega-salsa.page.html',
  styleUrls: ['./pedido-agrega-salsa.page.scss'],
  standalone: true,
  imports: [IonItem, IonLabel, IonList, IonCol, IonRow, IonGrid, IonIcon, IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class PedidoAgregaSalsaPage implements OnInit {

  administradorPedido: AdministradorPedido;

  salsas!: Salsa[];

  constructor(private modalController: ModalController) {
    this.administradorPedido = AdministradorPedido.getInstance();
    addIcons({ close });
  }

  ngOnInit() {
    this.salsas = this.administradorPedido.getSalsas();
  }

  cerrarModal() {
    this.modalController.dismiss();
  }

  agregarSalsa(idSalsa: string) {
    //Obteniendo salsa a partir del ID
    for (let salsa of this.salsas) {
      if (idSalsa === salsa.id) {
        this.modalController.dismiss({
          id: Utilerias.generaIdUnico(),
          descripcion: salsa.descripcion,
        });
        break;
      }
    }
  }

}
