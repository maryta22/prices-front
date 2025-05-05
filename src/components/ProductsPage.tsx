// src/components/ProductsPage.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchProducts, deleteProduct } from '../services/api'
import type { Product } from '../types'
import styles from './ProductsPage.module.css'

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError]       = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setError('No se pudo cargar los productos'))
  }, [])

  const onDelete = async (id: number) => {
    if (!confirm('¿Eliminar este producto?')) return
    try {
      await deleteProduct(id)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch {
      setError('Error al eliminar')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h1>Productos</h1>
        </div>
        <button className={styles.createButton} onClick={() => navigate('/products/new')}>
          + Nuevo producto
        </button>
      </div>
      <ul className={styles.list}>
        {products.map(p => (
          <li key={p.id} className={styles.item}>
            <div className={styles.imagePlaceholder}></div>
            <div className={styles.name}>{p.name}</div>
            <div className={styles.actions}>
              <button onClick={() => navigate(`/products/${p.id}/edit`)}>Editar ✏️</button>
              <button onClick={() => onDelete(p.id)}>Eliminar 🗑️</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
