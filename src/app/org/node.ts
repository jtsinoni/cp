export class Node {
  public data: any;
  public parent: Node = null;
  public children: Node[] = [];

  constructor(data: any) {
    this.data = data;
  }
}
