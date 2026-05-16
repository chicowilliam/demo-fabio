import { optimizeShoppingRoute, type OptimizedShoppingRoute } from './clientRoute';

export type NavigationRequest = {
  selectedItemIds: string[];
};

export type NavigationSdkAdapter = {
  buildRoute: (request: NavigationRequest) => OptimizedShoppingRoute;
};

const localAdapter: NavigationSdkAdapter = {
  buildRoute: ({ selectedItemIds }) => optimizeShoppingRoute(selectedItemIds),
};

export function createNavigationEngine(adapter: NavigationSdkAdapter = localAdapter) {
  return {
    buildRoute: (request: NavigationRequest) => adapter.buildRoute(request),
  };
}
