// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  monedasUrl:  'http://localhost:3000/hostienda/monedas/',
  proveedoresUrl: 'http://localhost:3000/hostienda/proveedores/',
  usuariosUrl: 'http://localhost:3000/hostienda/usuarios/',
  empresasUrl: 'http://localhost:3000/hostienda/empresas/',
  sucursalesUrl: 'http://localhost:3000/hostienda/sucursales/',
  compraMaterialesUrl: 'http://localhost:3000/hostienda/compras/',
  parametrosUrl: 'http://localhost:3000/hostienda/parametros/',
  tasasCambiosUrl: 'http://localhost:3000/hostienda/tasas/',
  materiaPrimaUrl: 'http://localhost:3000/hostienda/materiasprima/',
  preciosUrl: 'http://localhost:3000/hostienda/precios/',
  unidadesUrl: 'http://localhost:3000/hostienda/unidades/',
  inventarioUrl: 'http://localhost:3000/hostienda/inventarios/',
  productosUrl: 'http://localhost:3000/hostienda/productos/',
  GastosProductosUrl: 'http://localhost:3000/hostienda/gastos/productos/',
  CostosProductosUrl: 'http://localhost:3000/hostienda/costos/productos/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
