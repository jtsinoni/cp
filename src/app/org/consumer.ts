import {Node} from './node';
import {Provider} from './provider';

export class Consumer {
  public id: string = null;
  public name: string = null;
  public node: Node = null;
  public providers: Provider = null;
}
