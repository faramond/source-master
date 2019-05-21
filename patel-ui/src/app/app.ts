import {Observable, OperatorFunction, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {FormGroup} from '@angular/forms';
import {environment} from '../environments/environment';

export function scrub(formGroup: FormGroup): any {
  const value = formGroup.value;
  Object.keys(value).forEach(key => {
    if (value.hasOwnProperty(key) && typeof value[key] === 'string' && value[key].trim() === '') {
      delete value[key];
    }
  });
  return value;
}

export function transform<T>(context: { clazz: any, method: string }, ...errors: { status: number, message: string, contains?: string }[]): OperatorFunction<T, T> {
  return (source$: Observable<T>): Observable<T> => source$.pipe(
    tap(next => log(context.clazz).out(context.method, next)),
    catchError((httpError: HttpErrorResponse) => {
      for (const error of errors) {
        if (httpError.status === error.status) {
          if (error.contains == null) {
            return throwError(error.message);
          }
          if (httpError.error.messages instanceof Array && httpError.error.messages.includes(error.contains)) {
            return throwError(error.message);
          }
        }
      }
      return throwError('failed');
    })
  );
}

export function log(clazz: any) {
  return {
    construct: () => {
      if (!environment.debug) {
        return;
      }
      console.group('construct');
      console.count(clazz.constructor.name);
      console.groupEnd();
    },
    info: (...objects: any[]) => {
      if (!environment.debug) {
        return;
      }
      console.group(`info ${clazz.constructor.name}`);
      objects.forEach(f => console.log(f));
      console.groupEnd();
    },
    warn: (...objects: any[]) => {
      console.group(`warn ${clazz.constructor.name}`);
      objects.forEach(f => console.warn(f));
      console.groupEnd();
    },
    error: (...objects: any[]) => {
      console.group(`error ${clazz.constructor.name}`);
      objects.forEach(f => console.error(f));
      console.groupEnd();
    },
    in: (method: string, ...objects: any[]): { clazz: any, method: string } => {
      if (environment.debug) {
        console.group(`in ${clazz.constructor.name} ${method}`);
        objects.forEach(f => console.log(f));
        console.groupEnd();
      }
      return {clazz: clazz, method: method};
    },
    out: (context: string, ...objects: any[]) => {
      if (!environment.debug) {
        return;
      }
      console.group(`out ${clazz.constructor.name} ${context}`);
      objects.forEach(f => console.log(f));
      console.groupEnd();
    }
  };
}
