import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { UsuarioLocal, AlertaGeneral, Plan } from '../../interfaces/interfaces';
import { AccionesService } from '../../services/acciones.service';
import { Events, NavController, ModalController, Platform, IonInput } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ModificarPlanesService } from '../../services/modificar-planes.service';


@Component({
  selector: 'app-plan-modificar',
  templateUrl: './plan-modificar.page.html',
  styleUrls: ['./plan-modificar.page.scss'],
})
export class PlanModificarPage implements OnInit {

  //Variable que se recibe del tab2 para saber que plan se modificara
  @Input() index: string;
  @Input() planesOriginales: Plan[];

  invalido: boolean;
  invalido2: boolean;
  invalido3: boolean;
  invalido4: boolean;

  alertado: boolean[];

  @ViewChild('tiempo',{static: true}) tiempo: IonInput;

  //Variable que gaurdan datos para mostrar en el HTML
  alertas: AlertaGeneral[] = [];

  planes: Plan[] = [{
    nombre: '',
    cantidadTotal: 0,
    tiempoTotal: 0,
    cantidadAcumulada: 0,
    tiempoRestante: 0,
    descripcion: '',
    aportacionMensual: 0,
    pausado: false
  }];

  //Variable auxiliar para que el el modal cargue algo ants de recibir los datos
  indexAux: number = 0;

  backButtonSub: Subscription;

  //Constructor con todas las inyecciones y controladores necesarios
  constructor( private nav: NavController,
              public datosService: DatosService,
              private event: Events,
              private accionesService: AccionesService,
              private modalCtrl: ModalController,
              private plt: Platform,
              private router: Router,
              public modificarPlanes: ModificarPlanesService) { }

  ngOnInit() {
    //Metodo que carga datos de los planes y apuntamos al elegido
    this.datosService.cargarDatosPlan();
    this.event.subscribe('planesCargados', () => {
      this.planes = this.datosService.planesCargados;
      this.indexAux = Number(this.index);
    });
    this.invalido = false;
    this.invalido2 = false;
    this.invalido3 = false;
    this.invalido4 = false;

    this.alertado = [];
    this.alertado[1] = false;
    this.alertado[2] = false;
    this.alertado[3] = false;
    this.alertado[4] = false;
  }

  //Metodo que muestra la informacion del elemento seleccionado con boton de informacion
  botonInfo(titulo: string) {
    this.alertas.forEach(element => {
      if(titulo == element.titulo) {
        this.accionesService.presentAlertGenerica(element.titulo, element.mensaje);
        return;
      }
    });
  }

  //Metodo para regresar cerrar el modal
  async regresar() {
    await this.datosService.actualizarPlanes(this.planesOriginales);
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab2');
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

    if(index == 3){
      if(cantidad <= 0){
        this.invalido4 = true;
        
      if(this.alertado[index] == false){
        if(cantidad != null){
          this.accionesService.presentAlertGenerica("Cantidad inválida", "No puedes insertar una cantidad negativa");
          this.alertado[index] = true;
        }
      }
  
      }
      else{
        this.invalido4 = false;
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

  console.log("invalido ", this.invalido);
  console.log("invalido2 ", this.invalido2);
  console.log("invalido3 ", this.invalido3);
  console.log("invalido4 ", this.invalido4);

}

  //Metodo que omite el ingreso de un plan al inciar la app por primera vez
  omitir() {
    //this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab1');
  }

  comprobarTiempo(event, tiempo, index){
    if(tiempo > 0 && tiempo < 97){
      this.invalido2 = false;
    }
    else{

      if(this.alertado[index] == false){
        if(tiempo != null){
          this.accionesService.presentAlertGenerica("Tiempo no válido", "El tiempo de un plan no puede ser menor a 1 mes, ni mayor a 96 meses");
        }
      }
        this.alertado[index] = true;

      this.invalido2 = true;
    }

    //this.tiempoPlan(event);

    console.log("invalido ", this.invalido);
    console.log("invalido2 ", this.invalido2);
    console.log("invalido3 ", this.invalido3);
    console.log("invalido4 ", this.invalido4);
  }

  //Metodo que valdia el tiempo que ingresa el ususario
  tiempoPlan(event) {

    if(this.tiempo.value.toString().includes('.')) {
      this.tiempo.value = this.tiempo.value.substr(0, this.tiempo.value.length - 1);
    }
  }
  
  ionViewDidEnter() {
    this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, () => {
      this.datosService.actualizarPlanes(this.planesOriginales);
      this.modalCtrl.dismiss();
      this.nav.navigateRoot('/tabs/tab2');
    });
  }
}
