import { StateContextProvider } from './context/index';
import { routes } from './component/footer';
import { RouterProvider } from 'react-router-dom';
import Header from './component/header';
import { Toaster } from "react-hot-toast";
import './App.css'
function App() {
  return (
  <>
  <StateContextProvider>
  <Toaster position="top-center" reverseOrder={false} />
  <Header/>
  <RouterProvider router={routes}></RouterProvider>
  </StateContextProvider></>
  )
}

export default App
