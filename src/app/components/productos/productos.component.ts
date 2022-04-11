//componets
import { Component, OnInit, Input } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons, NgbModalModule, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from "@angular/common";

//models
import { IProductos, IdetProducto, IdetProductosConMateriales } from '../../models/productos'

//services
import { ProductosService } from '../../services/productos.service'

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  providers: [ ProductosService ],
})
export class ProductosComponent implements OnInit {
  
  public clicked: boolean = true;
  public titulos= ['', 'ID','Producto','Descripcion','Precio','Sucursal']; 
  public arrayProductosMateriales: IdetProductosConMateriales[]=[];
  public producto: IProductos={};
  public detProducto: IProductos={} 
  public totalItems: number;
  public nuevo:boolean;  
  public itemsDetalles: number=0;
  public itemsProductos: number=0; 
  public userLogeado: string="";
  public nombreUser: string="";
  closeResult = '';
  modalOptions: NgbModalOptions;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private srvProductos: ProductosService,
    ) { 

    this.modalOptions={
      windowClass:'dark-modal', backdropClass:'dark-modal',  modalDialogClass:'dark-modal', size:'lg', ariaLabelledBy: 'modal-basic-title'
    }
  }
  
  ngOnInit(): void {
    console.log('productos');
    this.userLogeado="rlunar";
    this.llenarArrayProductosMateriales(null, 'null', null, null)
  }

  private llenarArrayProductosMateriales(id: number, descripcion: string, idMaterial: number, idSucursal: number){
    
		this.srvProductos.productosMateriales(id, descripcion, idMaterial, idSucursal)
			.toPromise()
			.then(results => {				
					
				this.arrayProductosMateriales = results; 
        this.totalItems= this.arrayProductosMateriales.length;
        this.arrayProductosMateriales.sort((a, b ) => b.producto.idProducto - a.producto.idProducto);               
				this.itemsProductos= this.arrayProductosMateriales.length;
			})
			.catch(err => { console.log(err) });
  }

}
