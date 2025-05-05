import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchProducts, createProduct, updateProduct } from '../services/api'
import styles from './ProductForm.module.css'

export function ProductForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isEdit && id) {
      fetchProducts()
        .then(list => {
          const p = list.find(x => x.id === +id)
          if (p) {
            setName(p.name)
            setDescription(p.description ?? '')
          }
        })
        .catch(() => setError('Error cargando'))
    }
  }, [id, isEdit])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      if (isEdit && id) {
        await updateProduct(+id, { name, description })
      } else {
        await createProduct({ name, description })
      }
      navigate('/products')
    } catch {
      setError('Error guardando')
    }
  }

  const onCancel = () => {
    navigate('/products')
  }

  return (
    <div className={styles.card}>
      <h1>{isEdit ? 'Editar' : 'Nuevo'} producto</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={onSubmit} className={styles.form}>
        <label>Nombre*</label>
        <input value={name} onChange={e => setName(e.target.value)} required />

        <label>Descripción</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} />

        <div className={styles.actions}>
          <button type="button" onClick={onCancel} className={styles.cancelButton}>
            Cancelar
          </button>
          <button type="submit">{isEdit ? 'Actualizar' : 'Crear'}</button>
        </div>
      </form>
    </div>
  )
}
