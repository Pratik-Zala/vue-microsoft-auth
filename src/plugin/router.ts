
import type { App } from 'vue';
import type { Router } from 'vue-router';
import ModularLoginComponent from '../components/ModularLoginComponent.vue';
import ModularRegisterComponent from '../components/ModularRegisterComponent.vue';

export interface RouterPluginOptions {
  router: Router;
  loginPath?: string;
  registerPath?: string;
  loginName?: string;
  registerName?: string;
}

export const RouterPlugin = {
  install(app: App, options: RouterPluginOptions) {
    if (!options.router) {
      console.warn('[vue-twymx] Router instance is required for automatic route registration');
      return;
    }

    const {
      router,
      loginPath = '/login',
      registerPath = '/register',
      loginName = 'Login',
      registerName = 'Register'
    } = options;

    // Check if routes already exist to avoid conflicts
    const existingRoutes = router.getRoutes();
    const loginExists = existingRoutes.some(route => route.path === loginPath);
    const registerExists = existingRoutes.some(route => route.path === registerPath);

    if (!loginExists) {
      router.addRoute({
        path: loginPath,
        name: loginName,
        component: ModularLoginComponent,
        meta: {
          requiresAuth: false,
          addedByTwymx: true
        }
      });
    }

    if (!registerExists) {
      router.addRoute({
        path: registerPath,
        name: registerName,
        component: ModularRegisterComponent,
        meta: {
          requiresAuth: false,
          addedByTwymx: true
        }
      });
    }

    // Provide router instance globally
    app.provide('twymxRouter', router);
  }
};
