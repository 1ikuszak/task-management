'use client'

import StatusDropdown from './components/StatusDropdown'
import MemberAvatar from './components/MemberAvatar'

const statusCellRenderer = (params: any) => {
  const currentStatusValue = params.data.status
  const rowId = params.data.id
  return (
    <StatusDropdown currentStatusValue={currentStatusValue} rowId={rowId} />
  )
}

const memberAvatarCellRenderer = (params: any) => {
  const member = params.data.project_member
  return <MemberAvatar project_member={member} />
}

export const columns = [
  {
    headerName: 'Title',
    field: 'title',
    sortable: true,
    filter: true,
    rowDrag: true,
  },
  {
    headerName: 'Member',
    field: 'project_member',
    sortable: true,
    filter: true,
    cellRenderer: memberAvatarCellRenderer,
  },
  {
    headerName: 'Notes',
    field: 'notes',
    sortable: true,
    filter: true,
  },
  {
    headerName: 'Deadline',
    field: 'deadline',
    sortable: true,
    filter: true,
  },
  {
    headerName: 'Priority',
    field: 'priority',
    sortable: true,
    filter: true,
  },
  {
    headerName: 'Status',
    field: 'status',
    sortable: true,
    filter: true,
    cellRenderer: statusCellRenderer,
  },
]
