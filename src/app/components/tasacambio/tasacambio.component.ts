//componets
import { Component, OnInit, Input } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons, NgbModalModule, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from "@angular/common";

//models
import { ITasaCambio, ItasaCambioMoneda, ItasaFiltro } from "../../models/tasas_cambios";
import { IMoneda } from '../../models/monedas';

//services
import { TasasCambiosService } from "../../services/tasacambios.service";
import { MonendasService } from '../../services/monedas.service';

@Component({
  selector: 'app-tasacambio',
  templateUrl: './tasacambio.component.html',
  providers: [TasasCambiosService]
  //styleUrls: ['./plantilla.component.css']
})
export class TasaCambioComponent implements OnInit {
  
  private filtro: ItasaFiltro={}
  public arrayTasasCambios: ItasaCambioMoneda[]=[];
  public tasaCambio: ITasaCambio={};
  public arrayMonedas: IMoneda[];
  public monedaSelected: number=0;
  
  public clicked: boolean = true;
  public titulos= ['Ver', 'Fecha','Moneda','Tasa'];  
  public totalItems: number;
  public nuevo:boolean;  
  public itemsDetalles: number=0; 
  public userLogeado: string="";
  public nombreUser: string="";
  closeResult = '';
  modalOptions: NgbModalOptions;

  constructor(
    public modalService: NgbModal,
    public toastr: ToastrService,
    private srvTasaCambio: TasasCambiosService,
    private srvMonedas: MonendasService,
  ) { 

    this.modalOptions={
      windowClass:'dark-modal', backdropClass:'dark-modal',  modalDialogClass:'dark-modal', size:'lg', ariaLabelledBy: 'modal-basic-title'
    }
  }

  ngOnInit(): void {
    
    this.userLogeado="rlunar";
    this.llenarArrayTasasCambio();
    this.llenarArrayMonedas();
  }

  private llenarArrayTasasCambio(){
    
    this.srvTasaCambio.viewFromAnyField(this.filtro)
        .toPromise()
        .then(results => {				
          console.log(results)      
          this.arrayTasasCambios = results; 
          this.totalItems= this.arrayTasasCambios.length;
          this.arrayTasasCambios.sort((a:any, b:any ) => b.tasa.idCambio - a.tasa.idCambio);               
				
	})
	.catch(err => { console.log(err) });
  }

  private async llenarArrayMonedas(){
    
    this.arrayMonedas = await this.srvMonedas.consultarTodos().toPromise();
    
  }

  public async guardarTasa(){

    if (this.monedaSelected==undefined || this.monedaSelected.toString()=="" || this.monedaSelected==0){
      this.showNotification('top', 'center', 'Seleccionar Una Moneda',4);
      return;
    }

    if (this.tasaCambio.tasaDia==undefined || this.tasaCambio.tasaDia.toString()==""){
        this.showNotification('top', 'center', 'Coloque la Tasa del Dia',4);
        return;      
    }

    if (this.tasaCambio.fechaCambio==undefined || this.tasaCambio.fechaCambio.toString()==""){
        this.showNotification('top', 'center', 'Coloque la Fecha del Dia de Cambio',4);
        return; 
    }
    
    this.tasaCambio.fechaCambio=formatDate(this.tasaCambio.fechaCambio, 'yyyy-MM-dd hh:mm','en');
    
    this.tasaCambio.idMoneda=this.monedaSelected;
    if(this.nuevo){
      
      await this.srvTasaCambio.registrar(this.tasaCambio)
      .toPromise()
      .then(async result => {
        if (typeof result == "number"){
          this.tasaCambio.idCambio=result;
          this.showNotification('top', 'center', 'Tasa de Cambio Registrada',2);
        }
        this.filtro={};      
        this.llenarArrayTasasCambio()
      });
    }else{

      this.srvTasaCambio.actualizar(this.tasaCambio)
      .toPromise()
      .then(async result => {
        if (result){
          
          this.showNotification('top', 'center', 'Tasa de Cambio Actualizada',2);
        }      
        this.filtro={};      
        this.llenarArrayTasasCambio()
      });
    }
    this.modalService.dismissAll("close");   
    
  }

  verDetalles(content, item: ITasaCambio) {
    this.tasaCambio={};
    this.modalService.open(content,  this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.nuevo=false;
    this.tasaCambio=item;
    this.monedaSelected = this.tasaCambio.idMoneda;    
  }

  registrarNuevo(){
    this.tasaCambio={};
    this.nuevo=true;
    this.tasaCambio.fechaCambio=formatDate(Date.now(), 'dd/MM/yyyy hh:mm','en');
    console.log(this.tasaCambio.fechaCambio)
  }

  public showNotification(from, align, mensaje, color){

    //const color = Math.floor((Math.random() * 5) + 1);

    switch(color){
      case 1:
      this.toastr.info('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> '+mensaje, '', {
         disableTimeOut: true,
         closeButton: true,
         enableHtml: true,
         toastClass: "alert alert-info alert-with-icon",
         positionClass: 'toast-' + from + '-' +  align
       });
      break;
      case 2:
      this.toastr.success('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> '+mensaje, '', {
         disableTimeOut: false,
         closeButton: true,
         enableHtml: true,
         toastClass: "alert alert-success alert-with-icon",
         positionClass: 'toast-' + from + '-' +  align
       });
      break;
      case 3:
      this.toastr.warning('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span>'+ mensaje, '', {
         disableTimeOut: true,
         closeButton: true,
         enableHtml: true,
         toastClass: "alert alert-warning alert-with-icon",
         positionClass: 'toast-' + from + '-' +  align
       });
      break;
      case 4:
      this.toastr.error('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span>'+mensaje, '', {
         disableTimeOut: true,
         enableHtml: true,
         closeButton: true,
         toastClass: "alert alert-danger alert-with-icon",
         positionClass: 'toast-' + from + '-' +  align
       });
       break;
       case 5:
       this.toastr.show('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span>'+mensaje, '', {
          disableTimeOut: true,
          closeButton: true,
          enableHtml: true,
          toastClass: "alert alert-primary alert-with-icon",
          positionClass: 'toast-' + from + '-' +  align
        });
      break;
      default:
      break;
    }
  }

  open(content, nuevo: boolean) {
    this.modalService.open(content, {windowClass:'dark-modal', backdropClass:'dark-modal',  modalDialogClass:'dark-modal', size:'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    if (nuevo){     
      this.registrarNuevo();
    }
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
