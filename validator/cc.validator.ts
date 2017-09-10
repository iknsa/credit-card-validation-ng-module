/**
 * Created by iKNSA.
 * Author: Khalid Sookia <khalidsookia@gmail.com>
 * Date: 10/09/17
 */
import {AbstractControl} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

export function validateCreditCardNumber():any {
    return (control: AbstractControl): { [key: string]: any } => {
        const regex = new RegExp("^[0-9]{14,16}$");

        return Observable
            .of(regex.test(control.value) && luhnCheck(control.value))
            .map(result => !!result ? null : { creditCard: true });
    };
}

function luhnCheck(val:string):any {
    let sum = 0;

    for (let i = 0; i < val.length; i++) {
        let intVal = parseInt(val.substr(i, 1));

        if (i % 2 == 0) {
            intVal *= 2;

            if (intVal > 9) {
                intVal = 1 + (intVal % 10);
            }
        }

        sum += intVal;
    }

    return (sum % 10) == 0;
}
