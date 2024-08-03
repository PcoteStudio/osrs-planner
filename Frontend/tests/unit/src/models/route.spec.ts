import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { Route } from '../../../../src/models/route';
import { Step } from '../../../../src/models/step';

describe('Route', () => {
    let route: Route;
    beforeEach(() => {
        route = new Route();
    });

    describe('addStep', () => {
        it('should correctly add a step in an empty route', () => {
            const newStep = new Step(0, '');
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
            const firstStep = new Step(0, '');
            route.addStep(undefined, firstStep);
            const newStep = new Step(0, '');
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
            const lastStep = new Step(0, '');
            route.addStep(undefined, lastStep);
            const newStep = new Step(0, '');
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
            const firstStep = new Step(0, '');
            route.addStep(undefined, firstStep);
            const lastStep = new Step(0, '');
            route.addStep(firstStep, lastStep);
            const newStep = new Step(0, '');
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