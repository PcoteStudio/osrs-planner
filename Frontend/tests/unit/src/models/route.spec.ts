import { beforeEach, describe, expect, it } from 'vitest';
import { Route, StepTreeNode } from '../../../../src/models/route';
import { Step } from '../../../../src/models/step';

describe('Route', () => {
    let route: Route;
    beforeEach(() => {
        route = new Route();
    });

    function createComplexRoute() {
        const node1 = route.addStep(new Step('1'));
        const node11 = route.addSubStep(new Step('1.1'), node1);
        const node12 = route.addStep(new Step('1.2'), node11);
        const node121 = route.addSubStep(new Step('1.2.1'), node12);
        const node122 = route.addStep(new Step('1.2.2'), node121);
        route.addStep(new Step('1.2.3'), node122);
        route.addStep(new Step('1.3'), node12);
        const node2 = route.addStep(new Step('2'), node1);
        const node21 = route.addSubStep(new Step('2.1'), node2);
        route.addSubStep(new Step('2.1.1'), node21);
        route.addStep(new Step('3'), node2);
    }

    describe('addStep', () => {
        it('should correctly add a step in an empty route', () => {
            route.addStep(new Step('1'));

            expect(route.getStepCount(route.rootNode)).toStrictEqual(1);
            expect(route.rootNode.children[0].step?.description).toStrictEqual('1');
            expect(route.rootNode.children[0].depth).toStrictEqual(0);
            expect(route.currentNode).toBe(undefined);
        });

        it('should correctly add a step after the only other step of a route', () => {
            const firstNode = route.addStep(new Step('1'));
            route.addStep(new Step('2'), firstNode);

            expect(route.getStepCount(route.rootNode)).toStrictEqual(2);
            expect(route.rootNode.children[0].step?.description).toStrictEqual('1');
            expect(route.rootNode.children[1].step?.description).toStrictEqual('2');
            expect(route.rootNode.children[0].depth).toStrictEqual(0);
            expect(route.rootNode.children[1].depth).toStrictEqual(0);
            expect(route.currentNode).toBe(undefined);
        });

        it('should correctly add a step in between the only 2 other steps of a route', () => {
            const firstNode = route.addStep(new Step('1'));
            route.addStep(new Step('3'), firstNode);
            route.addStep(new Step('2'), firstNode);

            expect(route.getStepCount(route.rootNode)).toStrictEqual(3);
            expect(route.rootNode.children[0].step?.description).toStrictEqual('1');
            expect(route.rootNode.children[1].step?.description).toStrictEqual('2');
            expect(route.rootNode.children[2].step?.description).toStrictEqual('3');
            expect(route.rootNode.children[0].depth).toStrictEqual(0);
            expect(route.rootNode.children[1].depth).toStrictEqual(0);
            expect(route.rootNode.children[2].depth).toStrictEqual(0);
            expect(route.currentNode).toBe(undefined);
        });
    });

    describe('moveAfterNode', () => {
        it('should correctly move a step after the only other step of a route', () => {
            const secondNode = route.addStep(new Step('2'));
            const firstNode = route.addStep(new Step('1'), secondNode);

            route.moveAfterNode(secondNode, firstNode);

            expect(route.getStepCount(route.rootNode)).toStrictEqual(2);
            expect(route.rootNode.children[0].step?.description).toStrictEqual('1');
            expect(route.rootNode.children[1].step?.description).toStrictEqual('2');
            expect(route.rootNode.children[0].depth).toStrictEqual(0);
            expect(route.rootNode.children[1].depth).toStrictEqual(0);
            expect(route.currentNode).toBe(undefined);
        });

        it('should correctly move a step in between the only 2 other steps of a route', () => {
            const secondNode = route.addStep(new Step('2'));
            route.addStep(new Step('3'), secondNode);
            const firstNode = route.addStep(new Step('1'), secondNode);

            route.moveAfterNode(secondNode, firstNode);

            expect(route.getStepCount(route.rootNode)).toStrictEqual(3);
            expect(route.rootNode.children[0].step?.description).toStrictEqual('1');
            expect(route.rootNode.children[1].step?.description).toStrictEqual('2');
            expect(route.rootNode.children[2].step?.description).toStrictEqual('3');
            expect(route.rootNode.children[0].depth).toStrictEqual(0);
            expect(route.rootNode.children[1].depth).toStrictEqual(0);
            expect(route.rootNode.children[2].depth).toStrictEqual(0);
            expect(route.currentNode).toBe(undefined);
        });
    });

    describe('addSubStep', () => {
        it('should correctly add a step before the only other step of a route', () => {
            route.addStep(new Step('2'));
            route.addSubStep(new Step('1'), route.rootNode);

            expect(route.getStepCount(route.rootNode)).toStrictEqual(2);
            expect(route.rootNode.children[0].step?.description).toStrictEqual('1');
            expect(route.rootNode.children[1].step?.description).toStrictEqual('2');
            expect(route.rootNode.children[0].depth).toStrictEqual(0);
            expect(route.rootNode.children[1].depth).toStrictEqual(0);
            expect(route.currentNode).toBe(undefined);
        });

        it('should correctly create a complex route', () => {
            createComplexRoute();

            expect(route.getStepCount(route.rootNode)).toStrictEqual(11);
            expect(route.rootNode.children[0]?.step?.description).toStrictEqual('1');
            expect(route.rootNode.children[0]?.depth).toStrictEqual(0);
            expect(route.rootNode.children[0]?.children[0]?.step?.description).toStrictEqual('1.1');
            expect(route.rootNode.children[0]?.children[1]?.step?.description).toStrictEqual('1.2');
            expect(route.rootNode.children[0]?.children[0]?.depth).toStrictEqual(1);
            expect(route.rootNode.children[0]?.children[1]?.depth).toStrictEqual(1);
            expect(route.rootNode.children[0]?.children[1]?.children[0]?.step?.description).toStrictEqual('1.2.1');
            expect(route.rootNode.children[0]?.children[1]?.children[1]?.step?.description).toStrictEqual('1.2.2');
            expect(route.rootNode.children[0]?.children[1]?.children[2]?.step?.description).toStrictEqual('1.2.3');
            expect(route.rootNode.children[0]?.children[1]?.children[0].depth).toStrictEqual(2);
            expect(route.rootNode.children[0]?.children[1]?.children[1].depth).toStrictEqual(2);
            expect(route.rootNode.children[0]?.children[1]?.children[2].depth).toStrictEqual(2);
            expect(route.rootNode.children[0]?.children[2]?.step?.description).toStrictEqual('1.3');
            expect(route.rootNode.children[0]?.children[2]?.depth).toStrictEqual(1);
            expect(route.rootNode.children[1]?.step?.description).toStrictEqual('2');
            expect(route.rootNode.children[1]?.depth).toStrictEqual(0);
            expect(route.rootNode.children[1]?.children[0]?.step?.description).toStrictEqual('2.1');
            expect(route.rootNode.children[1]?.children[0]?.depth).toStrictEqual(1);
            expect(route.rootNode.children[1]?.children[0]?.children[0]?.step?.description).toStrictEqual('2.1.1');
            expect(route.rootNode.children[1]?.children[0]?.children[0].depth).toStrictEqual(2);
            expect(route.rootNode.children[2]?.step?.description).toStrictEqual('3');
            expect(route.rootNode.children[2]?.depth).toStrictEqual(0);
            expect(route.currentNode).toBe(undefined);
        });
    });

    describe('moveToSubNode', () => {
        it('should correctly move a step before the only other step of a route', () => {
            route.addStep(new Step('2'));
            const node1 = route.addStep(new Step('1'));
            route.moveToSubNode(node1, route.rootNode);

            expect(route.getStepCount(route.rootNode)).toStrictEqual(2);
            expect(route.rootNode.children[0].step?.description).toStrictEqual('1');
            expect(route.rootNode.children[1].step?.description).toStrictEqual('2');
            expect(route.rootNode.children[0].depth).toStrictEqual(0);
            expect(route.rootNode.children[1].depth).toStrictEqual(0);
            expect(route.currentNode).toBe(undefined);
        });

        it.only('should correctly move a tree of steps in a complex route', () => {
            createComplexRoute();
            const node12 = route.rootNode.children[0]?.children[1];
            const node2 = route.rootNode.children[1];
            route.moveToSubNode(node12, node2);

            expect(route.getStepCount(route.rootNode)).toStrictEqual(11);
            expect(route.rootNode.children[0]?.step?.description).toStrictEqual('1');
            expect(route.rootNode.children[0]?.depth).toStrictEqual(0);
            expect(route.rootNode.children[0]?.children[0]?.step?.description).toStrictEqual('1.1');
            expect(route.rootNode.children[0]?.children[1]?.step?.description).toStrictEqual('1.3');
            expect(route.rootNode.children[0]?.children[0]?.depth).toStrictEqual(1);
            expect(route.rootNode.children[0]?.children[1]?.depth).toStrictEqual(1);
            expect(route.rootNode.children[0]?.children[1]?.step?.description).toStrictEqual('1.3');
            expect(route.rootNode.children[0]?.children[1]?.depth).toStrictEqual(1);
            expect(route.rootNode.children[1]?.step?.description).toStrictEqual('2');
            expect(route.rootNode.children[1]?.depth).toStrictEqual(0);
            expect(route.rootNode.children[1]?.children[0]?.step?.description).toStrictEqual('1.2');
            expect(route.rootNode.children[1]?.children[0]?.depth).toStrictEqual(1);
            expect(route.rootNode.children[1]?.children[1]?.step?.description).toStrictEqual('2.1');
            expect(route.rootNode.children[1]?.children[1]?.depth).toStrictEqual(1);
            expect(route.rootNode.children[1]?.children[0]?.children[0]?.step?.description).toStrictEqual('1.2.1');
            expect(route.rootNode.children[1]?.children[0]?.children[1]?.step?.description).toStrictEqual('1.2.2');
            expect(route.rootNode.children[1]?.children[0]?.children[2]?.step?.description).toStrictEqual('1.2.3');
            expect(route.rootNode.children[1]?.children[0]?.children[0].depth).toStrictEqual(2);
            expect(route.rootNode.children[1]?.children[0]?.children[1].depth).toStrictEqual(2);
            expect(route.rootNode.children[1]?.children[0]?.children[2].depth).toStrictEqual(2);
            expect(route.rootNode.children[1]?.children[1]?.children[0]?.step?.description).toStrictEqual('2.1.1');
            expect(route.rootNode.children[1]?.children[1]?.children[0].depth).toStrictEqual(2);
            expect(route.rootNode.children[2]?.step?.description).toStrictEqual('3');
            expect(route.rootNode.children[2]?.depth).toStrictEqual(0);
            expect(route.currentNode).toBe(undefined);
        });
    });

    describe('completeNode', () => {
        it('should complete a single node route', () => {
            const node = route.addStep(new Step('1'));
            route.completeNode(node);

            expect(node.step?.completed).toStrictEqual(true);
        });

        it('should complete a single node even if it has brothers', () => {
            const node1 = route.addStep(new Step('1'));
            const node2 = route.addStep(new Step('2'), node1);
            const node3 = route.addStep(new Step('3'), node2);
            route.completeNode(node2);

            expect(node1.step?.completed).toStrictEqual(false);
            expect(node2.step?.completed).toStrictEqual(true);
            expect(node3.step?.completed).toStrictEqual(false);
        });

        it('should complete all children and grand-children nodes', () => {
            createComplexRoute();
            route.completeNode(route.rootNode.children[0]); // Node 1

            // 7/11 nodes should be completed
            expect(route.getStepCount(route.rootNode)).toStrictEqual(11);
            expect(route.getStepCount(route.rootNode, (node: StepTreeNode) => node.step?.completed === true)).toStrictEqual(7);
            expect(route.rootNode.children[0].step?.completed).toStrictEqual(true); // Node 1
            expect(route.rootNode.children[0].children[0].step?.completed).toStrictEqual(true); // Node 1.1
            expect(route.rootNode.children[0].children[1].step?.completed).toStrictEqual(true); // Node 1.2
            expect(route.rootNode.children[0].children[1].children[0].step?.completed).toStrictEqual(true); // Node 1.2.1
            expect(route.rootNode.children[0].children[1].children[1].step?.completed).toStrictEqual(true); // Node 1.2.2
            expect(route.rootNode.children[0].children[1].children[2].step?.completed).toStrictEqual(true); // Node 1.2.3
            expect(route.rootNode.children[0].children[2].step?.completed).toStrictEqual(true); // Node 1.3
        });
    });

    describe('uncompleteNode', () => {
        it('should uncomplete a single node route', () => {
            const node = route.addStep(new Step('1'));
            route.completeNode(node);
            route.uncompleteNode(node);

            expect(node.step?.completed).toStrictEqual(false);
        });

        it('should uncomplete the parent and grand-parent nodes', () => {
            const node1 = route.addStep(new Step('1'));
            const node2 = route.addSubStep(new Step('1.1'), node1);
            const node3 = route.addSubStep(new Step('1.1.1'), node2);
            route.completeNode(node2);
            route.uncompleteNode(node3);

            expect(node1.step?.completed).toStrictEqual(false);
            expect(node2.step?.completed).toStrictEqual(false);
            expect(node3.step?.completed).toStrictEqual(false);
        });

        it('should uncomplete all children an grand-children nodes', () => {
            createComplexRoute();
            route.completeNode(route.rootNode.children[0]); // Node 1
            route.completeNode(route.rootNode.children[1]); // Node 2
            route.completeNode(route.rootNode.children[2]); // Node 3
            route.uncompleteNode(route.rootNode.children[1]); // Node 2

            // 8/11 nodes should be completed
            expect(route.getStepCount(route.rootNode)).toStrictEqual(11);
            expect(route.getStepCount(route.rootNode, (node: StepTreeNode) => node.step?.completed === true)).toStrictEqual(8);
            expect(route.rootNode.children[1].step?.completed).toStrictEqual(false); // Node 2
            expect(route.rootNode.children[1].children[0].step?.completed).toStrictEqual(false); // Node 2.1
            expect(route.rootNode.children[1].children[0].children[0].step?.completed).toStrictEqual(false); // Node 2.1.1
        });
    });

    describe('stepOnce', () => {
        it('should correctly navigate through a complex route', () => {
            createComplexRoute();

            expect(route.stepOnce()).toStrictEqual(true);
            expect(route.getCurrentStep()?.description).toStrictEqual('1.1');
            expect(route.stepOnce()).toStrictEqual(true);
            expect(route.getCurrentStep()?.description).toStrictEqual('1.2.1');
            expect(route.stepOnce()).toStrictEqual(true);
            expect(route.getCurrentStep()?.description).toStrictEqual('1.2.2');
            expect(route.stepOnce()).toStrictEqual(true);
            expect(route.getCurrentStep()?.description).toStrictEqual('1.2.3');
            expect(route.stepOnce()).toStrictEqual(true);
            expect(route.getCurrentStep()?.description).toStrictEqual('1.2');
            expect(route.stepOnce()).toStrictEqual(true);
            expect(route.getCurrentStep()?.description).toStrictEqual('1.3');
            expect(route.stepOnce()).toStrictEqual(true);
            expect(route.getCurrentStep()?.description).toStrictEqual('1');
            expect(route.stepOnce()).toStrictEqual(true);
            expect(route.getCurrentStep()?.description).toStrictEqual('2.1.1');
            expect(route.stepOnce()).toStrictEqual(true);
            expect(route.getCurrentStep()?.description).toStrictEqual('2.1');
            expect(route.stepOnce()).toStrictEqual(true);
            expect(route.getCurrentStep()?.description).toStrictEqual('2');
            expect(route.stepOnce()).toStrictEqual(true);
            expect(route.getCurrentStep()?.description).toStrictEqual('3');
            expect(route.stepOnce()).toStrictEqual(false);
            expect(route.getCurrentStep()?.description).toStrictEqual('3');
        });
    });

    describe('getPreviousNode', () => {
        it('should correctly find the previous node in a complex route', () => {
            createComplexRoute();

            const lastNode = route.getLastNode(); // Node 3
            let previousNode = route.getPreviousNode(lastNode);
            expect(previousNode.step?.description).toStrictEqual('2');
            previousNode = route.getPreviousNode(previousNode);
            expect(previousNode.step?.description).toStrictEqual('2.1');
            previousNode = route.getPreviousNode(previousNode);
            expect(previousNode.step?.description).toStrictEqual('2.1.1');
            previousNode = route.getPreviousNode(previousNode);
            expect(previousNode.step?.description).toStrictEqual('1');
            previousNode = route.getPreviousNode(previousNode);
            expect(previousNode.step?.description).toStrictEqual('1.3');
            previousNode = route.getPreviousNode(previousNode);
            expect(previousNode.step?.description).toStrictEqual('1.2');
            previousNode = route.getPreviousNode(previousNode);
            expect(previousNode.step?.description).toStrictEqual('1.2.3');
            previousNode = route.getPreviousNode(previousNode);
            expect(previousNode.step?.description).toStrictEqual('1.2.2');
            previousNode = route.getPreviousNode(previousNode);
            expect(previousNode.step?.description).toStrictEqual('1.2.1');
            previousNode = route.getPreviousNode(previousNode);
            expect(previousNode.step?.description).toStrictEqual('1.1');
        });
    });

    describe('executeOnNextNodes', () => {
        it('should execute the custom code on all the next nodes of a complex route', () => {
            createComplexRoute();
            route.executeOnNextNodes(
                route.rootNode.children[0].children[1].children[1], // Node 1.2.2
                (node: StepTreeNode) => { if (node.step) node.step.description += ' visited'; }
            );

            // 9/11 nodes should be completed
            expect(route.getStepCount(route.rootNode)).toStrictEqual(11);
            expect(route.getStepCount(route.rootNode, (node: StepTreeNode) => node.step?.description?.endsWith('visited') || false)).toStrictEqual(9);
        });
    });

    describe('toString', () => {
        it('should parse a full complex route as a string', () => {
            createComplexRoute();
            const result = route.toString(route.rootNode);
            console.log(result);

            const lines = result.split('\n');
            expect(lines.length).toBeGreaterThanOrEqual(12);
            expect(lines[0]).toContain('root');
            expect(lines[1]).toContain('1');
            expect(lines[2]).toContain('1.1');
            expect(lines[3]).toContain('1.2');
            expect(lines[4]).toContain('1.2.1');
            expect(lines[5]).toContain('1.2.2');
            expect(lines[6]).toContain('1.2.3');
            expect(lines[7]).toContain('1.3');
            expect(lines[8]).toContain('2');
            expect(lines[9]).toContain('2.1');
            expect(lines[10]).toContain('2.1.1');
            expect(lines[11]).toContain('3');
        });
    });
});