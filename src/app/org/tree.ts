import {Node} from './node';
import {NodeType} from './node-type';
import {ServiceProvider} from './service-provider';
import {NodeService} from './node-service';
import {NodeX} from './nodex';

import * as root from '../../assets/nodes/node-root-dmles.json';
import * as dod from '../../assets/nodes/node-agency-dod.json';
import * as army from '../../assets/nodes/node-service-dod.json';
import * as rhca from '../../assets/nodes/node-region-rhca.json';
import * as fortStewart from '../../assets/nodes/node-site-fort-stewart.json';
import * as depta from '../../assets/nodes/node-department-depta.json';
import * as pharmaABC from '../../assets/nodes/node-customer-pharmaABC.json';
import * as pharmaXYZ from '../../assets/nodes/node-customer-pharmaZYZ.json';

const customStringify = (v): any => {
  const cache = new Map();
  return JSON.stringify(v, function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.get(value)) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our map
      cache.set(value, true);
    }
    return value;
  });
};

const findIndex = (nodes: Node[], data: string): number => {
  let index = -1;

  for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].data === data) {
          index = i;
      }
  }
  return index;
};



class Queue {
  private store: Node[] = [];
  public enqueue(node: Node): number {
    return this.store.push(node);
  }

  public dequeue(): Node {
    return this.store.shift();
  }
}

export class Tree {
  public root: Node;

  constructor(data: any) {
    this.root = new Node(data);
  }

   // Breadth First Search
  public traverseBF(callback: (node: Node) => void): void {
    const queue = new Queue();

    let currentNode = this.root;
    while (currentNode) {
      for (let i = 0; i < currentNode.children.length; i++) {
        queue.enqueue(currentNode.children[i]);
      }
      callback(currentNode);
      currentNode = queue.dequeue();
    }
  }

  // Depth First Search
  public traverseDF(callback: (node: Node) => void): void {
    (function recurse(currentNode) {
        // step 2
        for (let i = 0; i < currentNode.children.length; i++) {
            // step 3
            recurse(currentNode.children[i]);
        }

        // step 4
        callback(currentNode);
        // step 1
    })(this.root);
  }

  // Typing the params makes it very verbose, could be written
  // as:  public contains(callback, traversal): void { ... }
  public contains(callback: (node: Node) => void, traversal: (callback: (node: Node) => void) => void): void {
    traversal.call(this, callback);
  }

  public add(data: any, toData: string, traversal): void {
    const child: Node = new Node(data);
    let parent: Node = null;

    this.contains((node) => {
      if (node.data === toData) {
        parent = node;
      }
    }, traversal);

    if (parent) {
      parent.children.push(child);
      child.parent = parent;
    } else {
      throw new Error('Cannot add node to a non-existent parent.');
    }
  }

  public remove(data: any, fromData: string, traversal): Node {
    let parent: Node = null;
    let childToRemove: Node = null;
    let index = -1;

    this.contains((node) => {
      if (node.data === fromData) {
        parent = node;
      }
    }, traversal);

    if (parent) {
      index = findIndex(parent.children, data);

      if (index === -1) {
        throw new Error('Node to remove does not exist.');
      } else {
        childToRemove = parent.children.splice(index, 1)[0];
      }
    } else {
        throw new Error('Parent does not exist.');
    }

    return childToRemove;
  }
}

// console.log(`json file => ${(<any>root).name}`);

const nodex: NodeX = new NodeX();
const nodeService: NodeService = new NodeService();

// nodeService.jsonMapToObject.call(nodex, root);
// console.log(`root => ${customStringify(root)}`);

nodeService.jsonMapToObject.call(nodex, rhca);
console.log(`root => ${customStringify(rhca)}`);

console.log(`\nnode => ${customStringify(nodex)}`);

const tree: Tree = new Tree('DML-ES');
const traverseStrategy = tree.traverseDF;

tree.add('DOD', 'DML-ES', traverseStrategy);
tree.add('Army', 'DOD', traverseStrategy);
tree.add('Air Force', 'DOD', traverseStrategy);
tree.add('Navy', 'DOD', traverseStrategy);
tree.add('RHC-A', 'Army', traverseStrategy);
tree.add('Fort Stewart', 'RHC-A', traverseStrategy);
tree.add('Department A', 'Fort Stewart', traverseStrategy);
tree.add('Pharma XYZ', 'Department A', traverseStrategy);
tree.add('Pharma ABC', 'Department A', traverseStrategy);


// tree.traverseBF((node) => {
//   console.log(`traverseBF => ${customStringify(node.data)}`);
// });

// tree.traverseDF((node) => {
//   console.log(`traverseDF => ${customStringify(node.data)}`);
// });


// tree.contains((node) => {
//   if (node.data === 'Army') {
//     console.log(`contains => ${customStringify(node)}`);
//   }
// }, traverseStrategy);

// const childToRemove: Node = tree.remove('Pharma ABC', 'Department A', tree.traverseBF);
// const childToRemove: Node = tree.remove('Department A', 'Fort Stewart', traverseStrategy);
// console.log(`childToRemove => ${customStringify(childToRemove)}`);

// tree.traverseBF((node) => {
//   console.log(`traverse => ${customStringify(node.data)}`);
// });
