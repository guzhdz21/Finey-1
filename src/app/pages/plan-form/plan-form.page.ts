import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Plan, AlertaGeneral } from '../../interfaces/interfaces';
import { DatosService } from '../../services/datos.service';
import { NavController, ModalController, Platform, IonInput } from '@ionic/angular';
import { AccionesService } from '../../services/acciones.service';
import { UsuarioLocal } from '../../interfaces/interfaces';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { InsertarPlanesService } from '../../services/insertar-planes.service';

@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.page.html',
  styleUrls: ['./plan-form.page.scss'],
})
export class PlanFormPage implements OnInit {


  alertado: boolean[];

  //Variable que viene del Modal registro y del tab2 y nos indica si es la primera vez que abre la app
  @Input() registro: string;
  //ViewChild que nos permite ver el valor del input tiempo
  @ViewChild('tiempo',{static: true}) tiempo: IonInput;

  //Variable para guardar los datos del nuevo plan
  planNuevo: Plan = {
    nombre: '',
    cantidadTotal: null,
    tiempoTotal: null,
    cantidadAcumulada: null,
    tiempoRestante: null,
    descripcion: '',
    aportacionMensual: null,
    pausado: false
  };

  //Variable para guardar la infromacion de las alertas
  alertas: AlertaGeneral[] = [];
  invalido: boolean;
  invalido2: boolean;
  invalido3: boolean;

  //Variable que se usa para el regreso o boton back nativo del celular
  backButtonSub: Subscription;

  constructor( private datosService: DatosService,
                private nav: NavController,
                private modalCtrl: ModalController,
                private accionesService: AccionesService,
                private plt: Platform,
                private router: Router,
                public insertarPlanes: InsertarPlanesService) { }

  ngOnInit() {
    //Metodo que obtiene la informacion de las alertas de un archivo
    this.datosService.getAlertasJson().subscribe(val => {
      this.alertas = val;
    });

    this.invalido = true;
    this.invalido2 = true;
    this.invalido3 = true;
    this.alertado = [];

    this.alertado[1] = false;
    this.alertado[2] = false;
    this.alertado[3] = false;
   }

  //Metodo que omite el ingreso de un plan al inciar la app por primera vez
  omitir() {
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab1');
  }

  //Metodo que imprime la informacion de lo que se debe llenar 
  botonInfo(titulo: string) {
    this.alertas.forEach(element => {
      if(titulo == element.titulo) {
        this.accionesService.presentAlertGenerica(element.titulo, element.mensaje);
        return;
      }
    });
  }

  comprobar(event, cantidad, index){

    if(index == 1){
      if(cantidad <= 0){
        this.invalido3 = true;
  
      if(this.alertado[index] == false){
        if(cantidad != null){
          this.accionesService.presentAlertGenerica("Cantidad inválida", "No puedes insertar una cantidad negativa");
          this.alertado[index] = true;
        }
      }
  
      }
      else{
        this.invalido3 = false;
      }
    }

    else{
      if(cantidad < 0){
        this.invalido = true;
  
      if(this.alertado[index] == false){
        if(cantidad != null){
          this.accionesService.presentAlertGenerica("Cantidad inválida", "No puedes insertar una cantidad negativa");
          this.alertado[index] = true;
        }
      }
    }
    else{
      this.invalido = false;
    }
  }
}

  //Metodo que valdia el tiempo que ingresa el ususario
  tiempoPlan(event, index) {

    if(this.planNuevo.tiempoTotal > 0 && this.planNuevo.tiempoTotal < 97){
      this.invalido2 = false;
    }
    else{

      if(this.alertado[index] == false){
        if(this.planNuevo.tiempoTotal != null){
          this.accionesService.presentAlertGenerica("Tiempo no válido", "El tiempo de un plan no puede ser menor a 1 mes, ni mayor a 96 meses");
        }
      }
        this.alertado[index] = true;

      this.invalido2 = true;
    }

    if(this.tiempo.value.toString().includes('.')) {
      this.tiempo.value = this.tiempo.value.substr(0, this.tiempo.value.length - 1);
    }
  }

  ionViewDidEnter() {
    this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, () => {
      this.modalCtrl.dismiss();
      if(this.registro == 'true'){
        this.nav.navigateRoot('/tabs/tab1');
      } else {
      this.nav.navigateRoot('/tabs/tab2');
      }
    });
  }
}
