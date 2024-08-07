import { Route } from '../route';

type apiResponse = { success: true } | { success: false, error: Error }

export function parseRouteJson(routeJson: string): { route?: Route } & apiResponse {
    try {
        return { success: true, route: Route.fromJSON(JSON.parse(routeJson)) };
    } catch (error) {
        return { success: false, error: error as Error };
    }
}