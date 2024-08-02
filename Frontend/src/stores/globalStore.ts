import {defineStore} from 'pinia';
import {Route} from "@/models/route";
import {PlayerState} from "@/models/playerState";
import {Equipment} from "@/models/item/equipment";

export const useGlobalStore = defineStore('globalStore', {
    state: () => {
        const playerState = new PlayerState();
        playerState.equipment = new Equipment();

        const currentRoute = new Route();
        currentRoute.playerState = playerState;


        return {
            currentRoute: currentRoute,
            currentPlayerState: playerState,
        };
    },
    actions: {},
});