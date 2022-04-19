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
  public titulos= ['', 'ID','Producto','Marca/Descripcion','Precio','Sucursal']; 
  public arrayProductosMateriales: IdetProductosConMateriales[]=[];
  public productosMateriales: IdetProductosConMateriales={};
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  verDetalles(content, item: IdetProductosConMateriales) {
    this.modalService.open(content,  this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.nuevo=false;
    this.productosMateriales={};
    /*item.materiaPrima
    item.moneda
    item.producto*/
    console.log(item.producto.fechaProduccion);
    this.productosMateriales= item;
    this.productosMateriales.producto.fechaProduccion=formatDate(item.producto.fechaProduccion, 'yyyy-MM-dd','en');
    
   /* this.compra={};
    this.registrarCompra.compra = {}; 
    this.registrarCompra.sucursal = {};
    this.registrarCompra.moneda = {};
    this.registrarCompra.proveedor = {};
    this.registrarCompra.detalles = [];    

    this.compra.idCompra = item.compra.idCompra;
    this.compra.loginCrea = item.compra.loginCrea;
    this.compra.fechaCompra = formatDate(item.compra.fechaCompra, 'yyyy-MM-dd','en');    
    this.compra.fkSucursal = item.sucursal.idSucursal;
    this.compra.idProveedor = item.proveedor.idProveedor;
    this.compra.iva = item.compra.iva;
    this.compra.fkMoneda = item.moneda.idMoneda;
    this.compra.tasaDia = item.compra.tasaDia;    
    this.compra.subtotal = item.compra.subtotal;
    this.compra.montoIva = item.compra.montoIva;
    this.compra.neto = item.compra.neto;

    this.nombreUser = this.arrayUsuarios.find(us => us.usuario.login==item.compra.loginCrea).usuario.nombres;

    this.registrarCompra.compra = item.compra;    
    this.registrarCompra.sucursal = item.sucursal;
    this.registrarCompra.moneda = item.moneda;           
    this.registrarCompra.compra.fechaCompra = formatDate(item.compra.fechaCompra, 'yyyy-MM-dd','en');
    this.registrarCompra.detalles = item.detalles;
    
    this.detallesCompra = item.detalles;
    this.detallesCompraOLD = item.detalles;
    this.itemsDetalles = this.detallesCompra.length;*/
    
  }


}
