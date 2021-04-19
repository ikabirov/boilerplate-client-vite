import React, { FC } from 'react'
import styles from './styles.module.scss'
import { Link, useRoute } from 'react-router5'
import { NotFoundPage } from './pages/page404/page404'
import { RouterService } from './services/router'

const App: FC<{ routerService: RouterService }> = ({ routerService }) => {
  const { route } = useRoute()
  const RouterComponent = routerService.getRouteComponent(route.name) || NotFoundPage

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <Link routeName={'index'}>Index</Link>
        <Link routeName={'example'} routeParams={{ id: 123 }}>
          Example
        </Link>

        <RouterComponent routeParams={route.params} />
      </header>
    </div>
  )
}

export default App
