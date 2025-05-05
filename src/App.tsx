import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout }         from './components/Layout'
import { FinalPriceForm } from './components/FinalPriceForm'
import { ProductsPage }   from './components/ProductsPage'
import { ProductForm }    from './components/ProductForm'
import { PriceForm }      from './components/PriceForm'
import { StoreProductsPage } from './components/StoreProductsPage'
import { StoreForm } from './components/StoreForm'
import { PromotionForm } from './components/PromotionForm'
import { PromotionsPage } from './components/PromotionsPage'
import { PromotionAssignmentForm } from './components/PromotionAssignmentForm'
import { PromotionDetailView } from './components/PromotionDetailView'




export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/final-price" replace />} />
        <Route path="/final-price" element={<FinalPriceForm />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/new" element={<ProductForm />} />
        <Route path="/products/:id/edit" element={<ProductForm />} />
        <Route path="/prices/new" element={<PriceForm />} />
        <Route path="/stores-products" element={<StoreProductsPage />} />
        <Route path="/stores/new" element={<StoreForm />} />
        <Route path="/stores/:id/edit" element={<StoreForm />}/>
        <Route path="/promotions/new" element={<PromotionForm />} />
        <Route path="/promotions" element={<PromotionsPage />} />
        <Route path="/promotions/new" element={<PromotionForm />} />
        <Route path="/promotions/:id/edit" element={<PromotionForm />} />
        <Route path="/promotions/assign" element={<PromotionAssignmentForm />} />
        <Route path="/promotions/:id" element={<PromotionDetailView />} />

      </Routes>
    </Layout>
  )
}

export default App
