'use client'

import { AgGridReact } from 'ag-grid-react' // React Grid Logic
import 'ag-grid-community/styles/ag-grid.css' // Core CSS
import { Task } from '@/app/data/schema'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import '@/styles/ag-grid-styles.css'
interface DataTableProps {
  columnDefs: any[]
  rowData: Task[]
}

export function DataTable<TData>({ columnDefs, rowData }: DataTableProps) {
  return (
    <div className="ag-theme-quartz" style={{ height: 800, width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        rowSelection="multiple"
        animateRows={true}
        rowDragManaged={true}
      />
    </div>
  )
}
