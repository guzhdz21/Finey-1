import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { File } from '@ionic-native/file/ngx';
import { DatosService } from '../../services/datos.service';
import { UsuarioLocal } from '../../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.page.html',
  styleUrls: ['./prueba.page.scss'],
})
export class PruebaPage implements OnInit {

  directories = [];
  folder = '';
  shouldMove = false;
  usuarioCargado: UsuarioLocal = this.datosService.usuarioCarga;
  us: UsuarioLocal;

  text: string = 'nada';

  constructor(
    private file: File,
    private plt: Platform,
    private router: Router,
    private route: ActivatedRoute,
    private datosService: DatosService,
    private http: HttpClient,
    private inAppBrowser: InAppBrowser
    ) { }

  async ngOnInit() {
    await this.datosService.cargarDatos()
    this.usuarioCargado = this.datosService.usuarioCarga;
    this.folder = this.route.snapshot.paramMap.get('folder') || '';
    this.loadDocuments();
  }

  loadDocuments() {
    this.plt.ready().then(() => {
      // Reset for later copy/move operations
      this.shouldMove = false;
 
      this.file.listDir(this.file.dataDirectory, this.folder).then(res => {
        this.directories = res;
      });
    });
  }

  subir() {
    var redirect_uri = "http://localhost:8100/prueba";
    var clientId = "1511199877-4cda13hvjq4d7lo6tm1qf73qe3fngvha.apps.googleusercontent.com";
    var scope = "https://wwww.googleapis.com/auth/drive";
    this.inAppBrowser.create("https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=" + redirect_uri + 
    "&prompt=consent&response_type=code&client_id=" + clientId + "&scope" + scope + "$access_type=offline");
  }

  async guardar() {
    this.datosService.presentToast(this.file.dataDirectory);
    var usuario = JSON.stringify(this.usuarioCargado);
    await this.file.writeFile(this.file.dataDirectory, 'hola.txt',usuario, {replace:true});
    this.file.listDir(this.file.dataDirectory, this.folder).then(res => {
      this.directories = res;
    });

  }

  async leer() {
    var usuario = '';
    await this.file.readAsText(this.file.dataDirectory, 'hola.txt').then( res => {
      usuario = res;
    });
    this.text = usuario;
    this.us = JSON.parse(this.text); 
    this.text = this.us.nombre;
  }
}
