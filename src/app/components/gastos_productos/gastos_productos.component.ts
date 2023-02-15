//componets
import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons, NgbModalModule, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from "@angular/common";

//models
import { IGastosProductos  } from '../../models/gastos_productos';
import { ICosto, ICostoGastos, IProductosCostos } from '../../models/costos_productos.model';
//import { IdetProductosConMateriales } from '../../models/productos';
import { IMoneda } from "../../models/monedas";

//services
import { GastosProductosService } from '../../services/gastos_productos.service';
import { MonendasService } from "../../services/monedas.service";
import { CostosProductosService } from "../../services/costos_productos.service";
import { TasasCambiosService } from '../../services/tasacambios.service';

@Component({
  selector: 'app-gastos_productos',
  templateUrl: './gastos_productos.component.html',
  styleUrls: ['./gastos_productos.component.css'],
  providers: [ CostosProductosService, ],
})
export class GastosProductosComponent implements OnInit {

  arrayGastosProducto: IGastosProductos[]=[];
  ObjCosto: ICostoGastos={};
  costo: ICosto={};
  tasa: number=0;
  montoOtraMoneda:number=0;
  montoRacionOtraMoneda:number=0;
  netoRacion:number;
  public arrayProductosCostos: IProductosCostos[]=[];
  public productosCostos: IProductosCostos={};
  gastoProducto: IGastosProductos={};
  totalGastos: number=0;
  totalRaciones: number=0;
  arrayMonedas: IMoneda[]=[];
  arrayMonedasAux: IMoneda[]=[];
  public titulos= ['', 'ID','Producto','Marca/Descripcion','Precio','Costo','Sucursal', 'Fecha Prod.'];
  TooltipUltimaTasa: string="Traer Tasa Actual";
  public itemsProductos: number=0;
  modenaSelected: IMoneda={};
  otraModenaSelected: IMoneda={};
  idMonedaSelected: number;
  public clicked: boolean = true;    
  public nuevo:boolean;  
  public itemsDetalles: number=0; 
  public userLogeado: string="";
  public nombreUser: string="";
  closeResult = '';
  modalOptions: NgbModalOptions;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private srvGastosProductos: GastosProductosService,
    private srvCostosProductos: CostosProductosService,
    private srvTasasCambios: TasasCambiosService,
    private srvMonedas: MonendasService,
    private modalService: NgbModal,
    ) { 

    this.modalOptions={
      windowClass:'dark-modal', backdropClass:'dark-modal',  modalDialogClass:'dark-modal', size:'lg', ariaLabelledBy: 'modal-basic-title'
    }
  }

  ngOnInit(): void {    
    this.userLogeado="rlunar";
    this.llenarArrayMonedas();
    //this.llenarArrayCostos('null','null');
    this.llenarArrayProductosCostos('null', 'null', 'null', 'null');
  }

  private llenarArrayProductosCostos(id: string, descripcion: string, idCosto: string, idSucursal: string){
    
    this.srvCostosProductos.viewFromAnyFieldProducto(idCosto, id, descripcion,  idSucursal)
        .toPromise()
        .then(results => {	
            this.arrayProductosCostos = results;            
            this.arrayProductosCostos.sort((a, b ) => b.producto.idProducto - a.producto.idProducto);               
            this.itemsProductos= this.arrayProductosCostos.length;
            //console.log(results);
    })
    .catch(err => { console.log(err) });
  }  

  private async  llenarArrayCostos(idCosto: string, idProducto: string){
    
    await this.srvCostosProductos.viewFromAnyField(idCosto, idProducto)
        .toPromise()
        .then(results => {				
                
            this.ObjCosto = results[0];
            
    })
    .catch(err => { console.log(err) });
  }

  private async llenarArrayMonedas(){
    this.arrayMonedas=[];
    //let monedas: IMoneda[]=[];
		this.arrayMonedas = await this.srvMonedas.consultarTodos().toPromise();
		//this.arrayMonedas=monedas.filter((m:IMoneda)=>{ return m.idMoneda!=this.modenaSelected.idMoneda});
    
  }

  async verDetalles(content, item: IProductosCostos) { 
    this.modenaSelected={};
    this.productosCostos={};
    this.ObjCosto={ costo:{}, gastos:[] };
    this.productosCostos=item;
    if (this.productosCostos.costos){
      await this.llenarArrayCostos(this.productosCostos.costos.idCosto.toString(),'null');
      this.tasa=this.productosCostos.costos.tasa;
      this.productosCostos.costos.fecha=formatDate(item.costos.fecha, 'yyyy-MM-dd','en');
    }else{
      this.ObjCosto.costo={
        idCosto:null,
        fecha: formatDate(Date.now(), 'yyyy-MM-dd','en'),
        fkProducto:this.productosCostos.producto.idProducto,
        tasa:this.tasa
      };
      this.productosCostos.costos={};
      this.productosCostos.costos.fecha=formatDate(Date.now(), 'yyyy-MM-dd','en');
    }
    this.idMonedaSelected=this.productosCostos.moneda.idMoneda;
    this.modenaSelected=this.productosCostos.moneda;    
    this.otraModenaSelected=this.productosCostos.moneda;    
    await this.calculaTotalGastos();
    
    this.productosCostos.producto.fechaProduccion=formatDate(item.producto.fechaProduccion, 'yyyy-MM-dd','en');
    
    this.netoRacion=this.ObjCosto.costo.precio_venta;
    //this.arrayMonedasAux = this.arrayMonedas.filter((m) => m.idMoneda !== item.moneda.idMoneda)
    
    this.modalService.open(content,  this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.nuevo=false;    
  }

  async calculaTotalGastos(){
    let totalGastos: number=0;
    for await (let g of this.ObjCosto.gastos){
      totalGastos+=g.precio
    }
    this.totalGastos=totalGastos;
    this.ObjCosto.costo.total=this.totalGastos+this.productosCostos.producto.precio;
    
    if (this.ObjCosto.costo.raciones>0 && this.ObjCosto.costo.raciones.toString()!="" && this.ObjCosto.costo.raciones!=undefined){
      this.totalRaciones=this.ObjCosto.costo.total/this.ObjCosto.costo.raciones
      this.totalRaciones=Number(this.totalRaciones.toFixed(2))
    }else{
      this.ObjCosto.costo.raciones=0
      this.totalRaciones=0;
    }
    await this.calculaNetos();
    this.calculaMontoOtraMoneda();
    
  }

  async calculaNetos(){
    this.netoRacion=this.calculaPorcentajeGanancia(this.totalRaciones);
    this.ObjCosto.costo.neto=this.calculaPorcentajeGanancia(this.ObjCosto.costo.total);
    this.ObjCosto.costo.precio_venta=this.netoRacion;
  }

  async calculaMontoOtraMoneda(){
    
    if (this.tasa>0 && this.tasa.toString()!="" && this.tasa!=undefined){

      if (this.modenaSelected.tipoMoneda!='Local'){
        this.montoOtraMoneda=this.ObjCosto.costo.total / this.tasa;
        this.montoRacionOtraMoneda=this.totalRaciones / this.tasa;
        this.netoRacion=this.netoRacion / this.tasa;        
        this.ObjCosto.costo.neto=this.ObjCosto.costo.neto / this.tasa;        
      }else{
        this.montoOtraMoneda=this.ObjCosto.costo.total * this.tasa; 
        this.montoRacionOtraMoneda=this.totalRaciones * this.tasa;
        this.netoRacion=this.netoRacion * this.tasa;
        this.ObjCosto.costo.neto=this.ObjCosto.costo.neto * this.tasa;        
      }      
      this.montoOtraMoneda=Number(this.montoOtraMoneda.toFixed(2));        
      this.montoRacionOtraMoneda=Number(this.montoRacionOtraMoneda.toFixed(2));        
      this.netoRacion=Number(this.netoRacion.toFixed(2));        
      this.ObjCosto.costo.neto=Number(this.ObjCosto.costo.neto.toFixed(2));
    }else{
      this.montoOtraMoneda=0;
      this.montoRacionOtraMoneda=0;
    }
  }

  calculaPorcentajeGanancia(monto: number):number{
    let calculo: number=0;
    let porc: number=0;
    if (this.ObjCosto.costo.ganancia_porc>0 && this.ObjCosto.costo.ganancia_porc.toString()!="" && this.ObjCosto.costo.ganancia_porc!=undefined){
      porc=this.ObjCosto.costo.ganancia_porc/100;      
    }else{
      this.ObjCosto.costo.ganancia_porc=0;
    }
    calculo=monto + (monto*porc);
    return Number(calculo.toFixed(2));
  }

  async seleccionarMoneda(e: any){      
    //this.otraModenaSelected=this.arrayMonedas.find((m:IMoneda)=> {return m.idMoneda==e});
    for await (let m of this.arrayMonedas){
      if (m.idMoneda==e){
        this.otraModenaSelected=m
      }
    }    
    await this.calculaNetos();
    await this.calculaMontoOtraMoneda();    
  }

  public async TraerultimaTasa(){     
    if (this.TooltipUltimaTasa=="Traer Tasa Actual"){
      this.TooltipUltimaTasa="Traer Tasa Anterior"; 
      if (this.otraModenaSelected.idMoneda!=undefined && this.otraModenaSelected.idMoneda.toString()!="" && this.otraModenaSelected.idMoneda!=this.productosCostos.moneda.idMoneda){
        await this.srvTasasCambios.consultarPorIdMoneda(this.otraModenaSelected.idMoneda)
          .toPromise()
          .then(async results => {            
            if (results.length>0)	{
              this.tasa = results[0].tasaDia;            
            }
            else{
              this.tasa=0.0;
            }
            await this.calculaNetos();
            await this.calculaMontoOtraMoneda();
          })
          .catch(err => { console.log(err) });
      }
    }  
    else{
      this.TooltipUltimaTasa="Traer Tasa Actual";
      this.tasa=this.productosCostos.costos.tasa;
    }      
  }

  private async buscarGastos(gasto: IGastosProductos){    
    return await this.srvGastosProductos.viewFromAnyField(gasto, 'AND').toPromise();
  }

  async guardarGastos(idCosto: number){      
    for await (let g of this.ObjCosto.gastos){ 
      g.fkCosto=idCosto;        
      await this.srvGastosProductos.registrar(g).toPromise();      
    }
  }
  
  async actualizarGastos(idCosto: number){  
    let gasto: IGastosProductos={};
    let gastos: IGastosProductos[];
    for await (let g of this.ObjCosto.gastos){ 
      g.fkCosto=idCosto; 
      gasto={
        idgasto:g.idgasto,
        fkCosto: g.fkCosto,
        descripcion_gasto: 'null'
      };      
      gastos=await this.buscarGastos(gasto);
      if (gastos.length>0 && gasto.idgasto!=undefined){        
        await this.srvGastosProductos.actualizar(g).toPromise();
        this.showNotification('top', 'center', 'Gasto Actualizado',2);
      }
      else{        
        await this.srvGastosProductos.registrar(g).toPromise();
        this.showNotification('top', 'center', 'Gasto Registrado',2);
      }            
    }
  }

  public async actualizarCostos(){
    if (this.otraModenaSelected.idMoneda!=this.modenaSelected.idMoneda){
      this.otraModenaSelected=this.modenaSelected;
      await this.calculaNetos();
      await this.calculaMontoOtraMoneda();
    }
    
    this.ObjCosto.costo.tasa=this.tasa;
       
    await this.srvCostosProductos.actualizar(this.ObjCosto.costo).toPromise();
    this.showNotification('top', 'center', 'Costo Actualizado',2);
    if (this.ObjCosto.gastos.length>0){      
      await this.actualizarGastos(this.ObjCosto.costo.idCosto);
    }
    this.llenarArrayProductosCostos('null', 'null', 'null', 'null');
    this.modalService.dismissAll("close");   
    
  }

  public async registrarNuevo(){     
    
    if (this.otraModenaSelected.idMoneda!=this.modenaSelected.idMoneda){
      this.otraModenaSelected=this.modenaSelected;
      await this.calculaNetos();
      await this.calculaMontoOtraMoneda();
    }
    this.ObjCosto.costo.idCosto=null;
    this.ObjCosto.costo.tasa=this.tasa;
       
    await this.srvCostosProductos.registrar(this.ObjCosto.costo).toPromise();
    this.showNotification('top', 'center', 'Costo Registrado',2);
    this.ObjCosto.costo.idCosto=this.srvCostosProductos.nuevoCosto.idCosto;
    if (this.ObjCosto.gastos.length>0){      
      await this.guardarGastos(this.ObjCosto.costo.idCosto);
      this.showNotification('top', 'center', 'Gastos Registrados',2);
    }
    this.llenarArrayProductosCostos('null', 'null', 'null', 'null');
    this.modalService.dismissAll("close");
    
  }

  addGasto(){
    this.gastoProducto.fecha=this.ObjCosto.costo.fecha;
    this.gastoProducto.fkmoneda=this.productosCostos.moneda.idMoneda;
    
    this.ObjCosto.gastos.push(this.gastoProducto);
    this.totalGastos+=this.gastoProducto.precio;
    this.calculaTotalGastos();
    this.gastoProducto={};
  }

  public quitGasto(item: number){
    this.totalGastos-=this.ObjCosto.gastos[item].precio;
    this.ObjCosto.gastos.splice(item, 1);    
    this.calculaTotalGastos();
  }

  open(content) {
    this.modalService.open(content, {windowClass:'dark-modal', backdropClass:'dark-modal',  modalDialogClass:'dark-modal', size:'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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
