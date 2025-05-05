import React, { useState, useEffect } from 'react'
import { fetchProducts, fetchStores, createPrice } from '../services/api'
import type { Product, Store } from '../types'
import styles from './PriceForm.module.css'

export function PriceForm() {
  const [products, setProducts] = useState<Product[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [pid, setPid] = useState<number>(0)
  const [sids, setSids] = useState<number[]>([])
  const [value, setValue] = useState<number>(0)
  const [start, setStart] = useState<string>('')
  const [end, setEnd] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string>('')
  const [failedStores, setFailedStores] = useState<string[]>([])

  const [searchTerm, setSearchTerm] = useState('')
  const [storeSearchTerm, setStoreSearchTerm] = useState('')

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => {})
    fetchStores().then(setStores).catch(() => {})
  }, [])

  const toggleStore = (id: number) => {
    setSids(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const removeStore = (id: number) => {
    setSids(prev => prev.filter(x => x !== id))
  }

  const selectAllStores = () => {
    const allVisible = stores
      .filter(s => s.name.toLowerCase().includes(storeSearchTerm.toLowerCase()))
      .map(s => s.id)
    setSids(allVisible)
  }

  const deselectAllStores = () => {
    const visible = stores
      .filter(s => s.name.toLowerCase().includes(storeSearchTerm.toLowerCase()))
      .map(s => s.id)
    setSids(prev => prev.filter(id => !visible.includes(id)))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess('')
    setFailedStores([])

    if (pid === 0) {
      setError('Debes seleccionar un producto')
      return
    }

    const failed: string[] = []

    // ✅ Convertir fechas locales a UTC antes de enviar
    const startUtc = new Date(start).toISOString()
    const endUtc = new Date(end).toISOString()

    await Promise.all(
      sids.map(storeId => {
        const store = stores.find(s => s.id === storeId)
        return createPrice({
          value,
          start_datetime: startUtc,
          end_datetime: endUtc,
          product: pid,
          store: storeId,
        }).catch(() => {
          failed.push(store?.name || `Tienda ${storeId}`)
        })
      })
    )

    if (failed.length === 0) {
      setSuccess('¡Precio creado con éxito!')
    } else if (failed.length < sids.length) {
      setSuccess('Precio creado parcialmente.')
      setFailedStores(failed)
    } else {
      setError('Error al crear precios para todas las tiendas.')
      setFailedStores(failed)
    }

    setPid(0)
    setSids([])
    setValue(0)
    setStart('')
    setEnd('')
    setSearchTerm('')
    setStoreSearchTerm('')
  }

  const onCancel = () => {
    setPid(0)
    setSids([])
    setValue(0)
    setStart('')
    setEnd('')
    setError(null)
    setSuccess('')
    setSearchTerm('')
    setStoreSearchTerm('')
    setFailedStores([])
  }

  const title = sids.length > 1 ? 'Crear precios' : 'Crear precio'

  return (
    <div className={styles.card}>
      <h1>{title}</h1>

      {success && <div className={styles.successBanner}>{success}</div>}
      {error && <div className={styles.errorBanner}>{error}</div>}

      {failedStores.length > 0 && (
        <div className={styles.errorBanner}>
          Error en las siguientes tiendas:
          <ul>
            {failedStores.map((name, idx) => (
              <li key={idx}>{name}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.columns}>
          {/* Productos */}
          <div className={styles.section}>
            <h2>Producto</h2>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <div className={styles.productList}>
              {products
                .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(p => (
                  <div
                    key={p.id}
                    className={`${styles.productItem} ${pid === p.id ? styles.selected : ''}`}
                    onClick={() => setPid(p.id)}
                  >
                    {p.name}
                  </div>
                ))}
              {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                <p className={styles.empty}>No hay resultados</p>
              )}
            </div>
            {pid === 0 && <p className={styles.error}>Debes seleccionar un producto</p>}
          </div>

          {/* Tiendas */}
          <div className={styles.section}>
            <h2>Tiendas</h2>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={storeSearchTerm}
              onChange={e => setStoreSearchTerm(e.target.value)}
            />
            <div className={styles.storeList}>
              {stores
                .filter(s => s.name.toLowerCase().includes(storeSearchTerm.toLowerCase()))
                .map(s => (
                  <div
                    key={s.id}
                    className={`${styles.storeItem} ${sids.includes(s.id) ? styles.selected : ''}`}
                    onClick={() => toggleStore(s.id)}
                  >
                    {s.name}
                  </div>
                ))}
              {stores.filter(s => s.name.toLowerCase().includes(storeSearchTerm.toLowerCase())).length === 0 && (
                <p className={styles.empty}>No hay tiendas</p>
              )}
            </div>
            <div className={styles.selectAllButtons}>
              <button type="button" onClick={selectAllStores}>Seleccionar todas</button>
              <button type="button" onClick={deselectAllStores}>Quitar selección</button>
            </div>
          </div>

          {/* Fechas y precio */}
          <div className={styles.section}>
            <h2>Fechas y precio</h2>

            <label>Precio*</label>
            <input
              type="number"
              step="0.01"
              value={value}
              onChange={e => setValue(+e.target.value)}
              required
            />

            <label>Inicio*</label>
            <input
              type="datetime-local"
              value={start}
              onChange={e => setStart(e.target.value)}
              required
            />

            <label>Fin*</label>
            <input
              type="datetime-local"
              value={end}
              onChange={e => setEnd(e.target.value)}
              required
            />

            <div className={styles.actions}>
              <button type="submit" className={styles.saveButton}>Guardar</button>
              <button type="button" className={styles.cancelButton} onClick={onCancel}>Cancelar</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
