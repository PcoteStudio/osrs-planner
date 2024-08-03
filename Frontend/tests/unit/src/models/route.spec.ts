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
            const newStep = new Step();
            route.addStep(undefined, newStep);

            expect(route.firstStep).toBe(newStep);
            expect(route.lastStep).toBe(newStep);
            expect(route.currentStep).toBe(undefined);
        });
    });
});