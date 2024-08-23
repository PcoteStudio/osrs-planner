import { StepTreeNode } from '@/models/stepTreeNode';

export class InvalidNodeMoveAfter extends Error {
  constructor(
        public readonly nodeToMove: StepTreeNode,
        public readonly previousNode: StepTreeNode
  ) {
    super('These nodes cannot be moved after one another');
    Object.setPrototypeOf(this, InvalidNodeMoveAfter.prototype);
  }
}