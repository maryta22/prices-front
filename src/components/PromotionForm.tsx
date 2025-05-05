import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createPromotion,
  updatePromotion,
  fetchPromotionById,
} from '../services/api'
import styles from './PromotionForm.module.css'

export function PromotionForm() {
  const [name, setName] = useState('')
  const [discountPercent, setDiscountPercent] = useState('')
  const [startDatetime, setStartDatetime] = useState('')
  const [endDatetime, setEndDatetime] = useState('')
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  useEffect(() => {
    if (isEdit) {
      fetchPromotionById(Number(id))
        .then(promo => {
          setName(promo.name)
          setDiscountPercent(promo.discount_percent.toString())
          setStartDatetime(new Date(promo.start_datetime).toISOString().slice(0, 16))
          setEndDatetime(new Date(promo.end_datetime).toISOString().slice(0, 16))
        })
        .catch(() => setError('Error al cargar la promoción'))
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const data = {
      name,
      discount_percent: parseFloat(discountPercent),
      start_datetime: new Date(startDatetime).toISOString(),
      end_datetime: new Date(endDatetime).toISOString(),
    }

    try {
      if (isEdit) {
        await updatePromotion(Number(id), data)
      } else {
        await createPromotion(data)
      }
      navigate('/promotions')
    } catch {
      setError('Error al guardar la promoción')
    }
  }

  return (
    <div className={styles.card}>
      <h1>{isEdit ? 'Editar promoción' : 'Crear promoción'}</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Nombre*</label>
        <input value={name} onChange={e => setName(e.target.value)} required />

        <label>Porcentaje de descuento*</label>
        <input
          type="number"
          step="0.01"
          value={discountPercent}
          onChange={e => setDiscountPercent(e.target.value)}
          required
        />

        <label>Inicio*</label>
        <input
          type="datetime-local"
          value={startDatetime}
          onChange={e => setStartDatetime(e.target.value)}
          required
        />

        <label>Fin*</label>
        <input
          type="datetime-local"
          value={endDatetime}
          onChange={e => setEndDatetime(e.target.value)}
          required
        />

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate('/promotions')}
          >
            Cancelar
          </button>
          <button type="submit">{isEdit ? 'Actualizar' : 'Crear'}</button>
        </div>
      </form>
    </div>
  )
}
