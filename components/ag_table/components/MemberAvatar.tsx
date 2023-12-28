'use client'

import React, { FC } from 'react'
import { project_members } from '@/app/data/data'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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
      <Avatar className="w-6 h-6">
        <AvatarImage src={member.avatar} alt="@shadcn" />
        <AvatarFallback>DM</AvatarFallback>
      </Avatar>
    </div>
  )
}

export default MemberAvatar
