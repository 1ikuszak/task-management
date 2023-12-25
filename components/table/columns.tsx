'use client'
import * as React from 'react'

import { ColumnDef } from '@tanstack/react-table'

import { Badge, BadgeProps } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

import { priorities, project_members, statuses } from '@/app/data/data'
import { Task } from '@/app/data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { formatDate } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { updateStatus } from '@/app/tasks/actions'
import { toast } from 'sonner'

export const columns: ColumnDef<Task>[] = [
  {
    id: 'select',

    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: 'id',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Task" />
  //   ),
  //   cell: ({ row }) => <div className="w-[80px]">{row.getValue('id')}</div>,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('title')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'notes',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Notes" />
    ),
    cell: ({ row }) => {
      return (
        <span className="max-w-[100px] truncate font-medium text-xs">
          {row.getValue('notes')}
        </span>
      )
    },
  },
  {
    accessorKey: 'deadline',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    cell: ({ row }) => {
      const endDate = row.getValue('deadline')
      return (
        <div className="flex space-x-2">
          <span className="max-w-[100px] truncate font-medium text-xs">
            {typeof endDate === 'string' ? formatDate(endDate) : ''}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const [status, setStatus] = React.useState(
        statuses.find((status) => status.value === row.getValue('status'))
      )

      if (!status) {
        return null
      }

      const handleStatusChange = async (id: string, newStatus: string) => {
        setStatus(statuses.find((status) => status.value === newStatus))
        const result = await updateStatus(id, newStatus) // Update database
        const { error } = JSON.parse(result)
        const currentDateTime = new Date().toLocaleString()

        if (error?.message) {
          toast.error(error.message, {
            description: `${currentDateTime}`,
            action: {
              label: 'close',
              onClick: () => toast.dismiss(),
            },
          })
        } else {
          toast.info('task status updated', {
            description: `${currentDateTime}`,
          })
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:ring-none ring-none">
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
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuRadioGroup
              value={status.value}
              onValueChange={(newStatus) => {
                if (row.original.id && newStatus) {
                  handleStatusChange(row.original.id, newStatus)
                } else {
                  toast.error('error occured')
                }
              }}
            >
              {statuses.map((status) => (
                <DropdownMenuRadioItem key={status.value} value={status.value}>
                  <Badge variant={status.variant as BadgeProps['variant']}>
                    {status.icon && (
                      <status.icon className="w-3.5 h-3.5 mr-2" />
                    )}
                    <span>{status.label}</span>
                  </Badge>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue('priority')
      )

      if (!priority) {
        return null
      }

      return (
        <div className="flex items-center">
          {priority.icon && (
            <priority.icon className="w-4 h-4 mr-2 text-muted-foreground" />
          )}
          <span>{priority.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'project_member',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Member" />
    ),
    cell: ({ row }) => {
      const member = project_members.find(
        (member) => member.value === row.getValue('project_member')
      )

      if (!member) {
        return null
      }

      return (
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={member.avatar} alt="@shadcn" />
                  <AvatarFallback>DM</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{member.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
