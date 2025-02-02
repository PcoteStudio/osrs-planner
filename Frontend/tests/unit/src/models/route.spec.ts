import { beforeEach, describe, expect, it, suite } from 'vitest';
import { Route } from '@/models/route';
import { Step } from '@/models/step';
import { RootStepNode, StepNode } from '@/models/stepTreeNode';
import { PlayerState } from '@/models/playerState';
import { SkillEffect } from '@/models/skill/skillEffect';
import { SkillsEnum } from '@/models/skill/skillsEnum';
import { getAllNodes } from '@/utils/routePathUtils';

suite('Route', () => {
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

  describe('getFirstNode', () => {
    it('should return the first node on a new route', () => {
      expect(route.getFirstNode()).toBe(route.getNode([1]));
    });

    it('should return the first node on a complex route', () => {
      populateComplexRoute();

      expect(route.getFirstNode().step.description).toStrictEqual('Desc_1-1');
    });
  });

  describe('getLastNode', () => {
    it('should return the first node on a new route', () => {
      expect(route.getLastNode()).toBe(route.getNode([1]));
    });

    it('should return the last node on a complex route', () => {
      populateComplexRoute();

      expect(route.getLastNode().step.description).toStrictEqual('Desc_3');
    });
  });

  describe('getStepCount', () => {
    it('should return 1 on a new route', () => {
      expect(route.getStepCount(route.rootNode)).toStrictEqual(1);
    });

    it('should return the right count on a complex route', () => {
      populateComplexRoute();

      expect(route.getStepCount(route.rootNode)).toStrictEqual(complexRoutePaths.length);
    });

    it('should return the right count with a filter on a complex route', () => {
      populateComplexRoute();

      expect(route.getStepCount(
        route.rootNode,
        (node: StepNode) => node.step.description.startsWith('Desc_2')
      )).toStrictEqual(3);
    });
  });

  describe('getNode', () => {
    it('should return the root node when passing an empty path', () => {
      const node = route.getNode([]);
      
      expect(node).toBeInstanceOf(RootStepNode);
      expect(node).toBe(route.rootNode);
    });

    it('should return the initial node', () => {
      expect(route.getNode([1])).toBe(route.getFirstNode());
    });

    it('should return the right node from a complex route', () => {
      populateComplexRoute();
      
      const node = route.getNode([1,2,2]);
      
      expect(node).toBeInstanceOf(StepNode);
      expect((node as StepNode).step.description).toBe('Desc_1-2-2');
    });
  });

  describe('getStepNode', () => {
    it('should throw when passing an empty path', () => {
      expect(() => route.getStepNode([])).toThrow();
    });

    it('should return the initial node', () => {
      expect(route.getNode([1])).toBe(route.getFirstNode());
    });

    it('should return the right node from a complex route', () => {
      populateComplexRoute();
      
      const node = route.getNode([1,2,2]);
      
      expect(node).toBeInstanceOf(StepNode);
      expect((node as StepNode).step.description).toBe('Desc_1-2-2');
    });
  });

  describe('addStep', () => {
    it('should correctly add a next node', () => {
      const path =  [2];
      const step = new Step('Desc_2');
      const node = route.addStep(step, path);

      expect(route.getStepCount(route.rootNode)).toStrictEqual(2);
      expect(route.getNode(path)).toBe(node);
      expect(node.step).toStrictEqual(step);
    });

    it('should correctly add a sub node', () => {
      const path =  [1,1];
      const step = new Step('Desc_1-1');
      const node = route.addStep(step, path);

      expect(route.getStepCount(route.rootNode)).toStrictEqual(2);
      expect(route.getNode(path)).toBe(node);
      expect(node.step).toStrictEqual(step);
    });
  });

  describe('completeNode', () => {
    it('should only complete the node and its children', () => {
      populateComplexRoute();
      
      route.completeNode([2]);

      expect(route.getStepNode([2]).step.completed).toStrictEqual(true);
      expect(route.getStepNode([2,1]).step.completed).toStrictEqual(true);
      expect(route.getStepNode([2,1,1]).step.completed).toStrictEqual(true);
      expect(route.getStepCount(route.rootNode, (node: StepNode) => node.step.completed)).toStrictEqual(3);
    });
  });

  describe('uncompleteNode', () => {
    it('should only uncomplete the node and its ancestors', () => {
      populateComplexRoute();
      for (const path of complexRoutePaths) {
        route.getStepNode(path).step.completed = true;
      }

      route.uncompleteNode([2,1,1]);

      expect(route.getStepNode([2]).step.completed).toStrictEqual(false);
      expect(route.getStepNode([2,1]).step.completed).toStrictEqual(false);
      expect(route.getStepCount(route.rootNode, (node: StepNode) => !node.step.completed)).toStrictEqual(3);
    });
  });

  describe('invalidateFollowingNodes', () => {
    describe('should...', () => {
      const refPath = [1,2];
      beforeEach(() => {
        populateComplexRoute();
        for (const path of complexRoutePaths) {
          const node = route.getStepNode(path);
          node.step.upToDate = true;
          node.step.resultingState = new PlayerState();
        }
        route.invalidateFollowingNodes(refPath);
      });

      const pathsInvalidated = [[1], [1,3], [2], [2,1], [2, 1, 1], [3]];
      for (const path of complexRoutePaths) {
        const expectedResult = !!pathsInvalidated.find(p => p.join() === path.join());
        it(`${expectedResult ? 'invalidate' : 'not invalidate'} ${path} from ${refPath}`, () => {
          const node = route.getStepNode(path);
          expect(node.step.upToDate).toStrictEqual(!expectedResult);
          if(expectedResult)
            expect(node.step.resultingState).toBeUndefined();
          else
            expect(node.step.resultingState).toBeInstanceOf(PlayerState);
        });
      }
    });
  });

  describe('toJSON', () => {
    it('should only save specific properties', () => {
      populateComplexRoute();

      const json = JSON.stringify(route);
      const savedProperties: Route = JSON.parse(json);
      expect(Object.keys(savedProperties).length).toStrictEqual(1);
      expect(savedProperties.rootNode).toBeDefined();
    });
  });

  describe('fromJSON', () => {
    it('should rebuild the original object', () => {
      populateComplexRoute();
      const firstNode = route.getFirstNode();
      firstNode.step.addEffect(new SkillEffect(SkillsEnum.Crafting, 300));
      const lastNode = route.getLastNode();
      lastNode.step.addEffect(new SkillEffect(SkillsEnum.Agility, 100));
      
      const routeJsonObject = route.toJSON();
      const json = JSON.stringify(routeJsonObject);
      const parsedRoute = Route.fromJSON(JSON.parse(json));

      // Adjust IDs to match the original nodes
      const originalNodes = getAllNodes(route.rootNode);
      const parsedNodes = getAllNodes(parsedRoute.rootNode);
      for (const index of parsedNodes.keys()) {
        parsedNodes[index].step.id = originalNodes[index].step.id;
      }

      expect(parsedRoute.rootNode).toStrictEqual(route.rootNode);
      expect(parsedRoute.currentNode).toStrictEqual(parsedRoute.getFirstNode());

      parsedRoute.setCurrentNode(parsedRoute.getLastNode());
      expect(parsedRoute.playerState.skills.getTotalExperience()).toStrictEqual(1554);
    });
  });
});