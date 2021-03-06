import {Node} from './node';
import {NodeType} from './node-type';

export class NodeService {
  public jsonToObject(jsonData: Node): any {
    const keys = Object.keys(this);

    for (const key of keys) {
      // tslint:disable-next-line:curly
      if ((key === 'children') || (key === 'parent')) {
        continue;
      }
      if (jsonData.hasOwnProperty(key)) {
        switch (key) {
          case 'nodeTypeRef':
            this[key] =  {...jsonData[key]};
            break;

          case 'serviceProviderRefs':
          case 'providerRefs':
          case 'consumerRefs':
            this[key] =  [...jsonData[key]];
            break;

          default:
            this[key] = jsonData[key];
            break;
        }
      }
    }

    return this;
  }
}
