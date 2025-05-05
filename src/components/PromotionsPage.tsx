import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchPromotions, deletePromotion } from '../services/api'
import styles from './PromotionsPage.module.css'

type Promotion = {
  id: number
  name: string
  discount_percent: number
  start_datetime: string
  end_datetime: string
}

export function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPromotions()
      .then(setPromotions)
      .catch(() => setError('Error al cargar promociones'))
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta promoción?')) return
    try {
      await deletePromotion(id)
      setPromotions(prev => prev.filter(p => p.id !== id))
    } catch {
      setError('Error al eliminar la promoción')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Promociones</h1>
        <div className={styles.buttons}>
          <button className={styles.createButton} onClick={() => navigate('/promotions/new')}>
            + Nueva promoción
          </button>
          <button className={styles.assignButton} onClick={() => navigate('/promotions/assign')}>
            🎯 Asignar promoción
          </button>
        </div>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.grid}>
        {promotions.map(promo => (
          <div key={promo.id} className={styles.item}>
            <div className={styles.name}>{promo.name}</div>
            <div className={styles.details}>
              <span><strong>Descuento:</strong> {promo.discount_percent}%</span>
              <span><strong>Inicio:</strong> {new Date(promo.start_datetime).toLocaleString()}</span>
              <span><strong>Fin:</strong> {new Date(promo.end_datetime).toLocaleString()}</span>
            </div>
            <div className={styles.actions}>
              <button onClick={() => navigate(`/promotions/${promo.id}`)}>👁 Ver detalles</button>
              <button onClick={() => navigate(`/promotions/${promo.id}/edit`)}>✏️ Editar</button>
              <button onClick={() => handleDelete(promo.id)}>🗑️ Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
