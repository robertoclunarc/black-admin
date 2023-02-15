//componets
import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons, NgbModalModule, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from "@angular/common";

//models
import { IProductos, IdetProducto, IdetProductosConMateriales, IDetProductos } from '../../models/productos';
import { IMoneda } from '../../models/monedas';
//import { ImateriPrima } from '../../models/materiaprima';
import { IUnidades } from '../../models/unidades';
import { IUsuarioSucursal } from '../../models/usuarios';
import { IMaterialesEnInventario } from "../../models/inventarios";
import { Iprecios } from "src/app/models/precios";

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
  public titulos= ['', 'ID','Producto','Marca/Descripcion','Precio','Sucursal', 'Fecha'];
  public arrayInventario: IMaterialesEnInventario []=[];
  materialSeleted: IMaterialesEnInventario={};
  
  cantSelected: number=1;
  unidadSelected: string;
  precioCalculado: number;
  
  subTotal: number=0;
  totalGastos: number=0;
  modenaSelected: string="";
  typeMonedaSeleted: IMoneda={};
  ultimoPrecio: Iprecios={}
  public arrayProductosMateriales: IdetProductosConMateriales[]=[];
  public productosMateriales: IdetProductosConMateriales={};
  public producto: IProductos={};
  arrayUnidad: IUnidades[]=[];  
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
  public cboMaterialDisabled: boolean=true;
  closeResult = '';
  modalOptions: NgbModalOptions;

  @ViewChild('cboMaterial') cboMaterial!: ElementRef<HTMLSelectElement> //ElementRef<HTMLInputElement>;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private srvProductos: ProductosService,
    private srvParametros: ParametrosService,
    private srvUsuarios: UsuariosService,
    private srvMonedas: MonendasService,
    private srvInventario: InventarioMateialesService,
    private srvUnidades: UnidadesService,
    private srvPrecios: PreciosService,
    
    ) { 

    this.modalOptions={
      windowClass:'dark-modal', backdropClass:'dark-modal',  modalDialogClass:'dark-modal', size:'lg', ariaLabelledBy: 'modal-basic-title'
    }
  }
  
  async ngOnInit() {
    
    this.userLogeado="rlunar";
    await this.llenarArrayUsuarios();
    this.llenarArrayUnidades();   
    this.llenarArrayMonedas();
    this.llenarArrayProductosMateriales(null, 'null', null, null);
    this.materialSeleted.MateriaPrima={}
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
				//console.log(`llenarArrayInventarioMateriales: ${this.arrayInventario}`)
			})
			.catch(err => { console.log(err) });
  }

  private llenarArrayUnidades(){
    
		this.srvUnidades.consultarTodos()
			.toPromise()
			.then(results => {				
					
				this.arrayUnidad = results;
				
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
        //console.log(results);
			})
			.catch(err => { console.log(err) });
  }

  private async llenarArrayMonedas(){
    
		this.arrayMonedas = await this.srvMonedas.consultarTodos().toPromise();
		
  }

  async selecionarMoneda(e){
    
    for await (let m of this.arrayMonedas)
      if (m.idMoneda==e){
        this.typeMonedaSeleted=m;
      }
      this.modenaSelected=this.typeMonedaSeleted.abrevMoneda;
      if (this.typeMonedaSeleted.idMoneda!=undefined && this.typeMonedaSeleted.idMoneda.toString()!="")
        this.cboMaterialDisabled=false;
      else
        this.cboMaterialDisabled=true;  
  }

  
  async calcularPrecio(e){
    
    let factor: number=this.cantSelected;
    if(this.materialSeleted.unidad!=this.unidadSelected){
      if(this.materialSeleted.unidad=='Kg' && this.unidadSelected=='Gr'){
          factor=this.cantSelected/1000;
      }
      if(this.materialSeleted.unidad=='Gr' && this.unidadSelected=='Kg'){
          factor=this.cantSelected*1000;
      }
      if(this.materialSeleted.unidad=='Lt' && this.unidadSelected=='Ml'){
        factor=this.cantSelected/1000;
      }
      if(this.materialSeleted.unidad=='Ml' && this.unidadSelected=='Lt'){
          factor=this.cantSelected*1000;
      }
      
    }
    let tipoMoneda: string='';
    for await (let m of this.arrayMonedas){
      if (m.idMoneda==this.ultimoPrecio.fkMoneda)
        tipoMoneda=m.tipoMoneda;
    }

    let tasa=0;
    if (this.productosMateriales.producto.tasaDiaProd!=undefined && this.productosMateriales.producto.tasaDiaProd!=0 )
      tasa=this.productosMateriales.producto.tasaDiaProd;
    else
      tasa=1;

      
      if (this.typeMonedaSeleted.idMoneda==this.ultimoPrecio.fkMoneda){
        this.precioCalculado=Number((factor*this.ultimoPrecio.Precio).toFixed(2));
      }else{
          if (tipoMoneda=='Local')        
            this.precioCalculado=Number((factor*this.ultimoPrecio.Precio/tasa).toFixed(2));//pasando de local a divisa
          else
            this.precioCalculado=Number((factor*this.ultimoPrecio.Precio*tasa).toFixed(2));//pasando de divisa a local
      }
       
  }

  async buscarUltimoPrecio(e){
    
    this.materialSeleted=this.arrayInventario.find((m: IMaterialesEnInventario)=>{ return m.MateriaPrima.idMateriaPrima==e});
    //this.modenaSelected=this.arrayMonedas.find((m: IMoneda)=>{ return m.idMoneda=this.materialSeleted.fkMonedaPrecio1}).abrevMoneda;
    this.unidadSelected=this.materialSeleted.unidad;
    //console.log(this.materialSeleted)
    await this.srvPrecios.consultarUltimosPreciosMaterial(this.materialSeleted.MateriaPrima.idMateriaPrima)
    .then(async (res) => {          
      this.ultimoPrecio= res;
      this.precioCalculado=this.ultimoPrecio.Precio;
      this.calcularPrecio(this.unidadSelected)
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

  verDetalles(content, item: IdetProductosConMateriales) {
    this.modalService.open(content,  this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.nuevo=false;
    this.productosMateriales={};    
    
    this.productosMateriales= item;
    this.productosMateriales.producto.fechaProduccion=formatDate(item.producto.fechaProduccion, 'yyyy-MM-dd','en');
    this.llenarArrayInventarioMateriales();
    this.cboMaterialDisabled= this.productosMateriales.producto.fkMoneda !=undefined ? false : true;
  }

  private TraerIva(){
    
		this.srvParametros.parametrosUltimaFecha()
			.toPromise()
			.then(results => {
        //console.log(results);	
				if (typeof results[0].iva == 'number')	
				  this.productosMateriales.producto.iva = results[0].iva;  
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

  public async guardarProducto(){
    /*if (this.productosMateriales.materiaPrima.length<1){
      this.showNotification('top', 'center', 'Especificar los Detalles del Producto',4);
      return;
    }*/
    if (this.productosMateriales.producto.descripcionProducto==undefined || this.productosMateriales.producto.descripcionProducto==""){
      this.showNotification('top', 'center', 'Debe Especificar el nombre del Producto',4);
      return;
    }

    if (this.productosMateriales.producto.marcaProducto==undefined || this.productosMateriales.producto.marcaProducto==""){
      this.showNotification('top', 'center', 'Debe Especificar la Marca una Descripcion',4);
      return;
    }

    if (this.productosMateriales.producto.precio==undefined || this.productosMateriales.producto.precio.toString()==""){
      this.showNotification('top', 'center', 'Debe Especificar el Precio del Producto',4);
      return;
    }

    if (this.productosMateriales.producto.montoIva==undefined || this.productosMateriales.producto.montoIva.toString()==""){
      this.productosMateriales.producto.montoIva=0;      
    }

    if (this.productosMateriales.producto.iva==undefined || this.productosMateriales.producto.iva.toString()==""){
      this.productosMateriales.producto.iva=0;      
    }

    if (this.productosMateriales.producto.tasaDiaProd==undefined || this.productosMateriales.producto.tasaDiaProd.toString()==""){
      this.showNotification('top', 'center', 'Debe Especificar la Tasa del Dia',4);
      return;     
    }

    if (this.productosMateriales.producto.fkMoneda==undefined || this.productosMateriales.producto.fkMoneda.toString()==""){
      this.showNotification('top', 'center', 'Debe Especificar la Tasa del Dia',4);
      return;     
    }

    if(this.nuevo){
      
      await this.srvProductos.registrarCabecera(this.productosMateriales.producto)
      .toPromise()
      .then(async result => {
        if (typeof this.srvProductos.nuevo.idProducto == "number"){
          this.productosMateriales.producto.idProducto=this.srvProductos.nuevo.idProducto;
          this.showNotification('top', 'center', 'Producto Registrado',2);
          if (this.productosMateriales.materiaPrima.length>0){ 
            await this.guardarDetalles(this.productosMateriales.producto.idProducto);
            this.showNotification('top', 'center', 'Materiales Registrados',2);
          }
          //await this.sumarInventario();
          
        }      
        
        this.llenarArrayProductosMateriales(null, 'null', null, null);
      });
      
      
    }else{

      this.srvProductos.actualizarCabecera(this.productosMateriales.producto)
      .toPromise()
      .then(async result => {
        if (result){
          await this.srvProductos.eliminarDetalleTodo(this.productosMateriales.producto.idProducto).toPromise();
          //await this.restarInventario();
          if (this.productosMateriales.materiaPrima.length>0){ 
            await this.guardarDetalles(this.productosMateriales.producto.idProducto);
            this.showNotification('top', 'center', 'Producto/Materiales Actualizados',2);
          }
          
        }      
        this.llenarArrayProductosMateriales(null, 'null', null, null);
      });
    }
    this.modalService.dismissAll("close");
    
    this.productosMateriales.producto={};
    this.productosMateriales.moneda={};
    this.productosMateriales.producto={};
    this.productosMateriales.materiaPrima=[];
    //this.productosMateriales.usuarioSucursal={};
    this.producto={};
    
    this.producto.precio= 0;
    this.producto.montoIva = 0;
  }

  async guardarDetalles(idProducto: number){  
    let detalles: IDetProductos={}
    for await (let det of this.productosMateriales.materiaPrima){ 
      detalles={        
        fkProducto: idProducto,
        fkMateria: det.Materia.idMateriaPrima,
        cantidad: det.cantidad,
        unidad: det.unidad,
        precio: det.precio,
        moneda: det.moneda
      }  
      await this.srvProductos.registrarDetalle(detalles).toPromise();      
    }
  }  

  addMaterial(){
    if (this.modenaSelected=="" || this.modenaSelected==undefined){
      this.showNotification('top', 'center', 'Debe Especificar el Tipo de Moneda',4);
      return;
    }
      
    let detalle:IdetProducto={
      Materia:this.materialSeleted.MateriaPrima,
      cantidad:this.cantSelected,
      unidad:this.unidadSelected,
      precio: this.precioCalculado,    
      moneda:this.modenaSelected    
    };    
    this.productosMateriales.materiaPrima.push(detalle);
    this.subTotal+=this.precioCalculado;
    if (this.productosMateriales.producto.fkMoneda!=undefined)
      this.productosMateriales.moneda.abrevMoneda =this.arrayMonedas.find((m: IMoneda)=>{ return m.idMoneda==this.productosMateriales.producto.fkMoneda}).abrevMoneda;
    this.materialSeleted={};
    this.materialSeleted.MateriaPrima={}
    this.productosMateriales.producto.precio=this.subTotal
    
    this.cantSelected=1;
    this.unidadSelected="";
    this.precioCalculado=0;
   // console.log(this.cboMaterial.nativeElement.selectedIndex);
    //this.cboMaterial.nativeElement.selectedIndex=1
    
  } 

  public quitDetalle(item: number){
    this.subTotal-=this.productosMateriales.materiaPrima[item].precio;
    this.productosMateriales.materiaPrima.splice(item, 1);    
    
  }

  calculoMontoIva(){
    
    let montoIvaTotal=0;
    let idMonedaLocal= this.arrayMonedas.find((m: IMoneda)=>{ return m.tipoMoneda=='Local'}).idMoneda;
    
    if (this.productosMateriales.producto.fkMoneda==idMonedaLocal && this.productosMateriales.producto.precio!=undefined){
      montoIvaTotal = (this.productosMateriales.producto.precio * this.productosMateriales.producto.iva/100);
      
    }
    this.productosMateriales.producto.montoIva= montoIvaTotal;
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
