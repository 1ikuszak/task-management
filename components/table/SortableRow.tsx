'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TableRow } from '@/components/ui/table'

const SortableRow = ({ id, children, row }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      key={row.id}
      className={`${row.original.blocked ? 'opacity-80' : ''}`}
    >
      {children}
    </TableRow>
  )
}

export default SortableRow
