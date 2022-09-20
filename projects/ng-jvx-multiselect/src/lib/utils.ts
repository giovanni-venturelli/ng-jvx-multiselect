import {HttpContext, HttpContextToken} from '@angular/common/http';

export const JVXMULTISELECT = new HttpContextToken<boolean>(() => false);
export const setJvxCall = (): any => new HttpContext().set(JVXMULTISELECT, true);
