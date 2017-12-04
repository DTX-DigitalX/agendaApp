import { NgModule } from '@angular/core';
import { EnvVariables } from './environment-variables.token';
import { devVariables } from './development';
import { prodVariables } from './production';
// import { qaVariables } from './qa';

declare const process: any; // Typescript compiler will complain without this

export function environmentFactory() {
  console.log('environmentFactory',process.env.IONIC_ENV)
  var variables = process.env.IONIC_ENV === 'prod' ? prodVariables : devVariables;
  console.log('prodVariables', prodVariables);
  console.log('devVariables', devVariables);
  console.log('chosenVariables', variables);
  return variables;
}

@NgModule({
  providers: [
    {
      provide: EnvVariables,
      // useFactory instead of useValue so we can easily add more logic as needed.
      useFactory: environmentFactory
    }
  ]
})
export class EnvironmentsModule {}
