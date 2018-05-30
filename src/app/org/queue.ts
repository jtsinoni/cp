import {Node} from './node';

export class Queue {
  private store: Node[] = [];
  public enqueue(node: Node): number {
    return this.store.push(node);
  }

  public dequeue(): Node {
    return this.store.shift();
  }
}
