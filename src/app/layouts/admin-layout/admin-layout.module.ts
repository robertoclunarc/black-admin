import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { MapComponent } from "../../pages/map/map.component";
import { NotificationsComponent } from "../../pages/notifications/notifications.component";
import { UserComponent } from "../../pages/user/user.component";
import { TablesComponent } from "../../pages/tables/tables.component";
import { TypographyComponent } from "../../pages/typography/typography.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
// import { RtlComponent } from "../../pages/rtl/rtl.component";

import { CompraMaterialesComponent } from "../../components/compramateriales/compramateriales.component";
import { ProductosComponent } from "../../components/productos/productos.component";
import { GastosProductosComponent } from "../../components/gastos_productos/gastos_productos.component";
import { TasaCambioComponent } from "../../components/tasacambio/tasacambio.component";
import { ProveedoresComponent } from "../../components/proveedores/proveedores.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
  ],
  declarations: [
    DashboardComponent,
    UserComponent,
    TablesComponent,
    IconsComponent,
    TypographyComponent,
    NotificationsComponent,
    MapComponent,
    // RtlComponent

    CompraMaterialesComponent,
    ProductosComponent,
    GastosProductosComponent,
    TasaCambioComponent,
    ProveedoresComponent,
  ]
})
export class AdminLayoutModule {}
