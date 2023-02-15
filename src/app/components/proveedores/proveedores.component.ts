//componets
import { Component, OnInit, Input } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons, NgbModalModule, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from "@angular/common";

//models
import { IProveedores } from '../../models/proveedores';

//services
import { ProveedoresService } from '../../services/proveedores.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  //styleUrls: ['./proveedores.component.css'],
  providers: [ProveedoresService]
})
export class ProveedoresComponent implements OnInit {
  
  public clicked: boolean = true;
  public titulos= ['Ver','ID', 'RIF','Proveedor','Estatus']; 
  public ArrayEstatus=['ACTIVO','INACTIVO'];
  public arrayProveedores: IProveedores[]=[];
  public proveedor: IProveedores={};
  public totalItems: number;
  public nuevo:boolean;  
  public itemsDetalles: number=0; 
  public userLogeado: string="";
  public nombreUser: string="";
  closeResult = '';
  modalOptions: NgbModalOptions;

  constructor(
    public toastr: ToastrService,
    public modalService: NgbModal,
    private srvProveedores: ProveedoresService,
  ) { 

    this.modalOptions={
      windowClass:'dark-modal', backdropClass:'dark-modal',  modalDialogClass:'dark-modal', size:'lg', ariaLabelledBy: 'modal-basic-title'
    }
  }

  ngOnInit(): void {
    
    this.userLogeado="rlunar";
    this.llenarArrayProveedores();
  }

  private async llenarArrayProveedores(){    
    await this.srvProveedores.consultarTodos()
        .toPromise()
        .then(results => {                
            this.arrayProveedores = results;            
    })
    .catch(err => { console.log(err) });
  }

  public async guardar(){
    
    if (this.proveedor.estatus==undefined || this.proveedor.estatus.toString()=="" || this.proveedor.estatus=='0'){
      this.showNotification('top', 'center', 'Seleccionar el Estatus',4);
      return;
    }

    if (this.proveedor.NombresProveedor==undefined || this.proveedor.NombresProveedor==""){
      this.showNotification('top', 'center', 'Coloque Nombre del Proveedor',4);
      return;
    }

    if (this.proveedor.direccionProveedor==undefined || this.proveedor.direccionProveedor==""){
        this.showNotification('top', 'center', 'Coloque Direccion del Proveedor',4);
        return;
    }

    if(this.nuevo){
      
      await this.srvProveedores.registrar(this.proveedor)
      .toPromise()
      .then(async result => {
        if (typeof result == "number"){
          this.proveedor.idProveedor=result;          
          this.showNotification('top', 'center', 'Proveedor Registrado',2);
        }      
        await this.llenarArrayProveedores();
      });
    }else{

      this.srvProveedores.actualizar(this.proveedor)
      .toPromise()
      .then(async result => {
        if (result){
          
          this.showNotification('top', 'center', 'Proveedor Actualizado',2);
        }      
        await this.llenarArrayProveedores();
      });
    }
    this.modalService.dismissAll("close");
    
    this.proveedor={};    
  }

  registrarNuevo(){
    
    this.proveedor={};   
    this.nuevo=true;
    this.proveedor.estatus='0';
  }

  verDetalles(content, item: IProveedores) {
    this.modalService.open(content,  this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.nuevo=false;    
    this.proveedor={};
    this.proveedor=item;    
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

}
