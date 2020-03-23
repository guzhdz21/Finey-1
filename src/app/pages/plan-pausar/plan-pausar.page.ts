import { Component, OnInit, Input } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { Plan } from '../../interfaces/interfaces';
import { NavController, ModalController } from '@ionic/angular';
import { AccionesService } from '../../services/acciones.service';

@Component({
  selector: 'app-plan-pausar',
  templateUrl: './plan-pausar.page.html',
  styleUrls: ['./plan-pausar.page.scss'],
})
export class PlanPausarPage implements OnInit {

  @Input() indexPrioritario;

  planes: Plan[] = this.datosService.planesCargados;
  planes2: Plan[] = [];
  planPrioritario: Plan;

  valido: boolean = true;
  constructor(private datosService: DatosService,
              private nav: NavController,
              private modalCtrl: ModalController,
              private accionesService: AccionesService) { }

  ngOnInit() {
    for (let index = 0; index < this.planes.length; index++) {
      if(index != this.indexPrioritario) {
        this.planes2.push(this.planes[index]);
      } else {
        this.planPrioritario = this.planes[index];
      } 
    }
  }
  
  accionPausar(i) {
    var contador = 0;
    this.valido = false;
    this.planes2[i].pausado = !this.planes[i].pausado
    this.planes2.forEach(element => {
      if(element.pausado == false){
        contador++;
      }
    });
    if(contador > 1) {
      this.valido = true;
    }
  }

 async registrarCambios() {
    var planSecundario: Plan;
    this.planes2.forEach(element => {
      if(element.pausado) {
        element.aportacionMensual = 0;
      } else {
        planSecundario = element;
      }
    });
    if(planSecundario != undefined) {
      this.calcularYRegistar(planSecundario);
      return;
    }
    await this.acomodar(planSecundario);
    this.datosService.actualizarPlanes(this.planes);
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab2');
    return;
  }

  async calcularYRegistar(planSecundario: Plan) {
    var ahorrar = 0;
    this.planPrioritario.aportacionMensual = (this.planPrioritario.cantidadTotal - this.planPrioritario.cantidadAcumulada)/this.planPrioritario.tiempoRestante;
    ahorrar += (planSecundario.cantidadTotal - planSecundario.cantidadAcumulada);
    ahorrar += (this.planPrioritario.cantidadTotal - this.planPrioritario.cantidadAcumulada);
    var gasto = ahorrar/planSecundario.tiempoRestante;
    if(this.planPrioritario.aportacionMensual >= gasto) {
      if(await this.prioridadMax()) {
        return;
      }
      this.planes2 = this.planes2.filter(plan => plan != planSecundario);
      planSecundario.aportacionMensual = 0;
      planSecundario.pausado = true;
      await this.acomodar(planSecundario);
      this.datosService.actualizarPlanes(this.planes);
      this.modalCtrl.dismiss();
      this.nav.navigateRoot('/tabs/tab2');
      return;
    } 
    this.planes2 = this.planes2.filter(plan => plan != planSecundario);
    planSecundario.aportacionMensual = (gasto - this.planPrioritario.aportacionMensual);
    await this.acomodar(planSecundario);
    this.datosService.actualizarPlanes(this.planes);
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab2');
    return;   
  }

  async prioridadMax() {
    var cambiar;
    await this.accionesService.presentAlertPlan([{text: 'Dejar prioritario', handler: (blah) => {cambiar = false}},
                                                  {text: 'Cambiar', handler: (blah) => {cambiar = true}}], 
                                                  'El plan prioritario se lleva mucho dinero de lo ahorrado al mes',
                                                  'Puedes cambiar los planes que pausaste o dejar solo el prioritario');
    return cambiar;
  }

  acomodar(planSecundario: Plan) {
    this.planes = [];
    this.planes.push(this.planPrioritario);
    if(planSecundario != undefined) {
      this.planes.push(planSecundario);
    }
    this.planes2.forEach(element => {
      element.aportacionMensual = 0;
      this.planes.push(element);
    });
  }
}
