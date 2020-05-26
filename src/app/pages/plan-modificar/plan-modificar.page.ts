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

  //Metodo que omite el ingreso de un plan al inciar la app por primera vez
  omitir() {
    //this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab1');
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
