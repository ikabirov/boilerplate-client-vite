import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { RouterService } from './services/router'
import { RouterProvider } from 'react-router5'

const routerService = new RouterService('/')

routerService.getInstance().start(() => {
  ReactDOM.render(
    <React.StrictMode>
      <RouterProvider router={routerService.getInstance()}>
        <App routerService={routerService} />
      </RouterProvider>
    </React.StrictMode>,
    document.getElementById('root')
  )
})
