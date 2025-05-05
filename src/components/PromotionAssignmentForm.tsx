import React, { useEffect, useState } from 'react'
import { fetchProducts, fetchStores, fetchPromotions, assignPromotion } from '../services/api'
import { useNavigate } from 'react-router-dom'
import styles from './PromotionAssignmentForm.module.css'

type Product = {
  id: number
  name: string
}

type Store = {
  id: number
  name: string
}

type Promotion = {
  id: number
  name: string
  discount_percent: number
}

export function PromotionAssignmentForm() {
  const [promotionId, setPromotionId] = useState('')
  const [productId, setProductId] = useState('')
  const [storeId, setStoreId] = useState('')
  const [mode, setMode] = useState<'product' | 'store' | 'specific'>('product')
  const [products, setProducts] = useState<Product[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts().then(setProducts)
    fetchStores().then(setStores)
    fetchPromotions().then(setPromotions)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
        if (mode === 'product') {
            await assignPromotion(Number(promotionId), {
              product_ids: [Number(productId)],
              store_ids: stores.map(store => store.id),
            })
          } else if (mode === 'store') {
            await assignPromotion(Number(promotionId), {
              product_ids: products.map(product => product.id),
              store_ids: [Number(storeId)],
            })
          } else {
            await assignPromotion(Number(promotionId), {
              product_ids: [Number(productId)],
              store_ids: [Number(storeId)],
            })
          }

      navigate('/promotions')
    } catch {
      setError('Error al asignar la promoción')
    }
  }

  return (
    <div className={styles.card}>
      <h1>Asignar promoción</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Promoción*</label>
        <select value={promotionId} onChange={e => setPromotionId(e.target.value)} required>
          <option value="">--Selecciona una promoción--</option>
          {promotions.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.discount_percent}%)
            </option>
          ))}
        </select>

        <label>Modo de asignación*</label>
        <select value={mode} onChange={e => setMode(e.target.value as any)} required>
          <option value="product">Producto</option>
          <option value="store">Tienda</option>
          <option value="specific">Producto en una tienda</option>
        </select>

        {(mode === 'product' || mode === 'specific') && (
          <>
            <label>Producto*</label>
            <select value={productId} onChange={e => setProductId(e.target.value)} required>
              <option value="">--Selecciona un producto--</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </>
        )}

        {(mode === 'store' || mode === 'specific') && (
          <>
            <label>Tienda*</label>
            <select value={storeId} onChange={e => setStoreId(e.target.value)} required>
              <option value="">--Selecciona una tienda--</option>
              {stores.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </>
        )}

        <div className={styles.actions}>
          <button type="submit">Asignar</button>
          <button type="button" className={styles.cancelButton} onClick={() => navigate('/promotions')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
