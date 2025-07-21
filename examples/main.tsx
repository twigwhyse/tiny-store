import React from 'react'
import { createRoot } from 'react-dom/client'
import { ExamplesApp } from './app'

const container = document.getElementById('root')
if (!container) throw new Error('Root element not found')

const root = createRoot(container)
root.render(<ExamplesApp />) 