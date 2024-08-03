import { defineStore } from 'pinia';
import { RouteModel } from '@/models/routeModel';
import { PlayerStateModel } from '@/models/playerStateModel';
import { EquipmentModel } from '@/models/item/equipmentModel';

export const useGlobalStore = defineStore('globalStore', {
    state: () => {
        const playerState = new PlayerStateModel();

        const currentRoute = new RouteModel();
        currentRoute.playerState = playerState;

        return {
            currentRoute: currentRoute,
            currentPlayerState: playerState,
            currentWarnings: playerState.warnings,
        };
    },
    actions: {},
});