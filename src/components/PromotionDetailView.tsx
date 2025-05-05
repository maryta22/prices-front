import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchPromotionById } from '../services/api'
import styles from './PromotionDetailView.module.css'

type Product = { id: number; name: string }
type Store = { id: number; name: string }
type Assignment = { product: Product; store: Store }

type Promotion = {
  id: number
  name: string
  discount_percent: number
  start_datetime: string
  end_datetime: string
  assignments: Assignment[]
}

const ITEMS_PER_PAGE = 5

export function PromotionDetailView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [promotion, setPromotion] = useState<Promotion | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [productFilter, setProductFilter] = useState('')
  const [storeFilter, setStoreFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (id) {
      fetchPromotionById(parseInt(id))
        .then(setPromotion)
        .catch(() => setError('No se pudo cargar la promoción'))
    }
  }, [id])

  const filteredAssignments = promotion?.assignments.filter(a =>
    a.product.name.toLowerCase().includes(productFilter.toLowerCase()) &&
    a.store.name.toLowerCase().includes(storeFilter.toLowerCase())
  ) || []

  const totalPages = Math.ceil(filteredAssignments.length / ITEMS_PER_PAGE)
  const paginatedAssignments = filteredAssignments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  if (error) return <p className={styles.error}>{error}</p>
  if (!promotion) return <p>Cargando promoción...</p>

  return (
    <div className={styles.card}>
      <h1>{promotion.name}</h1>
      <p><strong>Descuento:</strong> {promotion.discount_percent}%</p>
      <p><strong>Inicio:</strong> {new Date(promotion.start_datetime).toLocaleString()}</p>
      <p><strong>Fin:</strong> {new Date(promotion.end_datetime).toLocaleString()}</p>

      <h2>📋 Asignaciones de productos y tiendas:</h2>

      <div className={styles.filtersRow}>
        <input
          type="text"
          placeholder="🔍 Filtrar por producto"
          value={productFilter}
          onChange={(e) => { setProductFilter(e.target.value); setCurrentPage(1) }}
        />
        <input
          type="text"
          placeholder="🔍 Filtrar por tienda"
          value={storeFilter}
          onChange={(e) => { setStoreFilter(e.target.value); setCurrentPage(1) }}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>🛒 Producto</th>
            <th>🏬 Tienda</th>
          </tr>
        </thead>
        <tbody>
          {paginatedAssignments.map((a, i) => (
            <tr key={i}>
              <td>{a.product.name}</td>
              <td>{a.store.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          ← Anterior
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={i + 1 === currentPage ? styles.activePage : ''}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Siguiente →
        </button>
      </div>

      <button onClick={() => navigate('/promotions')}>⬅ Volver</button>
    </div>
  )
}
