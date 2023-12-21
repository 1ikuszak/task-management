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
import { Milestone } from '@/app/data/schema'
import { calculateDaysRemaining } from '@/lib/utils'

interface ProjectCardProps {
  name: string
  milestones: Milestone[]
  created_at: string
  deadline: string
  project_id: string
}

const ProjectCard: FC<ProjectCardProps> = ({
  name,
  milestones,
  created_at,
  deadline,
  project_id,
}) => {
  const getCurrentMilestone = () => {
    const lastCheckedIndex = milestones.map((m) => m.checked).lastIndexOf(true)
    return milestones[lastCheckedIndex + 1]
  }
  const currentMilestone = getCurrentMilestone()

  const daysToNextMilestone = currentMilestone
    ? calculateDaysRemaining(currentMilestone.deadline)
    : 0

  const lastMilestone = milestones[milestones.length - 1]
  const daysToLastMilestone = calculateDaysRemaining(lastMilestone.deadline)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="space-y-1">
          <Badge variant={'blue'}>{name}</Badge>
          <p className="text-2xl font-semibold">
            {currentMilestone ? currentMilestone.name : 'No current milestone'}
          </p>
        </CardTitle>
        <Button variant={'outline'} size={'sm'}>
          <Icons.list className="w-4 h-4 mr-4 text-muted-foreground" /> Tasks
        </Button>
      </CardHeader>
      <CardContent className="mt-[3rem]">
        <MilestoneProgress milestones={milestones} />
      </CardContent>
      <CardFooter className="justify-between">
        <div className="flex items-center">
          <div className="flex space-x-2">
            <Card className="relative">
              <Icons.milestone className="absolute w-3.5 h-3.5 top-1 right-1 text-muted-foreground" />
              <CardContent className="pb-1">
                <span>
                  <span className="text-xl font-bold">
                    +{daysToNextMilestone}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {' '}
                    days
                  </span>
                </span>
                <p className="text-xs text-muted-foreground">
                  to <span className="font-semibold">next</span> milestone
                </p>
              </CardContent>
            </Card>
            <Card className="relative">
              <Icons.calender className="absolute w-3.5 h-3.5 top-1 right-1 text-muted-foreground" />
              <CardContent className="pb-1">
                <span>
                  <span className="text-xl font-bold">
                    +{daysToLastMilestone}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {' '}
                    days
                  </span>
                </span>
                <p className="text-xs text-muted-foreground">
                  to project <span className="font-semibold">deadline</span>
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="flex gap-1 ml-4">
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
        </div>
        <ProjectActions project_id={project_id} />
      </CardFooter>
    </Card>
  )
}

export default ProjectCard
