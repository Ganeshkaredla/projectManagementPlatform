import React from 'react'
import { observer } from 'mobx-react'

import { Colors } from '../../../../themes/Colors'
import {
   Typo16HKGroteskMedium,
   Typo16HKGroteskMedium100
} from '../../../../styleGuide/Typos'
import i18n from '../../../../i18n/strings.json'

import TaskCard from '../TaskCard'

import { TasksListWrapper, TasksListHeader } from './styledComponent'

@observer
class TasksList extends React.Component<{
   tasksData: any
   handleTaskInfo: any
   handleStatusChange: any
   workflows: any
}> {
   render() {
      const {
         tasksData,
         handleTaskInfo,
         handleStatusChange,
         workflows
      } = this.props
      const data = tasksData.map((eachTask, index) => (
         <TaskCard
            key={eachTask.id}
            bgColor={index % 2 === 0 ? Colors.lightBlueGrey24 : Colors.white}
            task={eachTask}
            handleTaskInfo={handleTaskInfo}
            handleStatusChange={handleStatusChange}
            workflows={workflows}
         />
      ))
      return (
         <TasksListWrapper>
            <TasksListHeader>
               <Typo16HKGroteskMedium>{i18n.listOfTasks}</Typo16HKGroteskMedium>
               <Typo16HKGroteskMedium>{i18n.summary}</Typo16HKGroteskMedium>
               <Typo16HKGroteskMedium>{i18n.createdAt}</Typo16HKGroteskMedium>
               <Typo16HKGroteskMedium>{i18n.status}</Typo16HKGroteskMedium>
               <Typo16HKGroteskMedium100>{i18n.info}</Typo16HKGroteskMedium100>
            </TasksListHeader>
            {data}
         </TasksListWrapper>
      )
   }
}
export { TasksList }