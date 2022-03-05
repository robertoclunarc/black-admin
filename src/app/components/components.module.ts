import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
//import { ProductosComponent } from './productos/productos.component';

//import { CompraMaterialesComponent } from './compramateriales/compramateriales.component'

@NgModule({
  imports: [CommonModule, RouterModule, NgbModule],
  declarations: [FooterComponent, NavbarComponent, SidebarComponent,/* ProductosComponent, CompraMaterialesComponent*/],
  exports: [FooterComponent, NavbarComponent, SidebarComponent/*, CompraMaterialesComponent*/]
})
export class ComponentsModule {}
