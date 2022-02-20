//componets
import { Component, OnInit, Input } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

//models
import { IMaterialesComprados,IdetallesCompras,IdetallesComprasConMateriales, IfitroCompras, IDetallesCompra} from '../../models/materiales_compras'
import { IProveedores } from '../../models/proveedores';
import { IMoneda } from '../../models/monedas';
import { ImateriPrima } from '../../models/materiaprima';

//services
import { MaterialesCompradosService } from '../../services/comprasmateriales.service';
import { ProveedoresService } from '../../services/proveedores.service';
import { ParametrosService } from '../../services/parametros.service';
import { TasasCambiosService } from '../../services/tasacambios.service';
import { MonendasService } from '../../services/monedas.service';
import { MateriaPrimaService } from '../../services/materiaprima.service';

@Component({
  selector: "app-compramateriales",
  templateUrl: "compramateriales.component.html",
  providers: [ MaterialesCompradosService, ProveedoresService, 
              ParametrosService, TasasCambiosService, MonendasService, 
              MateriaPrimaService],
  //styleUrls: ["compramateriales.component.css"],
  styles:[`
    .dark-modal .modal-content {
      backgroud-color: #292bc;

    }
    `]
})
export class CompraMaterialesComponent implements OnInit {

  public arrayDetallesComprasConMateriales: IdetallesComprasConMateriales[]=[];
  public arrayProveedores: IProveedores[]=[];
  public clicked: boolean = true;
  public titulos= ['ID','Fecha','Proveedor','Tasa','Neto','Estatus','Login'];  
  private filtroCompras: IfitroCompras={};
  public totalItems: number;
  public iva:number;
  public arrayMonedas: IMoneda[];
  public compra: IMaterialesComprados={}
  public detallesCompra: IdetallesCompras[]=[];
  public arrayMateriasPrima: ImateriPrima[]=[];
  closeResult = '';
  
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
    ) {}  

  ngOnInit(): void {
    this.llenarArrayDetComprasMateriales();
    this.llenarArrayProveedores();
    this.TraerIva();
    this.llenarArrayMonedas();    
    this.llenarArrayMateraPrima();
    
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

  private llenarArrayMateraPrima(){
    
		this.srvMateriaPrima.consultarTodos()
			.toPromise()
			.then(results => {				
					
				this.arrayMateriasPrima = results;
				
			})
			.catch(err => { console.log(err) });
  }

  private async llenarArrayMonedas(){
    
		this.arrayMonedas = await this.srvMonedas.consultarTodos().toPromise();/*
			.toPromise()
			.then(results => {				
					
			this.arrayMonedas = results;
				
			})
			.catch(err => { console.log(err) });*/
  }

  private TraerIva(){
    
		this.srvParametros.parametrosUltimaFecha()
			.toPromise()
			.then(results => {
        		
				if (typeof results[0].iva == 'number')	
				  this.iva = results[0].iva;  
        else
          this.iva=0.0;
				
			})
			.catch(err => { console.log(err) });
  }

  public TraerultimaTasa(idMoneda: number){
    
		this.srvTasasCambios.consultarPorIdMoneda(idMoneda)
			.toPromise()
			.then(results => {
        			
				if (results.length>0)	
				  this.compra.tasaDia = results[0].tasaDia
        /*else
          this.compra.tasaDia=0.0;*/
				
			})
			.catch(err => { console.log(err) });
  }

  verModalDetalles(item: IdetallesComprasConMateriales){
    const from='top';
    const align='center';
    
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

}


