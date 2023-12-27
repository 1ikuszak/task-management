'use client'

import React, { FC } from 'react'
import { project_members } from '@/app/data/data'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Props type definition for the component
interface MemberAvatarProps {
  project_member: string
}

const MemberAvatar: FC<MemberAvatarProps> = ({ project_member }) => {
  const member = project_members.find(
    (member) => member.value === project_member
  )

  if (!member) {
    return null
  }

  return (
    <div className="flex items-center w-full h-full">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Avatar className="w-6 h-6">
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
}

export default MemberAvatar
