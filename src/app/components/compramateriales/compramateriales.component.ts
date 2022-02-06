//componets
import { Component, OnInit, Input } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
//import { BootstrapModalModule } from 'ngx-bootstrap-modal'
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
//models
import { IMaterialesComprados,IdetallesCompras,IdetallesComprasConMateriales, IfitroCompras, IDetallesCompra} from '../../models/materiales_compras'
//services
import { MaterialesCompradosService } from '../../services/comprasmateriales.service';



@Component({
  selector: "app-compramateriales",
  templateUrl: "compramateriales.component.html",
  providers: [ MaterialesCompradosService]

})
export class CompraMaterialesComponent implements OnInit {

  public arrayDetallesComprasConMateriales: IdetallesComprasConMateriales[]=[];
  public clicked: boolean = true;
  public titulos= ['ID','Fecha','Proveedor','Tasa','Neto','Estatus','Login'];  
  private filtroCompras: IfitroCompras={};
  public totalItems: number;
  closeResult = '';
  
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private srvMaterialesComprados: MaterialesCompradosService
    ) {}  

  ngOnInit(): void {
    this.llenarArrayDetComprasMateriales();
  }

  private llenarArrayDetComprasMateriales(){
    this.filtroCompras = { 
      idCompra: 'NULL', 
      fkMaterial: 'NULL',
      descripcionMaterial: 'NULL',
      idSucursal: 'NULL',
      idProveedor: 'NULL',
      fechaIni: 'NULL',
      fechaFin: 'NULL'
    }
    //'ID','Fecha','Tasa','Moneda','Proveedor','Neto','Estatus','Login','Sucursal'
		this.srvMaterialesComprados.viewFromAnyField(this.filtroCompras)
			.toPromise()
			.then(results => {				
					
				this.arrayDetallesComprasConMateriales = results; 
        this.totalItems= this.arrayDetallesComprasConMateriales.length;
        console.log(this.arrayDetallesComprasConMateriales[0].moneda.abrevMoneda)                
				
			})
			.catch(err => { console.log(err) });
  }

  verModalDetalles(item: IdetallesComprasConMateriales){
    const from='top';
    const align='center';
    console.log(item);
    const color = Math.floor((Math.random() * 5) + 1);
    this.toastr.info('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> Welcome to <b>Black Dashboard Angular</b> - a beautiful freebie for every web developer.', '', {
      disableTimeOut: true,
      closeButton: true,
      enableHtml: true,
      toastClass: "alert alert-info alert-with-icon",
      positionClass: 'toast-' + from + '-' +  align
    });
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}


