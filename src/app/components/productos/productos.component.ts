//componets
import { Component, OnInit, Input } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons, NgbModalModule, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from "@angular/common";

//models
import { IProductos, IdetProducto, IdetProductosConMateriales } from '../../models/productos';
import { IMoneda } from '../../models/monedas';
import { ImateriPrima } from '../../models/materiaprima';
import { IUnidades } from '../../models/unidades';
import { IUsuarioSucursal } from '../../models/usuarios';
import { IMaterialesEnInventario } from "../../models/inventarios";

//services
import { ProductosService } from '../../services/productos.service';
import { TasasCambiosService } from '../../services/tasacambios.service';
import { MonendasService } from '../../services/monedas.service';
import { MateriaPrimaService } from '../../services/materiaprima.service';
import { PreciosService } from '../../services/precios.service';
import { UnidadesService } from '../../services/unidad.service';
import { UsuariosService } from '../../services/usuarios.service';
import { InventarioMateialesService } from '../../services/inventariomateriales.service';
import { ParametrosService } from '../../services/parametros.service';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  providers: [ ProductosService, TasasCambiosService,  MonendasService , InventarioMateialesService,
    MateriaPrimaService, PreciosService , UnidadesService, UsuariosService],
})
export class ProductosComponent implements OnInit {
  
  public clicked: boolean = true;
  public titulos= ['', 'ID','Producto','Marca/Descripcion','Precio','Sucursal'];
  public arrayInventario: IMaterialesEnInventario []=[];
  public arrayProductosMateriales: IdetProductosConMateriales[]=[];
  public productosMateriales: IdetProductosConMateriales={};
  public producto: IProductos={};
  public detProducto: IProductos={};
  public arrayUsuarios: IUsuarioSucursal[]=[];
  public arrayMonedas: IMoneda[];
  public totalItems: number;
  public nuevo:boolean;  
  public itemsDetalles: number=0;
  public itemsProductos: number=0; 
  public userLogeado: string="";
  public nombreUser: string="";
  public sucursalActual: number;
  closeResult = '';
  modalOptions: NgbModalOptions;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private srvProductos: ProductosService,
    private srvParametros: ParametrosService,
    private srvUsuarios: UsuariosService,
    private srvMonedas: MonendasService,
    private srvInventario: InventarioMateialesService,
    ) { 

    this.modalOptions={
      windowClass:'dark-modal', backdropClass:'dark-modal',  modalDialogClass:'dark-modal', size:'lg', ariaLabelledBy: 'modal-basic-title'
    }
  }
  
  async ngOnInit() {
    console.log('productos');
    this.userLogeado="rlunar";
    await this.llenarArrayUsuarios();    
    this.llenarArrayMonedas();
    this.llenarArrayProductosMateriales(null, 'null', null, null)
  }

  private async llenarArrayUsuarios(){
    
		await this.srvUsuarios.usuariosPorSucursales()
			.toPromise()
			.then(async results => {				
					
				this.arrayUsuarios = results;
				//this.sucursalActual = this.arrayUsuarios.find(u => {u.usuario.login==this.userLogeado}).sucursal.idSucursal;
        for await (const user of results){
          if (user.usuario.login==this.userLogeado){
            this.sucursalActual=user.sucursal.idSucursal;
            return;
          }
        }
			})
			.catch(err => { console.log(err) });
  }

  private llenarArrayInventarioMateriales(){
    this.arrayInventario=[];
		this.srvInventario.consultarTodos()
			.toPromise()
			.then(async results => {				
					
				//this.arrayInventario = results.filter( (i) => {i.fksucursal==this.sucursalActual && i.cantidadAcumulada>0})
        for await (const inv of results){
          if (inv.fksucursal==this.sucursalActual && inv.cantidadAcumulada>0)
            this.arrayInventario.push(inv);
        }
				console.log(`llenarArrayInventarioMateriales: ${this.arrayInventario}`)
			})
			.catch(err => { console.log(err) });
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

  private async llenarArrayMonedas(){
    
		this.arrayMonedas = await this.srvMonedas.consultarTodos().toPromise();
		
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

  private TraerIva(){
    
		this.srvParametros.parametrosUltimaFecha()
			.toPromise()
			.then(results => {
        		
				if (typeof results[0].iva == 'number')	
				  this.producto.iva = results[0].iva;  
        else
          this.producto.iva=0.0;
				
			})
			.catch(err => { console.log(err) });
  }

  private registrarNuevo(){
    
    
    this.productosMateriales.producto={};
    this.productosMateriales.moneda={};
    this.productosMateriales.producto={};
    this.productosMateriales.materiaPrima=[];
    this.productosMateriales.usuarioSucursal={};
    this.producto={};
    
    this.producto.precio= 0;
    this.producto.montoIva = 0;   

    this.TraerIva();

    this.productosMateriales.usuarioSucursal.sucursal= this.arrayUsuarios.find(us => us.usuario.login==this.userLogeado).sucursal;    
    this.productosMateriales.usuarioSucursal.usuario= this.arrayUsuarios.find(us => us.usuario.login==this.userLogeado).usuario;
    this.nombreUser=this.arrayUsuarios.find(us => us.usuario.login==this.userLogeado).usuario.nombres;
    this.productosMateriales.producto.loginCrea=this.userLogeado;
    this.productosMateriales.producto.fechaProduccion= formatDate(Date.now(), 'yyyy-MM-dd','en');
    
   this.productosMateriales.producto.fkSucursal=this.arrayUsuarios.find(us => us.usuario.login==this.userLogeado).sucursal.idSucursal;
  }

  open(content, nuevo: boolean) {
    this.modalService.open(content, {windowClass:'dark-modal', backdropClass:'dark-modal',  modalDialogClass:'dark-modal', size:'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.llenarArrayInventarioMateriales();
    if (nuevo){
      this.nuevo=nuevo;
      this.registrarNuevo();
    }
  }


}
