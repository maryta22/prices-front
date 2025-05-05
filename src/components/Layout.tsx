import React from 'react'
import { Link } from 'react-router-dom'
import './Layout.css'

export function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <nav className="nav">
        <Link to="/products">Productos</Link>
        <Link to="/stores-products">Tiendas</Link>
        <Link to="/prices/new">Precios</Link>
        <Link to="/final-price">Precio final</Link>
        <Link to="/promotions">Promociones</Link>

      </nav>
      <main>{children}</main>
    </>
  )
}
