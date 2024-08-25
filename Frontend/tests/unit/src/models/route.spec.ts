import { assert, beforeEach, describe, expect, it } from 'vitest';
import { Route } from '@/models/route';
import { Step } from '@/models/step';
import { StepTreeNode } from '@/models/stepTreeNode';
import { SkillEffect } from '@/models/skill/skillEffect';
import { SkillsEnum } from '@/models/skill/skillsEnum';

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
      expect(route.rootNode.children[0].step.description).toStrictEqual('1');
      expect(route.rootNode.children[0].depth).toStrictEqual(0);
      expect(route.currentNode).toBe(undefined);
    });

    it('should correctly add a step after the only other step of a route', () => {
      const firstNode = route.addStep(new Step('1'));
      route.addStep(new Step('2'), firstNode);

      expect(route.getStepCount(route.rootNode)).toStrictEqual(2);
      expect(route.rootNode.children[0].step.description).toStrictEqual('1');
      expect(route.rootNode.children[1].step.description).toStrictEqual('2');
      expect(route.rootNode.children[0].depth).toStrictEqual(0);
      expect(route.rootNode.children[1].depth).toStrictEqual(0);
      expect(route.currentNode).toBe(undefined);
    });

    it('should correctly add a step in between the only 2 other steps of a route', () => {
      const firstNode = route.addStep(new Step('1'));
      route.addStep(new Step('3'), firstNode);
      route.addStep(new Step('2'), firstNode);

      expect(route.getStepCount(route.rootNode)).toStrictEqual(3);
      expect(route.rootNode.children[0].step.description).toStrictEqual('1');
      expect(route.rootNode.children[1].step.description).toStrictEqual('2');
      expect(route.rootNode.children[2].step.description).toStrictEqual('3');
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
      expect(route.rootNode.children[0].step.description).toStrictEqual('1');
      expect(route.rootNode.children[1].step.description).toStrictEqual('2');
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
      expect(route.rootNode.children[0].step.description).toStrictEqual('1');
      expect(route.rootNode.children[1].step.description).toStrictEqual('2');
      expect(route.rootNode.children[2].step.description).toStrictEqual('3');
      expect(route.rootNode.children[0].depth).toStrictEqual(0);
      expect(route.rootNode.children[1].depth).toStrictEqual(0);
      expect(route.rootNode.children[2].depth).toStrictEqual(0);
      expect(route.currentNode).toBe(undefined);
    });
        
    it('should throw when trying to move a step after itself', () => {
      const node1 = route.addStep(new Step());

      expect(() => { route.moveAfterNode(node1, node1); }).toThrowError();
    });

    it('should throw when trying to move a step after its child', () => {
      const node1 = route.addStep(new Step());
      const node11 = route.addSubStep(new Step(), node1);

      expect(() => { route.moveAfterNode(node1, node11); }).toThrowError();
    });

    it('should throw when trying to move a step after its grand-child', () => {
      const node1 = route.addStep(new Step());
      const node11 = route.addSubStep(new Step(), node1);
      const node111 = route.addSubStep(new Step(), node11);

      expect(() => { route.moveAfterNode(node1, node111); }).toThrowError();
    });
  });

  describe('addSubStep', () => {
    it('should correctly add a step before the only other step of a route', () => {
      route.addStep(new Step('2'));
      route.addSubStep(new Step('1'), route.rootNode);

      expect(route.getStepCount(route.rootNode)).toStrictEqual(2);
      expect(route.rootNode.children[0].step.description).toStrictEqual('1');
      expect(route.rootNode.children[1].step.description).toStrictEqual('2');
      expect(route.rootNode.children[0].depth).toStrictEqual(0);
      expect(route.rootNode.children[1].depth).toStrictEqual(0);
      expect(route.currentNode).toBe(undefined);
    });

    it('should correctly create a complex route', () => {
      createComplexRoute();

      expect(route.getStepCount(route.rootNode)).toStrictEqual(11);
      expect(route.rootNode.children[0]?.step.description).toStrictEqual('1');
      expect(route.rootNode.children[0]?.depth).toStrictEqual(0);
      expect(route.rootNode.children[0]?.children[0]?.step.description).toStrictEqual('1.1');
      expect(route.rootNode.children[0]?.children[1]?.step.description).toStrictEqual('1.2');
      expect(route.rootNode.children[0]?.children[0]?.depth).toStrictEqual(1);
      expect(route.rootNode.children[0]?.children[1]?.depth).toStrictEqual(1);
      expect(route.rootNode.children[0]?.children[1]?.children[0]?.step.description).toStrictEqual('1.2.1');
      expect(route.rootNode.children[0]?.children[1]?.children[1]?.step.description).toStrictEqual('1.2.2');
      expect(route.rootNode.children[0]?.children[1]?.children[2]?.step.description).toStrictEqual('1.2.3');
      expect(route.rootNode.children[0]?.children[1]?.children[0].depth).toStrictEqual(2);
      expect(route.rootNode.children[0]?.children[1]?.children[1].depth).toStrictEqual(2);
      expect(route.rootNode.children[0]?.children[1]?.children[2].depth).toStrictEqual(2);
      expect(route.rootNode.children[0]?.children[2]?.step.description).toStrictEqual('1.3');
      expect(route.rootNode.children[0]?.children[2]?.depth).toStrictEqual(1);
      expect(route.rootNode.children[1]?.step.description).toStrictEqual('2');
      expect(route.rootNode.children[1]?.depth).toStrictEqual(0);
      expect(route.rootNode.children[1]?.children[0]?.step.description).toStrictEqual('2.1');
      expect(route.rootNode.children[1]?.children[0]?.depth).toStrictEqual(1);
      expect(route.rootNode.children[1]?.children[0]?.children[0]?.step.description).toStrictEqual('2.1.1');
      expect(route.rootNode.children[1]?.children[0]?.children[0].depth).toStrictEqual(2);
      expect(route.rootNode.children[2]?.step.description).toStrictEqual('3');
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
      expect(route.rootNode.children[0].step.description).toStrictEqual('1');
      expect(route.rootNode.children[1].step.description).toStrictEqual('2');
      expect(route.rootNode.children[0].depth).toStrictEqual(0);
      expect(route.rootNode.children[1].depth).toStrictEqual(0);
      expect(route.currentNode).toBe(undefined);
    });

    it('should correctly move a tree of steps in a complex route', () => {
      createComplexRoute();
      const node12 = route.rootNode.children[0]?.children[1];
      const node2 = route.rootNode.children[1];
      route.moveToSubNode(node12, node2);

      expect(route.getStepCount(route.rootNode)).toStrictEqual(11);
      expect(route.rootNode.children[0]?.step.description).toStrictEqual('1');
      expect(route.rootNode.children[0]?.depth).toStrictEqual(0);
      expect(route.rootNode.children[0]?.children[0]?.step.description).toStrictEqual('1.1');
      expect(route.rootNode.children[0]?.children[1]?.step.description).toStrictEqual('1.3');
      expect(route.rootNode.children[0]?.children[0]?.depth).toStrictEqual(1);
      expect(route.rootNode.children[0]?.children[1]?.depth).toStrictEqual(1);
      expect(route.rootNode.children[0]?.children[1]?.step.description).toStrictEqual('1.3');
      expect(route.rootNode.children[0]?.children[1]?.depth).toStrictEqual(1);
      expect(route.rootNode.children[1]?.step.description).toStrictEqual('2');
      expect(route.rootNode.children[1]?.depth).toStrictEqual(0);
      expect(route.rootNode.children[1]?.children[0]?.step.description).toStrictEqual('1.2');
      expect(route.rootNode.children[1]?.children[0]?.depth).toStrictEqual(1);
      expect(route.rootNode.children[1]?.children[1]?.step.description).toStrictEqual('2.1');
      expect(route.rootNode.children[1]?.children[1]?.depth).toStrictEqual(1);
      expect(route.rootNode.children[1]?.children[0]?.children[0]?.step.description).toStrictEqual('1.2.1');
      expect(route.rootNode.children[1]?.children[0]?.children[1]?.step.description).toStrictEqual('1.2.2');
      expect(route.rootNode.children[1]?.children[0]?.children[2]?.step.description).toStrictEqual('1.2.3');
      expect(route.rootNode.children[1]?.children[0]?.children[0].depth).toStrictEqual(2);
      expect(route.rootNode.children[1]?.children[0]?.children[1].depth).toStrictEqual(2);
      expect(route.rootNode.children[1]?.children[0]?.children[2].depth).toStrictEqual(2);
      expect(route.rootNode.children[1]?.children[1]?.children[0]?.step.description).toStrictEqual('2.1.1');
      expect(route.rootNode.children[1]?.children[1]?.children[0].depth).toStrictEqual(2);
      expect(route.rootNode.children[2]?.step.description).toStrictEqual('3');
      expect(route.rootNode.children[2]?.depth).toStrictEqual(0);
      expect(route.currentNode).toBe(undefined);
    });

    it('should throw when trying to move a step under itself', () => {
      const node1 = route.addStep(new Step());

      expect(() => { route.moveToSubNode(node1, node1); }).toThrowError();
    });

    it('should throw when trying to move a step under its child', () => {
      const node1 = route.addStep(new Step());
      const node11 = route.addSubStep(new Step(), node1);

      expect(() => { route.moveToSubNode(node1, node11); }).toThrowError();
    });

    it('should throw when trying to move a step under its grand-child', () => {
      const node1 = route.addStep(new Step());
      const node11 = route.addSubStep(new Step(), node1);
      const node111 = route.addSubStep(new Step(), node11);

      expect(() => { route.moveToSubNode(node1, node111); }).toThrowError();
    });
  });

  describe('removeNode', () => {
    it('should correctly remove the first step of a route', () => {
      route.addStep(new Step('2'));
      const node1 = route.addStep(new Step('1'));

      route.removeNode(node1);

      expect(route.getStepCount(route.rootNode)).toStrictEqual(1);
      expect(route.rootNode.children[0].step.description).toStrictEqual('2');
      expect(route.rootNode.children[0].depth).toStrictEqual(0);
      expect(route.currentNode).toBe(undefined);
    });

    it('should correctly remove a step and its children in a complex route', () => {
      createComplexRoute();

      route.removeNode(route.rootNode.children[1]); // Node 2

      expect(route.getStepCount(route.rootNode)).toStrictEqual(8);
      expect(route.rootNode.children[0]?.step.description).toStrictEqual('1');
      expect(route.rootNode.children[0]?.depth).toStrictEqual(0);
      expect(route.rootNode.children[0]?.children[0]?.step.description).toStrictEqual('1.1');
      expect(route.rootNode.children[0]?.children[1]?.step.description).toStrictEqual('1.2');
      expect(route.rootNode.children[0]?.children[0]?.depth).toStrictEqual(1);
      expect(route.rootNode.children[0]?.children[1]?.depth).toStrictEqual(1);
      expect(route.rootNode.children[0]?.children[1]?.children[0]?.step.description).toStrictEqual('1.2.1');
      expect(route.rootNode.children[0]?.children[1]?.children[1]?.step.description).toStrictEqual('1.2.2');
      expect(route.rootNode.children[0]?.children[1]?.children[2]?.step.description).toStrictEqual('1.2.3');
      expect(route.rootNode.children[0]?.children[1]?.children[0].depth).toStrictEqual(2);
      expect(route.rootNode.children[0]?.children[1]?.children[1].depth).toStrictEqual(2);
      expect(route.rootNode.children[0]?.children[1]?.children[2].depth).toStrictEqual(2);
      expect(route.rootNode.children[0]?.children[2]?.step.description).toStrictEqual('1.3');
      expect(route.rootNode.children[0]?.children[2]?.depth).toStrictEqual(1);
      expect(route.rootNode.children[1]?.step.description).toStrictEqual('3');
      expect(route.rootNode.children[1]?.depth).toStrictEqual(0);
      expect(route.currentNode).toBe(undefined);
    });
  });

  describe('completeNode', () => {
    it('should complete a single node route', () => {
      const node = route.addStep(new Step('1'));
      route.completeNode(node);

      expect(node.step.completed).toStrictEqual(true);
    });

    it('should complete a single node even if it has brothers', () => {
      const node1 = route.addStep(new Step('1'));
      const node2 = route.addStep(new Step('2'), node1);
      const node3 = route.addStep(new Step('3'), node2);
      route.completeNode(node2);

      expect(node1.step.completed).toStrictEqual(false);
      expect(node2.step.completed).toStrictEqual(true);
      expect(node3.step.completed).toStrictEqual(false);
    });

    it('should complete all children and grand-children nodes', () => {
      createComplexRoute();
      route.completeNode(route.rootNode.children[0]); // Node 1

      // 7/11 nodes should be completed
      expect(route.getStepCount(route.rootNode)).toStrictEqual(11);
      expect(route.getStepCount(route.rootNode, (node: StepTreeNode) => node.step.completed === true)).toStrictEqual(7);
      expect(route.rootNode.children[0].step.completed).toStrictEqual(true); // Node 1
      expect(route.rootNode.children[0].children[0].step.completed).toStrictEqual(true); // Node 1.1
      expect(route.rootNode.children[0].children[1].step.completed).toStrictEqual(true); // Node 1.2
      expect(route.rootNode.children[0].children[1].children[0].step.completed).toStrictEqual(true); // Node 1.2.1
      expect(route.rootNode.children[0].children[1].children[1].step.completed).toStrictEqual(true); // Node 1.2.2
      expect(route.rootNode.children[0].children[1].children[2].step.completed).toStrictEqual(true); // Node 1.2.3
      expect(route.rootNode.children[0].children[2].step.completed).toStrictEqual(true); // Node 1.3
    });
  });

  describe('uncompleteNode', () => {
    it('should uncomplete a single node route', () => {
      const node = route.addStep(new Step('1'));
      route.completeNode(node);
      route.uncompleteNode(node);

      expect(node.step.completed).toStrictEqual(false);
    });

    it('should uncomplete the parent and grand-parent nodes', () => {
      const node1 = route.addStep(new Step('1'));
      const node2 = route.addSubStep(new Step('1.1'), node1);
      const node3 = route.addSubStep(new Step('1.1.1'), node2);
      route.completeNode(node2);
      route.uncompleteNode(node3);

      expect(node1.step.completed).toStrictEqual(false);
      expect(node2.step.completed).toStrictEqual(false);
      expect(node3.step.completed).toStrictEqual(false);
    });

    it('should uncomplete all children an grand-children nodes', () => {
      createComplexRoute();
      route.completeNode(route.rootNode.children[0]); // Node 1
      route.completeNode(route.rootNode.children[1]); // Node 2
      route.completeNode(route.rootNode.children[2]); // Node 3
      route.uncompleteNode(route.rootNode.children[1]); // Node 2

      // 8/11 nodes should be completed
      expect(route.getStepCount(route.rootNode)).toStrictEqual(11);
      expect(route.getStepCount(route.rootNode, (node: StepTreeNode) => node.step.completed === true)).toStrictEqual(8);
      expect(route.rootNode.children[1].step.completed).toStrictEqual(false); // Node 2
      expect(route.rootNode.children[1].children[0].step.completed).toStrictEqual(false); // Node 2.1
      expect(route.rootNode.children[1].children[0].children[0].step.completed).toStrictEqual(false); // Node 2.1.1
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
      let previousNode = Route.getPreviousNode(lastNode!)!;
      expect(previousNode.step.description).toStrictEqual('2');
      previousNode = Route.getPreviousNode(previousNode)!;
      expect(previousNode.step.description).toStrictEqual('2.1');
      previousNode = Route.getPreviousNode(previousNode)!;
      expect(previousNode.step.description).toStrictEqual('2.1.1');
      previousNode = Route.getPreviousNode(previousNode)!;
      expect(previousNode.step.description).toStrictEqual('1');
      previousNode = Route.getPreviousNode(previousNode)!;
      expect(previousNode.step.description).toStrictEqual('1.3');
      previousNode = Route.getPreviousNode(previousNode)!;
      expect(previousNode.step.description).toStrictEqual('1.2');
      previousNode = Route.getPreviousNode(previousNode)!;
      expect(previousNode.step.description).toStrictEqual('1.2.3');
      previousNode = Route.getPreviousNode(previousNode)!;
      expect(previousNode.step.description).toStrictEqual('1.2.2');
      previousNode = Route.getPreviousNode(previousNode)!;
      expect(previousNode.step.description).toStrictEqual('1.2.1');
      previousNode = Route.getPreviousNode(previousNode)!;
      expect(previousNode.step.description).toStrictEqual('1.1');
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
      expect(route.getStepCount(route.rootNode, (node: StepTreeNode) => node.step.description?.endsWith('visited') || false)).toStrictEqual(9);
    });
  });

  describe('toString', () => {
    it('should parse a full complex route as a string', () => {
      createComplexRoute();
      const result = route.toString();
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

  describe('toJSON', () => {
    it('should only save specific properties', () => {
      createComplexRoute();

      const json = JSON.stringify(route);
      const savedProperties: any = JSON.parse(json);
      expect(Object.keys(savedProperties).length).toStrictEqual(1);
      expect(savedProperties.rootNode).not.toBe(undefined);
    });
  });

  describe('fromJSON', () => {
    it('should rebuild the original object', () => {
      createComplexRoute();
      const firstNode = route.getFirstNode();
            firstNode!.step.addEffect(new SkillEffect(SkillsEnum.Crafting, 300));
            const lastNode = route.getLastNode();
            lastNode!.step.addEffect(new SkillEffect(SkillsEnum.Agility, 100));
            
            const routeJsonObject = route.toJSON();
            const json = JSON.stringify(routeJsonObject);
            const parsedRoute = Route.fromJSON(JSON.parse(json));

            let i = 1;
            let node = route.getFirstNode();
            let parsedNode = parsedRoute.getFirstNode();
            while(node && parsedNode) {
              parsedNode.step.id = node.step.id;
              node.step.description = i.toString();
              parsedNode.step.description = i.toString();
              node = Route.getNextNode(node);
              parsedNode = Route.getNextNode(parsedNode);
              i++;
            }
            console.log(route.toString());
            console.log(parsedRoute.toString());
            assert.deepStrictEqual(route, parsedRoute);

            parsedRoute.setCurrentNode(parsedRoute.getLastNode());
            expect(parsedRoute.playerState.skills.getTotalExperience()).toStrictEqual(1554);
    });
  });
});