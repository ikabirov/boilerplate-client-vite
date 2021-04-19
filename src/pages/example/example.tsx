import React, { FC } from 'react'
import { TRouteProps } from '../../routes/routes'

const ExamplePage: FC<TRouteProps> = ({ routeParams: { id } }) => <div>Example {id}</div>

export { ExamplePage }
