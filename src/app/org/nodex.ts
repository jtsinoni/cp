import {NodeType} from './node-type';
import {ServiceProvider} from './service-provider';
import {Provider} from './provider';
import {Consumer} from './consumer';

export class NodeX {
  public _id = '';
  public guid = '';
  public children: NodeX[] = [];
  public parent: NodeX = null;
  public name = '';
  public orgId = '';
  public milServiceId = '';
  public providerCode = '';
  public isPrimaryHost = false;
  public orgRef = '';
  public parentRef = '';
  public treeLevel = 0.0;
  public nodeChain = '';
  public nodeTypeRef: NodeType = null;
  public providerRefs: Provider[] = [];
  public consumerRefs: Consumer[] = [];
  public serviceProviderRefs: ServiceProvider[] = [];
  public _isDeleted = false;
  public ancestry = '';
  constructor(guid?: string) {
    if (guid) {
      this.guid = guid;
    }
  }
}
