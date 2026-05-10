import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import { Home } from './components/Home'
import SortingVisualizerPage from './components/sortingAlgo/VisualizerPage'
import { VisualizerPage } from './components/searchAlgo/VisualizerPage'
import { ShortestPathPage } from './components/shortestPathAlgo/ShortestPathPage'
import { DSLayout } from './components/dataStructures/DSLayout'
import ArrayVisualizerPage from './components/arraySearch/VisualizerPage'
import AboutAlgoScope from './components/about/About'
import NotFound from './components/PageNotFound'

function App() {
  const route = createBrowserRouter([
    {
      path: '/',
      element: (
        <AppLayout showBackground={false}>
          <Home />
        </AppLayout>
      ),
    },
    {
      path: '/search',
      element: (
        <AppLayout>
          <VisualizerPage />
        </AppLayout>
      ),
    },
    {
      path: '/spath',
      element: (
        <AppLayout>
          <ShortestPathPage />
        </AppLayout>
      ),
    },
    {
      path: '/about',
      element: (
        <AppLayout>
          <AboutAlgoScope />
        </AppLayout>
      ),
    },
    {
      path: '/sort',
      element: (
        <AppLayout>
          <SortingVisualizerPage />
        </AppLayout>
      ),
    },
    {
      path: '/ldssearch',
      element: (
        <AppLayout>
          <ArrayVisualizerPage />
        </AppLayout>
      ),
    },
    {
      path: '/adt',
      element: (
        <AppLayout>
          <DSLayout />
        </AppLayout>
      ),
    },
    {
      path: '*',
      element: (
        <AppLayout>
          <NotFound />
        </AppLayout>
      ),
    },
  ])

  return <RouterProvider router={route} />
}

export default App
