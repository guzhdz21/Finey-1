import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { File } from '@ionic-native/file/ngx';
import { DatosService } from '../../services/datos.service';
import { UsuarioLocal } from '../../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import{} from ''


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
    private http: HttpClient
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

  async guardar() {
    this.datosService.presentToast(this.file.dataDirectory);
    var usuario = JSON.stringify(this.usuarioCargado);
    await this.file.writeFile(this.file.dataDirectory, 'hola.txt',usuario, {replace:true});
    this.file.listDir(this.file.dataDirectory, this.folder).then(res => {
      this.directories = res;
    });

    var fpath = "path/to/local/file.ext";
    window.plugins.gdrive.uploadFile(fpath,
      function (response) {
      //simple response message with the status
      },
      function (error){
        console.log(error);
      }
    );
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

  getArchivos() {
    return this.http.get<UsuarioLocal>(this.file.dataDirectory + '/' + this.folder + '/hola.json');
  }
}
