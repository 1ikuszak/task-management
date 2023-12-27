'use client'

import React, { useState, FC } from 'react'
import { toast } from 'sonner' // Assuming this is the correct import for your toast library
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu' // Update with your actual imports
import { Badge, BadgeProps } from '@/components/ui/badge'
import { updateStatus } from '@/app/tasks/actions' // Update with your actual imports
import { statuses } from '@/app/data/data'

// Props type definition for the component
interface StatusDropdownProps {
  currentStatusValue: string
  rowId: string
}

const StatusDropdown: FC<StatusDropdownProps> = ({
  currentStatusValue,
  rowId,
}) => {
  const [status, setStatus] = useState(
    statuses.find((status) => status.value === currentStatusValue)
  )

  if (!status) {
    return null
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    const newStatusObj = statuses.find((status) => status.value === newStatus)
    if (newStatusObj) {
      setStatus(newStatusObj)
      try {
        const result = await updateStatus(id, newStatus) // Assuming updateStatus returns a promise
        // Handle the response accordingly
        toast.info('Task status updated')
      } catch (error) {
        toast.error('Error updating status')
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center w-full h-full focus:ring-none ring-none">
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
            if (rowId && newStatus) {
              handleStatusChange(rowId, newStatus)
            } else {
              toast.error('Error occurred')
            }
          }}
        >
          {statuses.map((status) => (
            <DropdownMenuRadioItem key={status.value} value={status.value}>
              <Badge variant={status.variant as BadgeProps['variant']}>
                {status.icon && <status.icon className="w-3.5 h-3.5 mr-2" />}
                <span>{status.label}</span>
              </Badge>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default StatusDropdown
