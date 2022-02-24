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
    region: ['', [Validators.required]],
    pais: ['', [Validators.required]]
  })

  // Llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];

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
      }),
      switchMap(region => this.paisesService.getPaisesPorRegion(region))  // switchMap para transformar un observable y devolver otro obserrvable.
    )  
    .subscribe( paises => {
        this.paises = paises;
      })
  }

}
