'use client'

import StatusDropdown from './components/StatusDropdown'
import { Badge, BadgeProps } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ICellRendererParams } from 'ag-grid-community'
import { project_members, statuses } from '@/app/data/data'

const memberAvatarCellRenderer = (params: ICellRendererParams) => {
  const member = project_members.find((member) => member.value === params.value)

  if (!member) {
    return null
  }

  return (
    <div className="flex items-center w-full h-full gap-2">
      <Avatar className="w-6 h-6">
        <AvatarImage src={member.avatar} alt="@shadcn" />
        <AvatarFallback>DM</AvatarFallback>
      </Avatar>
      <span>{member.label}</span>
    </div>
  )
}

const statusCellRenderer = (params: ICellRendererParams) => {
  const status = statuses.find((status) => status.value === params.value)

  if (!status) {
    return null
  }

  return (
    <div className="flex items-center w-full h-full">
      <Badge variant={status.variant as BadgeProps['variant']}>
        {status.icon && (
          <status.icon
            className={`w-3.5 h-3.5 mr-2 ${
              status.value === 'in_progress' ? 'animate-spin' : ''
            }`}
          />
        )}
        <span>{status.label}</span>
      </Badge>
    </div>
  )
}

export const columns = [
  {
    headerName: 'Title',
    field: 'title',
    sortable: true,
    rowDrag: true,
  },
  {
    headerName: 'Member',
    field: 'project_member',
    sortable: true,
    cellRenderer: memberAvatarCellRenderer,
  },
  {
    headerName: 'Notes',
    field: 'notes',
    sortable: true,
  },
  {
    headerName: 'Deadline',
    field: 'deadline',
    sortable: true,
  },
  {
    headerName: 'Priority',
    field: 'priority',
    sortable: true,
  },
  {
    headerName: 'Status',
    field: 'status',
    sortable: true,
    cellRenderer: statusCellRenderer,
  },
]
