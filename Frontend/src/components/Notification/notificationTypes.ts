import { Effect } from '@/models/effect';

export type Notification =
    AddEffectNotification
    | RemoveEffectNotification
    | toggleCompleted
    | setCurrentRoute
    ;
type AddEffectNotification = {
    action: 'addEffect';
    data: {
        effect: Effect;
        stepLabel: string;
    }
}

type RemoveEffectNotification = {
    action: 'removeEffect';
    data: {
        effect: Effect;
        stepLabel: string;
    }
}

type toggleCompleted = {
    action: 'toggleCompleted';
    data: {
        stepLabel: string;
        completed: boolean;
    }
}

type setCurrentRoute = {
    action: 'setCurrentRoute';
    data: {
        nbSteps: number;
    }
}