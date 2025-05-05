import React, { useEffect, useState } from 'react'
import {
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

import { fetchProducts, fetchStores, getFinalPrice } from '../services/api'
import type { Product, Store, FinalPriceResult } from '../types'
import styles from './FinalPriceForm.module.css'

export function FinalPriceForm() {
  const [products, setProducts] = useState<Product[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [pid, setPid] = useState('')
  const [sid, setSid] = useState('')
  const [dt, setDt] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<FinalPriceResult | null>(null)

  useEffect(() => {
    fetchProducts().then(setProducts).catch(e => setError(e.message))
    fetchStores().then(setStores).catch(e => setError(e.message))
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const r = await getFinalPrice(+pid, +sid, dt)
      console.log('Respuesta del API:', r)
      setResult(r)
    } catch (e: any) {
      console.error('Error consultando precio final:', e)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className={styles.container}>
        <Box className={styles.header}>
          <Typography variant="h4" className={styles.title}>
            Consultar Precio Final
          </Typography>
        </Box>

        <Box className={styles.content}>
          <Box className={styles.left}>
            <Box component="form" onSubmit={onSubmit} className={styles.form}>
              <TextField
                select
                label="Producto"
                value={pid}
                onChange={e => setPid(e.target.value)}
                required
                fullWidth
              >
                {products.map(p => (
                  <MenuItem key={p.id} value={String(p.id)}>
                    {p.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Tienda"
                value={sid}
                onChange={e => setSid(e.target.value)}
                required
                fullWidth
              >
                {stores.map(s => (
                  <MenuItem key={s.id} value={String(s.id)}>
                    {s.name}
                  </MenuItem>
                ))}
              </TextField>

              <DateTimePicker
                label="Fecha y hora"
                value={dt ? dayjs(dt) : null}
                onChange={(newValue) =>
                  setDt(newValue ? newValue.toISOString() : '')
                }
                ampm={false}
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                  },
                }}
              />

              <Box className={styles.buttonWrapper}>
                <Button
                  type="submit"
                  variant="contained"
                  disableElevation
                  color="inherit"
                  className={styles.button}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                  sx={{
                    backgroundColor: '#c62828',
                    '&:hover': { backgroundColor: '#b71c1c' },
                    color: 'white',
                    fontWeight: 'bold',
                    minWidth: '160px',
                  }}
                >
                  {loading ? 'Consultando…' : 'Consultar'}
                </Button>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </Box>
          </Box>

          <Box className={styles.right}>
            <Card variant="outlined" className={styles.resultCard}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Resultado
                </Typography>
                {result ? (
                  <>
                    <Typography>Producto: {result.product}</Typography>
                    <Typography>Tienda: {result.store}</Typography>
                    <Typography>Precio base: ${result.base_price.toFixed(2)}</Typography>
                    <Typography>Descuento: {result.applied_discount.toFixed(0)}%</Typography>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      Precio final: ${result.final_price.toFixed(2)}
                    </Typography>
                  </>
                ) : (
                  <Typography color="textSecondary">
                    Selecciona los campos y pulsa "Consultar" para ver el resultado.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  )
}
