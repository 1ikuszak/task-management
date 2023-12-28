'use client'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AgGridReact } from 'ag-grid-react'
import {
  ColDef,
  ICellRendererParams,
  ValueFormatterParams,
} from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css' // Core CSS
import 'ag-grid-community/styles/ag-theme-quartz.css' // Theme

import '@/styles/ag-grid-styles.css'
import { Task } from '@/app/data/schema'

interface DataTableProps {
  columnDefs: any[]
  rowData: Task[]
}

export function DataTable<TData>({ columnDefs, rowData }: DataTableProps) {
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      filter: true,
      editable: true,
    }
  }, [])

  return (
    <div className="ag-theme-quartz" style={{ height: 800, width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowSelection="multiple"
        animateRows={false}
        rowDragManaged={true}
      />
    </div>
  )
}
