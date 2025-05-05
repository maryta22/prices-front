import React, { useEffect, useState } from 'react'
import { createStore, updateStore, fetchStoreById } from '../services/api'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './StoreForm.module.css'

export function StoreForm() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isEdit, setIsEdit] = useState(false)

  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      setIsEdit(true)
      fetchStoreById(Number(id))
        .then(store => {
          setName(store.name)
          setDescription(store.description)
        })
        .catch(() => setError('Error al cargar la tienda'))
    }
  }, [id])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      if (isEdit) {
        await updateStore(Number(id), { name, description })
      } else {
        await createStore({ name, description })
      }
      navigate('/stores-products')
    } catch {
      setError('Error al guardar la tienda')
    }
  }

  return (
    <div className={styles.card}>
      <h1>{isEdit ? 'Editar tienda' : 'Nueva tienda'}</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={onSubmit} className={styles.form}>
        <label>Nombre*</label>
        <input value={name} onChange={e => setName(e.target.value)} required />

        <label>Descripción</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} />

        <div className={styles.actions}>
          <button type="button" className={styles.cancelButton} onClick={() => navigate('/stores-products')}>
            Cancelar
          </button>
          <button type="submit">{isEdit ? 'Actualizar' : 'Crear'}</button>
        </div>
      </form>
    </div>
  )
}
