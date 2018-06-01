import {Node} from './node';
import {NodeType} from './node-type';
import {ServiceProvider} from './service-provider';
import {NodeService} from './node-service';
import {Queue} from './queue';

import * as rootJSON from '../../assets/nodes/node-root-dmles.json';
import * as dodJSON from '../../assets/nodes/node-agency-dod.json';
import * as armyJSON from '../../assets/nodes/node-service-army.json';
import * as rhcaJSON from '../../assets/nodes/node-region-rhca.json';
import * as fortStewartJSON from '../../assets/nodes/node-site-fort-stewart.json';
import * as deptaJSON from '../../assets/nodes/node-department-depta.json';
import * as pharmaABC_JSON from '../../assets/nodes/node-customer-pharmaABC.json';
import * as pharmaXYZ_JSON from '../../assets/nodes/node-customer-pharmaXYZ.json';

const customStringify = (v): any => {
  const cache = new Map();
  return JSON.stringify(v, function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.get(value)) {
        // Circular reference found, discard key
        return;
      }
      // Store value in map
      cache.set(value, true);
    }
    return value;
  });
};

export class Tree {
  public root: Node;

  constructor(node: Node) {
    this.root = node;
  }

  private findIndex(nodes: Node[], child: Node): number {
    let index = -1;
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].name === child.name) {
            index = i;
        }
    }
    return index;
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

  public add(child: Node, to: Node, traversal): void {
    let parent: Node = null;

    this.contains((node) => {
      if (node.name === to.name) {
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

  public remove(child: Node, from: Node, traversal): Node {
    let parent: Node = null;
    let childToRemove: Node = null;
    let index = -1;

    this.contains((node) => {
      if (node.name === from.name) {
        parent = node;
      }
    }, traversal);

    if (parent) {
      index = this.findIndex(parent.children, child);

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

const nodeService: NodeService = new NodeService();
const root: Node = nodeService.jsonToObject.call(new Node(), rootJSON);
const dod: Node = nodeService.jsonToObject.call(new Node(), dodJSON);
const army: Node = nodeService.jsonToObject.call(new Node(), armyJSON);
const rhca: Node = nodeService.jsonToObject.call(new Node(), rhcaJSON);
const fortStewart: Node = nodeService.jsonToObject.call(new Node(), fortStewartJSON);
const depta: Node = nodeService.jsonToObject.call(new Node(), deptaJSON);
const pharmaABC: Node = nodeService.jsonToObject.call(new Node(), pharmaABC_JSON);
const pharmaXYZ: Node = nodeService.jsonToObject.call(new Node(), pharmaXYZ_JSON);

const tree: Tree = new Tree(root);
const traverseStrategy = tree.traverseDF;

tree.add(dod, root, traverseStrategy);
tree.add(army, dod, traverseStrategy);
tree.add(rhca, army, traverseStrategy);
tree.add(fortStewart, rhca, traverseStrategy);
tree.add(depta, fortStewart, traverseStrategy);
tree.add(pharmaABC, depta, traverseStrategy);
tree.add(pharmaXYZ, depta, traverseStrategy);

// tree.traverseBF((node) => {
//   console.log(`traverseBF => ${customStringify(node.name)}`);
// });

// tree.traverseDF((node) => {
//   console.log(`traverseDF => ${customStringify(node.name)}`);
// });


tree.contains((node) => {
  if (node.name === 'Army') {
    console.log(`contains => ${customStringify(node)}`);
  }
}, traverseStrategy);

// tree.remove(pharmaABC, depta, traverseStrategy);
// tree.remove(depta, fortStewart, traverseStrategy);

// tree.traverseDF((node) => {
//   console.log(`traverse => ${customStringify(node.name)}`);
// });
