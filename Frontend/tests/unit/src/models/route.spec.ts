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

            expect(route.firstStep).toBe(newStep);
            expect(route.lastStep).toBe(newStep);
            expect(route.currentStep).toBe(undefined);
            expect(route.firstStep?.previous).toBe(undefined);
            expect(route.firstStep?.next).toBe(undefined);
            expect(route.lastStep?.previous).toBe(undefined);
            expect(route.lastStep?.next).toBe(undefined);
        });

        it('should correctly add a step after the only other step of a route', () => {
            const firstStep = new StepModel(0, '');
            route.addStep(undefined, firstStep);
            const newStep = new StepModel(0, '');
            route.addStep(firstStep, newStep);

            expect(route.firstStep).toBe(firstStep);
            expect(route.lastStep).toBe(newStep);
            expect(route.currentStep).toBe(undefined);

            expect(firstStep.previous).toBe(undefined);
            expect(firstStep.next).toBe(newStep);
            expect(newStep.previous).toBe(firstStep);
            expect(newStep.next).toBe(undefined);
        });

        it('should correctly add a step before the only other step of a route', () => {
            const lastStep = new StepModel(0, '');
            route.addStep(undefined, lastStep);
            const newStep = new StepModel(0, '');
            route.addStep(undefined, newStep);

            expect(route.firstStep).toBe(newStep);
            expect(route.lastStep).toBe(lastStep);
            expect(route.currentStep).toBe(undefined);

            expect(lastStep.previous).toBe(newStep);
            expect(lastStep.next).toBe(undefined);
            expect(newStep.previous).toBe(undefined);
            expect(newStep.next).toBe(lastStep);
        });

        it('should correctly add a step in between the only 2 other steps of a route', () => {
            const firstStep = new StepModel(0, '');
            route.addStep(undefined, firstStep);
            const lastStep = new StepModel(0, '');
            route.addStep(firstStep, lastStep);
            const newStep = new StepModel(0, '');
            route.addStep(firstStep, newStep);

            expect(route.firstStep).toBe(firstStep);
            expect(route.lastStep).toBe(lastStep);
            expect(route.currentStep).toBe(undefined);

            expect(lastStep.previous).toBe(newStep);
            expect(lastStep.next).toBe(undefined);
            expect(newStep.previous).toBe(firstStep);
            expect(newStep.next).toBe(lastStep);
            expect(firstStep.previous).toBe(undefined);
            expect(firstStep.next).toBe(newStep);
        });
    });
});