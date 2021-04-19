import { Route, constants } from 'router5'
import { ExamplePage } from '../pages/example/example'
import { IndexPage } from '../pages/index'
import { NotFoundPage } from '../pages/page404/page404'

export type TRouteProps = {
  routeParams: Record<string, string>
}

export interface ICustomRoute extends Route {
  component?: React.ComponentType<TRouteProps>
  /** Needed authorization or not */
  withAuth?: boolean
  title?: string
  children?: TCustomSubPageRoute[]
}

type TCustomSubPageRoute = Omit<ICustomRoute, 'component'> & {
  component?: ICustomRoute['component']
}

export type TCustomAnyRoute = ICustomRoute | TCustomSubPageRoute
export type TCustomModuleRoute = Omit<ICustomRoute, 'name'> & {
  children?: ICustomRoute[]
}
export interface ICustomUnknownRoute extends Omit<ICustomRoute, 'path'> {}

export const routes: ICustomRoute[] = [
  {
    name: 'index',
    path: '/',
    component: IndexPage,
    withAuth: true,
  },
  {
    name: 'example',
    path: '/example/:id',
    component: ExamplePage,
  },
]
