import { HttpContext } from '@angular/common/http';
import { JVXMULTISELECT, setJvxCall } from './http-context';

describe('http-context', () => {
  it('JVXMULTISELECT defaults to false on a plain HttpContext', () => {
    expect(new HttpContext().get(JVXMULTISELECT)).toBeFalse();
  });

  it('setJvxCall returns an HttpContext with JVXMULTISELECT set to true', () => {
    const context = setJvxCall();

    expect(context).toBeInstanceOf(HttpContext);
    expect(context.get(JVXMULTISELECT)).toBeTrue();
  });
});
