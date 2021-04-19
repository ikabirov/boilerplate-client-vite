import createRouter, { PluginFactory, Route, Router, cloneRouter } from 'router5'
import browserPlugin from 'router5-plugin-browser'

import { MiddlewareFactory } from 'router5/dist/types/router'

import { ICustomRoute, routes } from '../../routes/routes'

export type IRouter = Router

export class RouterService {
  private baseUrl: string

  private static instance: IRouter

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl

    const formattedRoutes = RouterService.getFormattedRoutes(routes)

    RouterService.instance = createRouter(formattedRoutes, {
      allowNotFound: true,
    })

    this.setPlugins([this.getBrowserPlugin()])
  }

  private traverseRoutes(routes: ICustomRoute[]) {
    let result: ICustomRoute[] = []

    routes.forEach(route => {
      result.push(route)

      if (route.children) {
        result = result.concat(this.traverseRoutes(route.children))
      }
    })

    return result
  }

  public static getFormattedRoutes(routes: ICustomRoute[]): Route[] {
    return routes.map(RouterService.getFormattedRoute)
  }

  public static getFormattedRoute({ children, component, ...route }: ICustomRoute): Route {
    if (children) {
      return {
        ...route,
        children: RouterService.getFormattedRoutes(children),
      }
    }

    return route
  }

  public getInstance(): IRouter {
    return RouterService.instance
  }

  public getClonedInstance(): IRouter {
    return cloneRouter(this.getInstance())
  }

  public getBrowserPlugin(): PluginFactory {
    return browserPlugin({
      base: this.baseUrl === '/' ? '' : this.baseUrl,
    })
  }

  // public getAuthorizationMiddleware: () => MiddlewareFactory = () => (
  //   router,
  //   { routerStore }: { routerStore: App.TStore['router5'] }
  // ) => (toState, fromState, done) => {
  //   routerStore.checkAbilityNavigateToPage(toState, done)

  //   // avoid transition state mutation
  //   return undefined
  // }

  public setPlugins(plugins: PluginFactory[]) {
    const instance = this.getInstance()

    plugins.forEach(plugin => instance.usePlugin(plugin))
  }

  public setMiddlewares(middlewares: MiddlewareFactory[]) {
    const instance = this.getInstance()

    middlewares.forEach(middleware => instance.useMiddleware(middleware))
  }

  public getRouteByName(routeName: string): ICustomRoute | undefined {
    const routePath = routeName.split('.')

    let currentRoutes = routes

    for (let index = 0; index < routePath.length; index += 1) {
      const name = routePath[index]
      const buffer = currentRoutes.find(routeConfig => routeConfig.name === name)

      if (buffer) {
        if (index === routePath.length - 1) {
          return buffer
        }

        if (buffer.children) {
          currentRoutes = buffer.children
        } else {
          return undefined
        }
      } else {
        return undefined
      }
    }
  }

  public getRouteComponent(routeName: string): ICustomRoute['component'] | null {
    const route = this.getRouteByName(routeName)

    return route?.component
  }

  public getPathWithoutBaseURL(): string {
    const { baseUrl } = this
    const { pathname } = window.location

    if (baseUrl === '/') {
      return pathname
    }

    return pathname.replace(baseUrl, '')
  }
}
