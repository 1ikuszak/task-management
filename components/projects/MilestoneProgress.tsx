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
  // Find the last completed milestone
  const lastCompletedIndex = milestones.map((m) => m.status).lastIndexOf(true)

  return (
    <ol className="items-center w-full sm:flex">
      {milestones.map((milestone, index) => (
        <li className="relative w-full mb-6 sm:mb-0" key={milestone.name}>
          {index % 2 !== 0 && (
            <Badge variant={'outline'} className="absolute -top-8">
              {milestone.deadline}
            </Badge>
          )}
          <div className="flex items-center overflow-hidden">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  {index <= lastCompletedIndex && (
                    <div className="z-10 flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full ring-0 ring-white sm:ring-8 shrink-0">
                      <Icons.check className="text-blue-600" />
                    </div>
                  )}
                  {index > lastCompletedIndex && (
                    <div className="z-10 flex items-center justify-center w-5 h-5 bg-blue-100 rounded-full ring-0 ring-white sm:ring-8 shrink-0" />
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{milestone.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {index !== milestones.length - 1 && ( // Do not render the line for the last milestone
              <span className="hidden w-full h-1 mx-2 bg-blue-100 rounded-full sm:flex" />
            )}
          </div>
          <div className="mt-3 sm:pr-8">
            {index % 2 === 0 && (
              <Badge variant={'outline'} className="absolute -bottom-8">
                {milestone.deadline}
              </Badge>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}

export default MilestoneProgress
