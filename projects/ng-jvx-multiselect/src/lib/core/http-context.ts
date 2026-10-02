import {HttpContext, HttpContextToken} from '@angular/common/http';

/**
 * Set to `true` on every HTTP request issued by ng-jvx-multiselect, so that interceptors can recognise them:
 *
 * ```ts
 * if (req.context.get(JVXMULTISELECT)) { ... }
 * ```
 */
export const JVXMULTISELECT = new HttpContextToken<boolean>(() => false);

/** Creates the {@link HttpContext} attached to the library requests. */
export const setJvxCall = (): HttpContext => new HttpContext().set(JVXMULTISELECT, true);
