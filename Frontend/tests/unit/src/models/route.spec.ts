import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { RouteModel } from '../../../../src/models/routeModel';
import { StepModel } from '../../../../src/models/stepModel';

describe('Route', () => {
    let route: RouteModel;
    beforeEach(() => {
        route = new RouteModel();
    });

    describe('addStep', () => {
        it('should correctly add a step in an empty route', () => {
            const newStep = new StepModel(0, '');
            route.addStep(newStep);

            expect(route.steps[0]).toBe(newStep);
            expect(route.currentStep).toBe(undefined);
        });

        it('should correctly add a step after the only other step of a route', () => {
            const firstStep = new StepModel(0, '');
            route.addStep(firstStep);
            const newStep = new StepModel(0, '');
            route.addStep(newStep, firstStep);

            expect(route.steps[0]).toBe(firstStep);
            expect(route.steps[1]).toBe(newStep);
            expect(route.currentStep).toBe(undefined);
        });

        it('should correctly add a step before the only other step of a route', () => {
            const lastStep = new StepModel(0, '');
            route.addStep(lastStep);
            const newStep = new StepModel(0, '');
            route.addStep(newStep, null);

            expect(route.steps[0]).toBe(newStep);
            expect(route.steps[1]).toBe(lastStep);
            expect(route.currentStep).toBe(undefined);
        });

        it('should correctly add a step in between the only 2 other steps of a route', () => {
            const firstStep = new StepModel(0, '');
            route.addStep(firstStep);
            const lastStep = new StepModel(0, '');
            route.addStep(lastStep);
            const newStep = new StepModel(0, '');
            route.addStep(newStep, firstStep);


            expect(route.steps[0]).toBe(firstStep);
            expect(route.steps[1]).toBe(newStep);
            expect(route.steps[2]).toBe(lastStep);

            expect(route.currentStep).toBe(undefined);
        });

        it('should correctly create a tree', () => {
            const step1 = new StepModel(0, 'A');
            const step11 = new StepModel(1, 'A-1');
            const step12 = new StepModel(1, 'A-2');
            const step121 = new StepModel(2, 'A-2-1');
            const step122 = new StepModel(2, 'A-2-2');
            const step123 = new StepModel(2, 'A-2-3');
            const step13 = new StepModel(1, 'A-3');
            const step2 = new StepModel(0, 'B');

            route.addStep(step1);
            route.addStep(step11);
            route.addStep(step12);
            route.addStep(step121);
            route.addStep(step122);
            route.addStep(step123);
            route.addStep(step13);
            route.addStep(step2);

            const tree = route.toTree();
            expect(tree[0].step.description).toEqual('A');
            expect(tree[0].children[0].step.description).toEqual('A-1');
            expect(tree[0].children[1].step.description).toEqual('A-2');
            expect(tree[0].children[1].children[0].step.description).toEqual('A-2-1');
            expect(tree[0].children[1].children[1].step.description).toEqual('A-2-2');
            expect(tree[0].children[1].children[2].step.description).toEqual('A-2-3');
            expect(tree[0].children[2].step.description).toEqual('A-3');
            expect(tree[1].step.description).toEqual('B');
        });
    });
});