class DLLNode<T> {
  value: T;
  next: DLLNode<T> | null = null;
  prev: DLLNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export class DoublyLinkedList<T> {
  protected head: DLLNode<T> | null = null;
  protected tail: DLLNode<T> | null = null;
  protected _maxSize?: number;
  protected _size = 0;

  constructor(maxSize?: number) {
    this._maxSize = maxSize;
  }

  get size(): number {
    return this._size;
  }

  get maxSize(): number | undefined {
    return this._maxSize;
  }

  public removeFirst(): T | null {
    if (this.head) {
      const value = this.head.value;
      this.remove(this.head);
      return value;
    }
    return null;
  }

  public append(value: T): DLLNode<T> {
    const node = new DLLNode(value);
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      this.tail!.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
    this._size++;

    while (this._maxSize !== undefined && this._size > this._maxSize) {
      this.remove(this.head!);
    }
    return node;
  }

  public remove(node: DLLNode<T>): void {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
    this._size--;
  }

  public toArray(): T[] {
    let current = this.head;
    const result: T[] = [];
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }
}
