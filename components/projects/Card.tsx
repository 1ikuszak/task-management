'use client'

import React from 'react'
import { Icons } from '../Icons'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { FC } from 'react'
import { ProjectActions } from './ProjectActions'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import MilestoneProgress from './MilestoneProgress'

interface ProjectCardProps {
  name: string
  milestone: string
  created_at: string
  deadline: string
  progress: number
}

const milestones = [
  {
    name: 'Milestone 1',
    deadline: new Date(),
    checked: true,
    index: 1,
    project_id: 'dassad',
  },
  {
    name: 'Milestone 2',
    deadline: new Date(),
    checked: true,
    index: 2,
    project_id: 'dassad',
  },
  {
    name: 'Milestone 3',
    deadline: new Date(),
    checked: false,
    index: 3,
    project_id: 'dassad',
  },
  {
    name: 'Milestone 4',
    deadline: new Date(),
    checked: false,
    index: 4,
    project_id: 'dassad',
  },
  {
    name: 'Milestone 5',
    deadline: new Date(),
    checked: false,
    index: 5,
    project_id: 'dassad',
  },
]

const ProjectCard: FC<ProjectCardProps> = ({
  name,
  milestone,
  created_at,
  deadline,
  progress,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="space-y-1">
          <Badge variant={'blue'}>{name}</Badge>
          <p className="text-2xl font-semibold">{milestone}</p>
        </CardTitle>
        <Button variant={'outline'} size={'sm'}>
          <Icons.list className="w-4 h-4 mr-4 text-muted-foreground" /> Tasks
        </Button>
      </CardHeader>
      <CardContent className="my-[3rem]">
        <MilestoneProgress milestones={milestones} />
      </CardContent>
      <CardFooter className="justify-between">
        <div className="flex gap-1">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/shadc.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/shad.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/sss.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <ProjectActions project_id={name} />
      </CardFooter>
    </Card>
  )
}

export default ProjectCard
