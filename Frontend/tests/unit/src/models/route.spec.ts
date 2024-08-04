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
            route.addStep(undefined, newStep);

            expect(route.steps[0]).toBe(newStep);
            expect(route.currentStep).toBe(undefined);
        });

        it('should correctly add a step after the only other step of a route', () => {
            const firstStep = new StepModel(0, '');
            route.addStep(firstStep);
            const newStep = new StepModel(0, '');
            route.addStep(firstStep, newStep);

            expect(route.steps[0]).toBe(firstStep);
            expect(route.steps[1]).toBe(newStep);
            expect(route.currentStep).toBe(undefined);
        });

        it('should correctly add a step before the only other step of a route', () => {
            const lastStep = new StepModel(0, '');
            route.addStep(lastStep);
            const newStep = new StepModel(0, '');
            route.addStep(newStep);

            expect(route.steps[0]).toBe(newStep);
            expect(route.steps[1]).toBe(lastStep);
            expect(route.currentStep).toBe(undefined);
        });

        it('should correctly add a step in between the only 2 other steps of a route', () => {
            const firstStep = new StepModel(0, '');
            route.addStep(firstStep);
            const lastStep = new StepModel(0, '');
            route.addStep(lastStep, firstStep);
            const newStep = new StepModel(0, '');
            route.addStep(newStep, firstStep);


            expect(route.steps[0]).toBe(firstStep);
            expect(route.steps[2]).toBe(newStep);
            expect(route.steps[1]).toBe(lastStep);

            expect(route.currentStep).toBe(undefined);
        });

        it('should correctly create a tree', () => {
            const step = new StepModel(0, 'A');
            const step110 = new StepModel(0, 'A');
            const step11 = new StepModel(0, 'A');
            const step02 = new StepModel(0, 'B');
            route.addStep(undefined, step0);
            const firstChild = new StepModel(1, 'A-1');
            route.addStep(step0);
            const thirdChild = new StepModel(1, 'A-3');
            route.addStep(thirdChild);
            const secondChild = new StepModel(1, 'A-2');
            route.addStep(secondChild);

            expect(step0.children.length).toEqual(3);
            expect(step0.children[0].description).toEqual(firstChild.description);
            expect(step0.children[1].description).toEqual(secondChild.description);
            expect(step0.children[2].description).toEqual(thirdChild.description);
        });
    });
});