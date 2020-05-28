import { Component, OnInit } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { Plan } from '../../interfaces/interfaces';
import { Events, NavController, Platform, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-selecciona-plan',
  templateUrl: './selecciona-plan.page.html',
  styleUrls: ['./selecciona-plan.page.scss'],
})
export class SeleccionaPlanPage implements OnInit {

  constructor(private datosService: DatosService,
            private event: Events,
            private nav: NavController,
            private plt: Platform,
            private modalCtrl: ModalController) { }

            planes: Plan[] = [];
            rutaSeguir: string = "/tabs/tab1";
            backButtonSub: Subscription;

            ngOnInit() {
              this.datosService.cargarPlanesTerminados();
              this.planes = this.datosService.planesCargados;
              this.event.subscribe('planesCargados', () => {
                this.planes = this.datosService.planesCargados;
              });
            }

            async planSeleccionado(plan: Plan){
              console.log("Plan a sumar: " + this.datosService.planASumar.nombre)
              console.log("Plan a restar: " + plan.nombre)
            }
            
          
            //Metodo que te regresa a la pantalla tab1 en este caso
            async ionViewDidEnter() {
          
              await this.datosService.cargarBloqueoModulos();
              if(this.datosService.bloquearModulos == true){
                this.rutaSeguir = "/tabs/tab3";
                this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, () => {
                  this.modalCtrl.dismiss();
                  this.nav.navigateRoot('/tabs/tab3');
                });
              }
              else{
                this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, () => {
                  this.modalCtrl.dismiss();
                  this.nav.navigateRoot('/tabs/tab1');
                });
              }
            }
          
          }
          
