//componets
import { Component, OnInit, Input } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons, NgbModalModule, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from "@angular/common";

//models


//services


@Component({
  selector: 'app-plantilla',
  templateUrl: './plantilla.component.html',
  //styleUrls: ['./plantilla.component.css']
})
export class plantillaComponent implements OnInit {
  
  public clicked: boolean = true;
  public titulos= ['ID','Fecha','Proveedor','Tasa','Neto','Estatus','Login'];  
  public totalItems: number;
  public nuevo:boolean;  
  public itemsDetalles: number=0; 
  public userLogeado: string="";
  public nombreUser: string="";
  closeResult = '';
  modalOptions: NgbModalOptions;

  constructor() { 

    this.modalOptions={
      windowClass:'dark-modal', backdropClass:'dark-modal',  modalDialogClass:'dark-modal', size:'lg', ariaLabelledBy: 'modal-basic-title'
    }
  }

  ngOnInit(): void {
    console.log('plantilla');
    this.userLogeado="rlunar";
  }

}
