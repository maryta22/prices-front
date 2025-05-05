import React, { useEffect, useState } from 'react'
import { fetchStoresWithProducts, deleteStore } from '../services/api'
import styles from './StoreProductsPage.module.css'
import { useNavigate } from 'react-router-dom'

type StoreProduct = {
  store_id: number
  store_name: string
  products: {
    id: number
    name: string
    price: number
    start_datetime: string
    end_datetime: string
  }[]
}

export function StoreProductsPage() {
  const [data, setData] = useState<StoreProduct[]>([])
  const [selectedStore, setSelectedStore] = useState<StoreProduct | null>(null)
  const [searchStore, setSearchStore] = useState('')
  const [searchProduct, setSearchProduct] = useState('')
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  const loadStores = () => {
    fetchStoresWithProducts()
      .then(fetched => {
        setData(fetched)
        setSelectedStore(fetched[0] || null)
      })
      .catch(e => setError(e.message))
  }

  useEffect(() => {
    loadStores()
  }, [])

  const filteredStores = data.filter(store =>
    store.store_name.toLowerCase().includes(searchStore.toLowerCase())
  )

  const filteredProducts = selectedStore?.products.filter(p =>
    p.name.toLowerCase().includes(searchProduct.toLowerCase())
  ) || []

  const handleEditStore = () => {
    if (selectedStore) {
      navigate(`/stores/${selectedStore.store_id}/edit`)
    }
  }

  const handleDeleteStore = async () => {
    if (!selectedStore) return
    const confirmDelete = confirm(`¿Deseas eliminar la tienda "${selectedStore.store_name}"?`)
    if (!confirmDelete) return

    try {
      await deleteStore(selectedStore.store_id)
      setSelectedStore(null)
      loadStores()
    } catch (err) {
      alert('Error al eliminar la tienda.')
    }
  }

  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <button
          onClick={() => navigate('/stores/new')}
          className={styles.createButton}
        >
          + Nueva tienda
        </button>

        <input
          type="text"
          placeholder="Buscar tienda..."
          value={searchStore}
          onChange={e => setSearchStore(e.target.value)}
          className={styles.searchInput}
        />

        <ul className={styles.storeList}>
          {filteredStores.map(store => (
            <li
              key={store.store_id}
              onClick={() => setSelectedStore(store)}
              className={`${styles.storeItem} ${selectedStore?.store_id === store.store_id ? styles.active : ''}`}
            >
              {store.store_name}
            </li>
          ))}
          {filteredStores.length === 0 && <li className={styles.empty}>No hay resultados</li>}
        </ul>
      </div>

      <div className={styles.content}>
        {selectedStore ? (
          <>
            <div className={styles.header}>
              <h1>{selectedStore.store_name}</h1>
              <div className={styles.storeActions}>
                <button onClick={handleEditStore} className={styles.editButton}>Editar</button>
                <button onClick={handleDeleteStore} className={styles.deleteButton}>Eliminar</button>
              </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.filters}>
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchProduct}
                onChange={e => setSearchProduct(e.target.value)}
              />
            </div>

            <div className={styles.card}>
              <ul>
                {filteredProducts.map((p, index) => (
                  <li key={`${p.id}-${p.start_datetime}-${index}`}>
                    <strong>{p.name}</strong><br />
                    Precio: ${p.price}<br />
                    Desde: {new Date(p.start_datetime).toLocaleString()}<br />
                    Hasta: {new Date(p.end_datetime).toLocaleString()}
                  </li>
                ))}
                {filteredProducts.length === 0 && (
                  <li>No hay productos que coincidan con los filtros.</li>
                )}
              </ul>
            </div>
          </>
        ) : (
          <p>Seleccione una tienda para ver sus productos.</p>
        )}
      </div>
    </div>
  )
}
