import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'nvl',
  standalone: true
})
export class NvlPipe implements PipeTransform {

  transform(value: (string | undefined)[], ...args: unknown[]): unknown {
    if (value) {
      for (const element of value) {
        if (element) {
          return element;
        }
      }
    }
    return undefined;
  }

}
