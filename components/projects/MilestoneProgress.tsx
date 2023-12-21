import React, { FC } from 'react'
import { Milestone } from '@/app/data/schema'
import { Badge } from '../ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Icons } from '../Icons'

interface MilestoneProgressProps {
  milestones: Milestone[]
}

const MilestoneProgress: FC<MilestoneProgressProps> = ({ milestones }) => {
  const lastCompletedIndex: number = milestones
    .map((m) => m.checked)
    .lastIndexOf(true)

  const formatDate = (date: Date | string | undefined) => {
    if (typeof date === 'string') {
      date = new Date(date)
    }
    return date instanceof Date ? date.toLocaleDateString() : 'No Date'
  }

  return (
    <ol className="items-center w-full sm:flex">
      {milestones.map((milestone, index) => (
        <li className="relative w-full mb-6 sm:mb-0" key={milestone.name}>
          <Badge
            variant={'outline'}
            className={`absolute -top-8 ${
              milestone.checked ? 'line-through' : ''
            }`}
          >
            {milestone.name}
          </Badge>
          <div className="flex items-center overflow-hidden">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  {milestone.checked && (
                    <div className="z-10 flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full ring-0 ring-white sm:ring-8 shrink-0">
                      <Icons.check className="text-blue-600" />
                    </div>
                  )}
                  {!milestone.checked && (
                    <div className="z-10 flex items-center justify-center w-5 h-5 bg-blue-100 rounded-full ring-0 ring-white sm:ring-8 shrink-0" />
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{milestone.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {index !== milestones.length - 1 && ( // Do not render the line for the last milestone
              <span
                className={`hidden w-full h-1 mx-2 rounded-full sm:flex ${
                  index < lastCompletedIndex ? 'bg-blue-600' : 'bg-blue-100'
                } ${index === lastCompletedIndex ? 'bg-blue-400' : ''}`}
              />
            )}
          </div>
          <div className="mt-3 sm:pr-8">
            <span className="text-xs text-muted-foreground text-ellipsis">
              {formatDate(milestone.deadline)}
            </span>
          </div>
        </li>
      ))}
    </ol>
  )
}

export default MilestoneProgress
