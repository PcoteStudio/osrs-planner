import { beforeEach, describe, expect, it } from 'vitest';
import { RouteModel } from '../../../../src/models/routeModel';
import { StepModel } from '../../../../src/models/stepModel';

describe('Route', () => {
    let route: RouteModel;
    beforeEach(() => {
        route = new RouteModel();
    });

    describe('addStep', () => {
        it('should correctly add a step in an empty route', () => {
            const newStep = new StepModel('1');
            route.addStep(newStep);

            expect(route.countSteps(route.rootNode)).toEqual(1);
            expect(route.rootNode.children[0].step?.description).toEqual('1');
            expect(route.currentNode).toBe(undefined);
        });

        it('should correctly add a step after the only other step of a route', () => {
            const firstStep = new StepModel('1');
            const firstNode = route.addStep(firstStep);
            const newStep = new StepModel('2');
            route.addStep(newStep, firstNode);

            expect(route.countSteps(route.rootNode)).toEqual(2);
            expect(route.rootNode.children[0].step?.description).toEqual('1');
            expect(route.rootNode.children[1].step?.description).toEqual('2');
            expect(route.currentNode).toBe(undefined);
        });

        it('should correctly add a step before the only other step of a route', () => {
            route.addStep(new StepModel('2'));
            const newStep = new StepModel('1');
            route.addSubStep(newStep, route.rootNode);

            expect(route.countSteps(route.rootNode)).toEqual(2);
            expect(route.rootNode.children[0].step?.description).toEqual('1');
            expect(route.rootNode.children[1].step?.description).toEqual('2');
            expect(route.currentNode).toBe(undefined);
        });

        it('should correctly add a step in between the only 2 other steps of a route', () => {
            const firstStep = new StepModel('1');
            const firstNode = route.addStep(firstStep);
            const thirdStep = new StepModel('3');
            route.addStep(thirdStep, firstNode);
            const newStep = new StepModel('2');
            route.addStep(newStep, firstNode);

            expect(route.countSteps(route.rootNode)).toEqual(3);
            expect(route.rootNode.children[0].step?.description).toEqual('1');
            expect(route.rootNode.children[1].step?.description).toEqual('2');
            expect(route.rootNode.children[2].step?.description).toEqual('3');
            expect(route.currentNode).toBe(undefined);
        });
    });

    describe('addSubStep', () => {
        it('should correctly create a complex tree', () => {
            const node1 = route.addStep(new StepModel('1'));
            const node11 = route.addSubStep(new StepModel('1.1'), node1);
            const node12 = route.addStep(new StepModel('1.2'), node11);
            const node121 = route.addSubStep(new StepModel('1.2.1'), node12);
            const node122 = route.addStep(new StepModel('1.2.2'), node121);
            const node123 = route.addStep(new StepModel('1.2.3'), node122);
            const node13 = route.addStep(new StepModel('1.3'), node12);
            const node2 = route.addStep(new StepModel('2'), node1);
            const node21 = route.addSubStep(new StepModel('2.1'), node2);
            const node211 = route.addSubStep(new StepModel('2.1.1'), node21);
            const node3 = route.addStep(new StepModel('3'), node2);

            expect(route.countSteps(route.rootNode)).toEqual(11);
            expect(route.rootNode.children[0]?.step?.description).toEqual('1');
            expect(route.rootNode.children[0]?.children[0]?.step?.description).toEqual('1.1');
            expect(route.rootNode.children[0]?.children[1]?.step?.description).toEqual('1.2');
            expect(route.rootNode.children[0]?.children[1]?.children[0]?.step?.description).toEqual('1.2.1');
            expect(route.rootNode.children[0]?.children[1]?.children[1]?.step?.description).toEqual('1.2.2');
            expect(route.rootNode.children[0]?.children[1]?.children[2]?.step?.description).toEqual('1.2.3');
            expect(route.rootNode.children[0]?.children[2]?.step?.description).toEqual('1.3');
            expect(route.rootNode.children[1]?.step?.description).toEqual('2');
            expect(route.currentNode).toBe(undefined);
        });
    });
});