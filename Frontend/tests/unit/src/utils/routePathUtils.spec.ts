import { Route } from '@/models/route';
import { Step } from '@/models/step';
import { getSpecificNodes, isUnder, isAncestorOf, isAfter } from '@/utils/routePathUtils';
import { beforeEach, describe, expect, it, suite } from 'vitest';

suite('routePathUtils', () => {
  let route: Route;
  beforeEach(() => {
    route = new Route();
  });
  
  const complexRoutePaths = [[1], [1, 1], [1, 2], [1,2,1], [1,2,2], [1,2,3], [1,3], [2], [2,1], [2, 1, 1], [3]];
  function populateComplexRoute() {
    route.getFirstNode().step.description = 'Desc_1';
    const pathsToAdds = complexRoutePaths.slice(1);
    pathsToAdds.forEach(path => {
      route.addStep(new Step(`Desc_${path.join('-')}`), path);
    });
  }

  describe('getSpecificNodes', () => {
    it('should return all valid nodes in a complex route', () => {
      populateComplexRoute();

      const nodes = getSpecificNodes(route.rootNode, [], () => true);
      
      expect(nodes.length).toStrictEqual(complexRoutePaths.length);
    });

    it('should not return any invalid node in a complex route', () => {
      populateComplexRoute();

      const nodes = getSpecificNodes(route.rootNode, [], () => false);
      
      expect(nodes.length).toStrictEqual(0);
    });

    it('should return only valid nodes in a complex route', () => {
      populateComplexRoute();

      const nodes = getSpecificNodes(route.rootNode, [], (testedPath: number[]) => testedPath.length % 2 === 0);
      
      expect(nodes.length).toStrictEqual(4);
    });
  });

  describe('isUnder', () => {
    it('should return true for any nodes compared to root in a complex route', () => {
      for (const path of complexRoutePaths) {
        expect(isUnder(path, [])).toStrictEqual(true);
      }
    });

    describe('should return...', () => {
      const referencePath = [1,2];
      const pathsUnder = [[1,2,1], [1,2,2], [1,2,3]];

      for (const path of complexRoutePaths) {
        const expectedResult = !!pathsUnder.find(p => p.join() === path.join());
        it(`${expectedResult} for ${path} isUnder ${referencePath}`, () => {
          expect(isUnder(path, referencePath)).toStrictEqual(expectedResult);
        });
      }
    });
  });

  describe('isAncestorOf', () => {
    describe('should return...', () => {
      const referencePath = [1,2,2];
      const pathsAncestor = [[1,2], [1]];

      for (const path of complexRoutePaths) {
        const expectedResult = !!pathsAncestor.find(p => p.join() === path.join());
        it(`${expectedResult} for ${path} isAncestorOf ${referencePath}`, () => {
          expect(isAncestorOf(path, referencePath)).toStrictEqual(expectedResult);
        });
      }
    });
  });

  describe('isAfter', () => {
    describe('should return...', () => {
      const referencePath = [1,2];
      const pathsAfter = [[1], [1,3], [2], [2,1], [2, 1, 1], [3]];

      for (const path of complexRoutePaths) {
        const expectedResult = !!pathsAfter.find(p => p.join() === path.join());
        it(`${expectedResult} for ${path} isAfter ${referencePath}`, () => {
          expect(isAfter(path, referencePath)).toStrictEqual(expectedResult);
        });
      }
    });
  });
});