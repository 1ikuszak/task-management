'use client'

import { Icons } from '../Icons'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

import React, { PureComponent } from 'react'

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

interface ProjectCardProps {
  name: string
  milestone: string
  created_at: string
  deadline: string
  progress: number
}

const ProjectCard: FC<ProjectCardProps> = ({
  name,
  milestone,
  created_at,
  deadline,
  progress,
}) => {
  const data = [
    {
      name: 'Page A',
      days: 4000,
    },
    {
      name: 'Page B',
      days: 3000,
    },
    {
      name: 'Page C',
      days: 2000,
    },
    {
      name: 'Page D',
      days: 2780,
    },
    {
      name: 'Page E',
      days: 0,
    },
  ]
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="flex flex-col">
          <p className="text-sm font-medium text-muted-foreground">{name}</p>
          <p className="text-2xl font-semibold">{milestone}</p>
        </CardTitle>
        <Button variant={'outline'} size={'sm'}>
          Tasks
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1">
          <span className="flex w-6 h-6 bg-blue-100 rounded-full" />
          <span className="flex w-6 h-6 bg-blue-200 rounded-full" />
          <span className="flex w-6 h-6 bg-blue-300 rounded-full" />
          <span className="flex w-6 h-6 bg-blue-400 rounded-full" />
          <span className="flex w-6 h-6 bg-blue-500 rounded-full" />
        </div>
        <div className="w-full h-[60px] my-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line
                type="monotone"
                dataKey="days"
                stroke="#18181B"
                strokeWidth={2}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between w-full gap-10">
          {/* <div className="flex flex-col">
            <div className="font-semibold whitespace-nowrap">58 days left</div>
            <p className="text-xs text-muted-foreground">24.12.2023</p>
          </div> */}
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <div>
              <span className="font-bold">58</span> days left
            </div>
            <div>{deadline}</div>
          </div>
          <ProjectActions project_id={name} />
        </div>
      </CardFooter>
    </Card>
  )
}

export default ProjectCard
