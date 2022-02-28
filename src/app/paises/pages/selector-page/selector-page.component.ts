import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region     : ['', [Validators.required]],
    pais       : ['', [Validators.required]],
    frontera   : ['', [Validators.required]]
  })

  // Llenar selectores
  regiones    : string[] = [];
  paises      : PaisSmall[] = [];
  // fronteras   : string[] = [];
  fronteras   : PaisSmall[] = [];

  // UI
  cargando: boolean = false;

  guardar(){
    console.log(this.miFormulario.value);
  }

  constructor(private fb: FormBuilder,
              private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    // this.miFormulario.get('region')?.valueChanges
    //   .subscribe(region => {
    //     console.log(region)
    //     this.paisesService.getPaisesPorRegion(region)
    //       .subscribe(paises => {
    //         console.log(paises);
    //         this.paises = paises;
    //       })
    //   })

    this.miFormulario.get('region')?.valueChanges
      .pipe(                // pipe para realizar acciones con el observable?
        tap((_) => {        // tap para accion o efecto secundario mientras se gestion el observable
          this.miFormulario.get('pais')?.reset('')
          this.cargando = true;
        }),
        switchMap(region => this.paisesService.getPaisesPorRegion(region))  // switchMap para transformar un observable y devolver otro obserrvable.
      )  
      .subscribe( paises => {
          this.paises = paises;
          this.cargando = false;
        })

    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap((_) => {
          this.miFormulario.get('frontera')?.reset('')
          this.cargando = true;
        }),
        switchMap(codigo => this.paisesService.getPaisPorCodigo(codigo)),
        switchMap(pais => this.paisesService.getPaisesPorCodigos(pais[0]?.borders!))
      )
      .subscribe( paises => {
        if(paises.length > 0) {
          // this.fronteras = pais[0].borders||[];
          this.fronteras = paises;
          console.log(paises);
          this.cargando = false;
        }
      })
    }
}
