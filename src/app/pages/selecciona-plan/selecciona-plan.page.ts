import { Component, OnInit } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { Plan } from '../../interfaces/interfaces';
import { Events, NavController, Platform, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { NavigationExtras } from '@angular/router';
import { AccionesService } from '../../services/acciones.service';

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
            private modalCtrl: ModalController,
            private accionesService: AccionesService) { }

            planes: Plan[] = [];
            rutaSeguir: string = "/tabs/tab1";
            backButtonSub: Subscription;
            cantidadTransferir: number;

            planSumar: Plan = {
              nombre: '',
              cantidadTotal: null,
              tiempoTotal: null,
              cantidadAcumulada: null,
              tiempoRestante: null,
              descripcion: '',
              aportacionMensual: null,
              pausado: false
            };

            ngOnInit() {
              this.datosService.cargarDatosPlan();
              this.planes = this.datosService.planesCargados;
              this.event.subscribe('planesCargados', () => {
                this.planes = this.datosService.planesCargados;
              });

              this.planSumar = this.datosService.planASumar;
            }

            //Metodo que hace la transferencia de dinero
            async planSeleccionado(planRestar: Plan){
              await this.accionesService.presentAlertTransferencia();

              if(this.accionesService.tipoTransferencia == true){ //Si es cierta cantidad el TIPO DE TRANSFERENCIA

                await this.accionesService.presentAlertIngresoExtra([{text: 'Ingresa la cantidad de dinero que quieres transferir',handler: (bla) => { 
                  if(parseInt(bla.ingresoExtra) <= 0)  {
                      this.datosService.presentToast('No se puede ingresar 0 ni numeros negativos');
                    } else {
                      this.cantidadTransferir = parseInt(bla.ingresoExtra);
                    }
                  }
                }]);

                console.log("Cantidad a transferir: " + this.cantidadTransferir);

              }
              else{ //Si es la opcion de TODO

              }

              this.datosService.presentToast('Transferencia realizada cone exito');

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
          
