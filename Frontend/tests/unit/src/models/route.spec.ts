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
        const node123 = route.addStep(new Step('1.2.3'), node122);
        const node13 = route.addStep(new Step('1.3'), node12);
        const node2 = route.addStep(new Step('2'), node1);
        const node21 = route.addSubStep(new Step('2.1'), node2);
        const node211 = route.addSubStep(new Step('2.1.1'), node21);
        const node3 = route.addStep(new Step('3'), node2);
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

            route.stepOnce();
            expect(route.getCurrentStep()?.description).toStrictEqual('1.1');
            route.stepOnce();
            expect(route.getCurrentStep()?.description).toStrictEqual('1.2.1');
            route.stepOnce();
            expect(route.getCurrentStep()?.description).toStrictEqual('1.2.2');
            route.stepOnce();
            expect(route.getCurrentStep()?.description).toStrictEqual('1.2.3');
            route.stepOnce();
            expect(route.getCurrentStep()?.description).toStrictEqual('1.2');
            route.stepOnce();
            expect(route.getCurrentStep()?.description).toStrictEqual('1.3');
            route.stepOnce();
            expect(route.getCurrentStep()?.description).toStrictEqual('1');
            route.stepOnce();
            expect(route.getCurrentStep()?.description).toStrictEqual('2.1.1');
            route.stepOnce();
            expect(route.getCurrentStep()?.description).toStrictEqual('2.1');
            route.stepOnce();
            expect(route.getCurrentStep()?.description).toStrictEqual('2');
            route.stepOnce();
            expect(route.getCurrentStep()?.description).toStrictEqual('3');
        });
    });

    describe('completeNode', () => {
        it('should complete a single node route', () => {
            const node = route.addStep(new Step('1'));
            route.completeNode(node);

            expect(node.step?.completed).toStrictEqual(true);
        });

        it('should complete all previous brother nodes', () => {
            const node1 = route.addStep(new Step('1'));
            const node2 = route.addStep(new Step('2'), node1);
            const node3 = route.addStep(new Step('3'), node2);
            route.completeNode(node2);

            expect(node1.step?.completed).toStrictEqual(true);
            expect(node2.step?.completed).toStrictEqual(true);
            expect(node3.step?.completed).toStrictEqual(false);
        });

        it('should complete all children an grand-children nodes', () => {
            createComplexRoute();
            route.completeNode(route.rootNode.children[1]); // Node 2

            // 10/11 nodes should be completed
            expect(route.getStepCount(route.rootNode)).toStrictEqual(11);
            expect(route.getStepCount(route.rootNode, (node: StepTreeNode) => node.step?.completed === true)).toStrictEqual(10);
            expect(route.rootNode.children[2].step?.completed).toStrictEqual(false); // Node 3
        });
    });
});