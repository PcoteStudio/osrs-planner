import { Route } from '../route';

export function parseRouteJson(routeJson: string): Route {
    return Route.fromJSON(JSON.parse(routeJson));
}