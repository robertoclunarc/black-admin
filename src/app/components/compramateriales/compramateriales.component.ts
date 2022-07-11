//componets
import { Component, OnInit, Input } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons, NgbModalModule, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from "@angular/common";

//models
import { IMaterialesComprados,IdetallesCompras,IdetallesComprasConMateriales, IfitroCompras, IDetallesCompra} from '../../models/materiales_compras'
import { IProveedores } from '../../models/proveedores';
import { IMoneda } from '../../models/monedas';
import { ImateriPrima } from '../../models/materiaprima';
import { Iprecios } from '../../models/precios';
import { IUnidades } from '../../models/unidades';
import { IUsuarioSucursal } from '../../models/usuarios';
import { IinventariosMateriales } from '../../models/inventarios';

//services
import { MaterialesCompradosService } from '../../services/comprasmateriales.service';
import { ProveedoresService } from '../../services/proveedores.service';
import { ParametrosService } from '../../services/parametros.service';
import { TasasCambiosService } from '../../services/tasacambios.service';
import { MonendasService } from '../../services/monedas.service';
import { MateriaPrimaService } from '../../services/materiaprima.service';
import { PreciosService } from '../../services/precios.service';
import { UnidadesService } from '../../services/unidad.service';
import { UsuariosService } from '../../services/usuarios.service';
import { InventarioMateialesService } from '../../services/inventariomateriales.service'

@Component({
  selector: "app-compramateriales",
  templateUrl: "compramateriales.component.html",
  providers: [ MaterialesCompradosService, ProveedoresService, 
              ParametrosService, TasasCambiosService, MonendasService, 
              MateriaPrimaService, UnidadesService, PreciosService,
              UsuariosService, InventarioMateialesService, ],
  //styleUrls: ["compramateriales.component.css"],
  styles:[`
    .dark-modal .modal-content {
      backgroud-color: #292bc;
      position: relative;
      top: 2%;
      transform: translateY(-20%);
    }
    `]
})
export class CompraMaterialesComponent implements OnInit {

  public arrayDetallesComprasConMateriales: IdetallesComprasConMateriales[]=[];
  public registrarCompra: IdetallesComprasConMateriales={};
  public arrayProveedores: IProveedores[]=[];
  public clicked: boolean = true;
  public titulos= ['ID','Fecha','Proveedor','Tasa','Neto','Estatus','Login'];  
  private filtroCompras: IfitroCompras={};
  public totalItems: number;
  public nuevo:boolean;
  public arrayMonedas: IMoneda[];
  public compra: IMaterialesComprados={}
  public detalleCompra: IdetallesCompras={};
  public detallesCompra: IDetallesCompra[]=[];
  public detallesCompraOLD: IDetallesCompra[]=[];
  public arrayMateriasPrima: ImateriPrima[]=[];
  public selectedMateriasPrima: ImateriPrima={};
  public nuevaMateriasPrima: ImateriPrima={};
  public arrayNuevosMateriales: ImateriPrima[]=[];
  public arrayUnidad: IUnidades[]=[];
  public arrayPreciosUltimos: Iprecios[]=[];
  public precio: Iprecios={} ;
  public itemsDetalles: number=0;
  public arrayUsuarios: IUsuarioSucursal[]=[];
  public userLogeado: string="";
  public nombreUser: string="";
  public nuevoMaterial: boolean=false;
  closeResult = '';
  public checkboxValue: any=true;
  modalOptions: NgbModalOptions;
  
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private srvMaterialesComprados: MaterialesCompradosService,
    private srvProveedores: ProveedoresService,
    private srvParametros: ParametrosService,
    private srvTasasCambios: TasasCambiosService,
    private srvMonedas: MonendasService,
    private srvMateriaPrima: MateriaPrimaService,
    private srvUnidades: UnidadesService,
    private srvPrecios: PreciosService,
    private srvUsuarios: UsuariosService,
    private srvInventario: InventarioMateialesService,
  ) {
    this.modalOptions={
      windowClass:'dark-modal', backdropClass:'dark-modal',  modalDialogClass:'dark-modal', size:'lg', ariaLabelledBy: 'modal-basic-title'
    }
  }  

  ngOnInit(): void {
    this.userLogeado="rlunar";
    this.llenarArrayDetComprasMateriales();
    this.llenarArrayProveedores();
    this.TraerIva();
    this.llenarArrayMonedas();    
    this.llenarArrayMateraPrima();
    this.llenarArrayPreciosUltimos('MATERIAL');//otra opcion seria PRODUCTO
    this.llenarArrayUnidades();
    this.llenarArrayUsuarios();
    this.compra.subtotal= 0;
    this.compra.montoIva = 0;
    this.compra.neto = 0;
    this.compra.iva=0;
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
        this.arrayDetallesComprasConMateriales.sort((a, b ) => b.compra.idCompra - a.compra.idCompra);               
				
			})
			.catch(err => { console.log(err) });
  }

  private llenarArrayProveedores(){
    
		this.srvProveedores.consultarTodos()
			.toPromise()
			.then(results => {				
					
				this.arrayProveedores = results;
				
			})
			.catch(err => { console.log(err) });
  }

  private llenarArrayUsuarios(){
    
		this.srvUsuarios.usuariosPorSucursales()
			.toPromise()
			.then(results => {				
					
				this.arrayUsuarios = results;
				
			})
			.catch(err => { console.log(err) });
  }

  private llenarArrayMateraPrima(){
    
		this.srvMateriaPrima.consultarTodos()
			.toPromise()
			.then(results => {				
					
				this.arrayMateriasPrima = results;
				
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

  private async llenarArrayPreciosUltimos(tipo: string){
    
		this.srvPrecios.consultarUltimosPrecios(tipo)
			.toPromise()
			.then(results => {				
					
				this.arrayPreciosUltimos = results;
			
			})
			.catch(err => { console.log(err) });
  }

  private async agregarPrecio(precio: Iprecios){
    
		this.srvPrecios.registrar(precio)
			.toPromise()
			.then(async results => {				
					
				await this.llenarArrayPreciosUltimos(precio.tipo)
			
			})
			.catch(err => { console.log(err) });
  }

  private async llenarArrayMonedas(){
    
		this.arrayMonedas = await this.srvMonedas.consultarTodos().toPromise();
		
  }

  public async buscarPrecio(idMaterial: number){
    this.selectedMateriasPrima=this.arrayMateriasPrima.find(m => m.idMateriaPrima==idMaterial);
    
    this.detalleCompra.precioUnitario=0;
    for await (let precio of this.arrayPreciosUltimos){
      if (precio.fkMaterial==idMaterial){
        if (precio.fkMoneda==this.compra.fkMoneda)
            this.detalleCompra.precioUnitario=precio.Precio
        else
            if (this.compra.tasaDia!=undefined)
              this.detalleCompra.precioUnitario= Number((precio.Precio * this.compra.tasaDia).toFixed(2));
            else
              this.detalleCompra.precioUnitario=precio.Precio * 1;
        break;    
      }
    }
    if (this.detalleCompra.cantidad==undefined)
      this.detalleCompra.cantidad=1;
    
    this.calcularSubtotal();
  }

  private calcularSubtotal(){

    if (this.detalleCompra.cantidad!=undefined && this.detalleCompra.precioUnitario!=undefined && this.detalleCompra.unidad!=undefined && this.detalleCompra.unidad!=""){
      if (this.detalleCompra.unidad=="Gr" || this.detalleCompra.unidad=="Ml" || this.detalleCompra.unidad=="UND")
        this.detalleCompra.subtotal =  this.detalleCompra.precioUnitario;
      else
        this.detalleCompra.subtotal = Number((this.detalleCompra.cantidad * this.detalleCompra.precioUnitario).toFixed(2));
    }
  }

  private TraerIva(){
    
		this.srvParametros.parametrosUltimaFecha()
			.toPromise()
			.then(results => {
        		
				if (typeof results[0].iva == 'number')	
				  this.compra.iva = results[0].iva;  
        else
          this.compra.iva=0.0;
				
			})
			.catch(err => { console.log(err) });
  }

  public TraerultimaTasa(idMoneda: string){
    if (idMoneda!=''){
      
      this.srvTasasCambios.consultarPorIdMoneda(Number(idMoneda))
        .toPromise()
        .then(results => {
                
          if (results.length>0)	
            this.compra.tasaDia = results[0].tasaDia
          /*else
            this.compra.tasaDia=0.0;*/
          
        })
        .catch(err => { console.log(err) });
    }    
  }

  verModalDetalles(item: IdetallesComprasConMateriales){
    const from='top';
    const align='center';
    let html: string;
    html='<table><tr><td>ID:</td><td>'+item.compra.idCompra+'</td>';
    html+='<td>Fecha:</td><td>'+item.compra.fechaCompra+'</td>';
    html+='<td>Usuario:</td><td>'+item.compra.loginCrea+'</td>';
    html+='<td>Sucursal:</td><td>'+item.sucursal.nombreSucursal+'</td>';
    html+='</tr>';
    html+='<td>Proveedor:</td><td>'+item.proveedor.NombresProveedor+'</td>';
    html+='<td>Moneda:</td><td>'+item.moneda.abrevMoneda+'</td>';
    html+='<td>Tasa:</td><td>'+item.compra.tasaDia+'</td>';
    html+='<td>Iva:</td><td>'+item.compra.iva+'</td>';
    html+='</tr></table>';
    
    const color = Math.floor((Math.random() * 5) + 1);
    this.toastr.info('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> '+html, '', {
      disableTimeOut: true,
      closeButton: true,
      enableHtml: true,
      toastClass: "alert alert-info alert-with-icon",
      positionClass: 'toast-' + from + '-' +  align
    });
  }

  private async sumarInventario(){
    let detalle: IdetallesCompras;
    let inv: IinventariosMateriales;
    for await (let det of this.detallesCompra){
      inv={};
      inv={        
        fkMateriaPrima: det.MateriaPrima.idMateriaPrima,
        cantidad: det.cantidad,
        cantidadAcumulada: det.cantidad,
        unidad: det.unidad,
        precio1: det.precioUnitario, 
        fkMonedaPrecio1: this.compra.fkMoneda,        
        fksucursal: this.compra.fkSucursal,              
        loginCrea: this.compra.loginCrea,
        fechaCrea: formatDate(Date.now(), 'yyyy-MM-dd HH:mm:ss','en'),
        estatus: "ACTIVO"
      };

      if (det.MateriaPrima.idMateriaPrima==undefined){        
        
        inv.fkMateriaPrima=this.srvMateriaPrima.nuevo.idMateriaPrima;        
        
      }
      
      await this.srvInventario.sumar(inv).toPromise();
      
    }  
  }

  private async restarInventario(){
    let detalle: IdetallesCompras;
    let inv: IinventariosMateriales;
    for await (let det of this.detallesCompraOLD){
      inv={};
      inv={        
        fkMateriaPrima: det.MateriaPrima.idMateriaPrima,
        cantidad: det.cantidad,
        unidad: det.unidad,
        precio1: det.precioUnitario, 
        fkMonedaPrecio1: this.compra.fkMoneda,        
        fksucursal: this.compra.fkSucursal,              
        loginActualiza: this.compra.loginCrea,
        fechaActualiza: formatDate(Date.now(), 'yyyy-MM-dd HH:mm:ss','en'),
        estatus: "ACTIVO"
      };
      console.log(inv);
      await this.srvInventario.restar(inv).toPromise();
      
    }  
  }

  addMaterial(){
      this.nuevoMaterial= this.nuevoMaterial == true ? false : true;
      this.nuevaMateriasPrima={};
      this.selectedMateriasPrima={};
  }

  private async guardarDetalles(idCompra: number){
    let detalle: IdetallesCompras;
    let precio: Iprecios;
    console.log(this.detallesCompra)
    for await (let det of this.detallesCompra){
      detalle={};
      detalle={
        fkcompra: this.compra.idCompra,
        idDetCompra: undefined,      
        fkMateriaPrima: det.MateriaPrima.idMateriaPrima,
        cantidad: det.cantidad,
        unidad: det.unidad,
        precioUnitario: det.precioUnitario,
        subtotal: det.subtotal
      };

      precio={        
        fkMaterial: det.MateriaPrima.idMateriaPrima,  
        Precio: det.precioUnitario,
        fkMoneda: this.compra.fkMoneda,
        fechaPrecio:  formatDate(Date.now(), 'yyyy-MM-dd HH:mm:ss','en'),
        tipo: "MATERIAL"
      }
      
      if (det.MateriaPrima.idMateriaPrima==undefined){
        await this.nuevoMaterialAdd(det);
        
        detalle.fkMateriaPrima=this.srvMateriaPrima.nuevo.idMateriaPrima;
        precio.fkMaterial==this.srvMateriaPrima.nuevo.idMateriaPrima;
        
      }
      
      await this.srvMaterialesComprados.registrarDetalle(detalle).toPromise();
      await this.agregarPrecio(precio);
      
    }
  }

  private async nuevoMaterialAdd(detaComp: IdetallesCompras){
    
    await this.srvMateriaPrima.registrar(this.nuevaMateriasPrima).toPromise()
      //.then(async result => {        
        
        //await this.nuevoInventario(this.srvMateriaPrima.nuevo.idMateriaPrima, detaComp)
     // })
      
  }

  private async nuevoInventario(idMaterial: number, detaComp: IdetallesCompras){    

    let inv: IinventariosMateriales={        
        fkMateriaPrima: idMaterial,
        cantidad: detaComp.cantidad,
        cantidadAcumulada: this.detalleCompra.cantidad,
        unidad: detaComp.unidad,
        precio1: detaComp.precioUnitario,
        fkMonedaPrecio1: this.compra.fkMoneda,        
        fksucursal: this.compra.fkSucursal,              
        loginCrea: this.compra.loginCrea,
        fechaCrea: formatDate(Date.now(), 'yyyy-MM-dd HH:mm:ss','en'),
        estatus: "ACTIVO"
      };
    console.log(inv);    
    await this.srvInventario.registrar(inv).toPromise();     
      
  }

  public async guardarCompra(){
    if (this.detallesCompra.length<1){
      this.showNotification('top', 'center', 'Especificar los Detalles de Compra',4);
      return;
    }
    if (this.compra.idProveedor==undefined || this.compra.idProveedor.toString()==""){
      this.showNotification('top', 'center', 'Seleccionar Un Proveedor',4);
      return;
    }

    if (this.compra.fkMoneda==undefined || this.compra.fkMoneda.toString()==""){
      this.showNotification('top', 'center', 'Seleccionar Una Moneda',4);
      return;
    }

    if (this.compra.tasaDia==undefined || this.compra.tasaDia.toString()==""){
      this.compra.tasaDia=0;      
    }

    if (this.compra.iva==undefined || this.compra.iva.toString()==""){
      this.compra.iva=0;      
    }

    if(this.nuevo){
      console.log(this.detallesCompra);
      await this.srvMaterialesComprados.registrarCabecera(this.compra)
      .toPromise()
      .then(async result => {
        if (typeof result == "number"){
          this.compra.idCompra=result;      
          await this.guardarDetalles(this.compra.idCompra);
          await this.sumarInventario();
          
        }      
        this.llenarArrayDetComprasMateriales();
      });
    }else{

      this.srvMaterialesComprados.actualizarCabecera(this.compra)
      .toPromise()
      .then(async result => {
        if (result){
          await this.srvMaterialesComprados.eliminarDetalleTodo(this.compra.idCompra).toPromise();
          await this.restarInventario();
          await this.guardarDetalles(this.compra.idCompra);
        }      
        this.llenarArrayDetComprasMateriales();
      });
    }
    this.modalService.dismissAll("close");
    
    this.compra={};
    this.registrarCompra.compra = {}; 
    this.registrarCompra.sucursal = {};
    this.registrarCompra.moneda = {};
    this.registrarCompra.proveedor = {};
    this.registrarCompra.detalles = [];
    this.detallesCompra = [];
    this.detallesCompraOLD = [];
    this.itemsDetalles = 0;
  }

  private registrarNuevo(){
    
    this.registrarCompra.compra={};
    this.compra={};
    this.detallesCompra=[];
    this.detalleCompra={};
    this.compra.subtotal= 0;
    this.compra.montoIva = 0;
    this.compra.neto = 0;
    this.compra.iva=0;

    this.TraerIva();

    this.registrarCompra.sucursal= this.arrayUsuarios.find(us => us.usuario.login==this.userLogeado).sucursal;    
    this.registrarCompra.compra.loginCrea= this.arrayUsuarios.find(us => us.usuario.login==this.userLogeado).usuario.nombres;
    this.nombreUser=this.arrayUsuarios.find(us => us.usuario.login==this.userLogeado).usuario.nombres;
    this.compra.loginCrea=this.userLogeado;
    this.compra.fechaCompra= formatDate(Date.now(), 'yyyy-MM-dd','en');
    this.registrarCompra.compra.fechaCompra=formatDate(Date.now(), 'yyyy-MM-dd','en');
    this.compra.fkSucursal=this.registrarCompra.sucursal.idSucursal;
  }

  open(content, nuevo: boolean) {
    this.modalService.open(content, {windowClass:'dark-modal', backdropClass:'dark-modal',  modalDialogClass:'dark-modal', size:'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    if (nuevo){
      this.nuevo=nuevo;
      this.registrarNuevo();
    }
  }

  verDetalles(content, item: IdetallesComprasConMateriales) {
    this.modalService.open(content,  this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.nuevo=false;
    
    this.compra={};
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
    this.itemsDetalles = this.detallesCompra.length;
    
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

  public async addDetalle(){
    if ((this.selectedMateriasPrima.idMateriaPrima==undefined) || (this.detalleCompra.cantidad==undefined || this.detalleCompra.cantidad <= 0) || (this.detalleCompra.unidad==undefined) || (this.detalleCompra.precioUnitario==undefined || this.detalleCompra.precioUnitario <=0) || (this.detalleCompra.subtotal==undefined) || (this.detalleCompra.subtotal <=0)){
      
      if (this.selectedMateriasPrima.idMateriaPrima==undefined && this.nuevoMaterial==false){
      this. showNotification('top', 'center', 'Debe Selecionar un Material',4);
      return;
      }

      if (this.detalleCompra.cantidad==undefined || this.detalleCompra.cantidad <= 0){
        this. showNotification('top', 'center', 'Debe Especificar Cantidad',4);
        return;
      }

      if (this.detalleCompra.unidad==undefined){
        this. showNotification('top', 'center', 'Debe Seleccionar una Unidad',4);
        return;
      }

      if (this.detalleCompra.precioUnitario==undefined || this.detalleCompra.precioUnitario <=0){
        this. showNotification('top', 'center', 'Debe Especificar Precio',4);
        return;
      }

      if (this.detalleCompra.subtotal==undefined || this.detalleCompra.subtotal <=0){
        this. showNotification('top', 'center', 'Calculo Subtotal Incorrecto',4);
        return;
      }

      if (this.nuevoMaterial){
        if (this.nuevaMateriasPrima.descripcion==undefined || this.nuevaMateriasPrima.descripcion==""){
          this. showNotification('top', 'center', 'Debe Especificar la descripcion del nuevo material',4);
          return;
        }

        if (this.nuevaMateriasPrima.marca==undefined || this.nuevaMateriasPrima.marca==""){
          this. showNotification('top', 'center', 'Debe Especificar la marca del nuevo material',4);
          return;
        }
        
        
        this.selectedMateriasPrima=this.nuevaMateriasPrima
          
        
      }
    }
    
    const dtl: IDetallesCompra={
      fkcompra: undefined,
      idDetCompra: undefined,
      MateriaPrima: this.selectedMateriasPrima,
      cantidad: this.detalleCompra.cantidad,
      unidad: this.detalleCompra.unidad,
      precioUnitario: this.detalleCompra.precioUnitario,
      subtotal: this.detalleCompra.subtotal
    };
    
    this.detallesCompra.push(dtl);
    this.itemsDetalles=this.detallesCompra.length;
    this.calcularNeto();
    this.selectedMateriasPrima={};
    this.detalleCompra={};
    this.nuevaMateriasPrima={};
    
  }

  public quitDetalle(item: number){
    this.detallesCompra.splice(item, 1);
    this.itemsDetalles=this.detallesCompra.length;
    this.calcularNeto();
  }

  public async calcularNeto(){ 

    let subTotal: number=0;
    let montoIva: number=0;
    let neto: number=0;
    
    if (this.compra.iva==undefined || this.compra.iva.toString()==""){
      this.compra.iva=0;        
    }
    
    for await (let detalle of this.detallesCompra){
      console.log(detalle.subtotal);    
      subTotal=subTotal+detalle.subtotal;
      if (detalle.MateriaPrima.retieneIva==true)
        montoIva=montoIva + (detalle.subtotal*this.compra.iva / 100);
    };    
    
    neto = subTotal + montoIva;
    this.compra.subtotal= Number(+subTotal.toFixed(2));
    this.compra.montoIva = Number(+montoIva.toFixed(2));
    this.compra.neto = Number(+neto.toFixed(2));
    
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
         disableTimeOut: true,
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