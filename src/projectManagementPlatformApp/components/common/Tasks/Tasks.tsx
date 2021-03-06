import React from 'react'
import { observable } from 'mobx'

import { inject, observer } from 'mobx-react'
import { History } from 'history'
import { withRouter } from 'react-router-dom'
import { ToastContainer, Slide } from 'react-toastify'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BsCheckCircle } from 'react-icons/bs'
import { getLoadingStatus } from '@ib/api-utils'

import CommonButton from '../../../../Common/components/CommonButton/CommonButton'
import { Typo26BrightBlueHKGroteskRegular } from '../../../../styleGuide/Typos'
import LoadingWrapperWithFailure from '../../../../Common/components/LoadingWrapperWithFailure'

import { Colors } from '../../../../themes/Colors'
import i18n from '../../../../i18n/strings.json'
import ProjectStore from '../../../stores/ProjectStore'
import TaskStore from '../../../stores/TaskStore'
import AuthStore from '../../../../Authentication/stores/AuthStore'
import NoDataView from '../../../../Common/components/NoDataView'
import { PROJECT_MANAGEMENT_PLATFORM_DASHBOARD } from '../../../../Common/constants/EnvironmentConstants'

import TasksList from '../TasksList'
import Pagination from '../Pagination'
import CreateTask from '../CreateTask'
import Header from '../Header'
import TaskInfo from '../TaskInfo'
import TransitionChange from '../TransitionChange'
import ProfileCard from '../ProfileCard'

import {
   TasksPageWrapper,
   PaginationWrapper,
   CreateTaskWrapper,
   ProjectTaskHeader,
   TasksWrapper,
   ProfileCardWrapper,
   TaskInfoWrapper,
   TransitionConfirmationWrapper,
   ToasterWrapper,
   ToastMessage
} from './styledComponent'

type PropsType = {
   projectStore: ProjectStore
   taskStore: TaskStore
   history: History
   authStore: AuthStore
   match: any
}
@inject('projectStore', 'taskStore', 'authStore')
@observer
class Tasks extends React.Component<PropsType> {
   @observable isCreateClicked: boolean = false
   @observable isProfileClicked: boolean = false
   @observable isTaskInfoClicked: boolean = false
   @observable taskObject = {}
   @observable isStatusChangeTriggred: boolean = false
   @observable checklistRequestObject = {}
   @observable transitionChangeTaskId: number = 0

   handleCreateTask = () => {
      this.isCreateClicked = !this.isCreateClicked
   }
   handleStatusChange = (
      selectedOption: string,
      task: any,
      toStateId: number
   ) => {
      this.isStatusChangeTriggred = !this.isStatusChangeTriggred
      if (this.isStatusChangeTriggred) {
         let taskObject = this.taskObject
         taskObject = task
         taskObject['to'] = selectedOption
         this.taskObject = taskObject
         const requestObject = {
            to_state: toStateId
         }
         this.checklistRequestObject = requestObject
         this.transitionChangeTaskId = task.id
         this.doChecklistNetworkCalls()
      }
   }

   onChecklistSuccess = () => {
      const { taskStore } = this.props
      const checklist = taskStore.taskChecklist
      this.taskObject['checklist'] = checklist
      this.taskObject['workflows'] = taskStore.workflows
   }

   handleTransitionChangeSubmit = (selectedOption: string) => {
      if (!this.isCreateClicked) {
         const { taskStore } = this.props
         taskStore.changeTaskStatusAPI({}, this.onTransitionChangeSuccess)
      }
   }
   doChecklistNetworkCalls = () => {
      const { taskStore } = this.props
      taskStore.getChecklistAPI(
         this.checklistRequestObject,
         this.transitionChangeTaskId,
         this.onChecklistSuccess
      )
   }

   onTransitionChangeSuccess = () => {
      this.isStatusChangeTriggred = !this.isStatusChangeTriggred
      toast.success(
         <React.Fragment>
            <ToastMessage>
               <BsCheckCircle color='white' size={20} />
               {i18n.transitionUpdatedSuccessfully}
            </ToastMessage>
         </React.Fragment>,
         {
            position: 'bottom-center',
            hideProgressBar: true,
            closeButton: false
         }
      )
   }
   componentDidMount() {
      let id = this.props.match.params.id
      this.doNetworkCalls(id)
   }
   handleBackButton = () => {
      const { history } = this.props
      history.replace(PROJECT_MANAGEMENT_PLATFORM_DASHBOARD)
   }
   handleProfile = () => {
      this.isProfileClicked = !this.isProfileClicked
   }
   componentWillUnmount() {
      const { taskStore, projectStore } = this.props
      taskStore.clearStore()
      projectStore.clearStore()
   }
   handleTaskInfo = (event: MouseEvent, task: any) => {
      this.isTaskInfoClicked = !this.isTaskInfoClicked
      if (this.isTaskInfoClicked) {
         this.taskObject = task
      }
   }
   renderSuccessUI = observer(() => {
      const { projectStore, taskStore } = this.props
      const tasksData = taskStore.renderedTasksList
      const checklistFetchingStatus = taskStore.checklistAPIStatus
      const workflows = taskStore.workflows
      const workflowsAPIStatus = taskStore.getWorkflowsAPIStatus
      const transitionChangeAPIStatus = taskStore.changeStatusAPIStatus
      return (
         <TasksPageWrapper>
            <ProjectTaskHeader>
               <CommonButton
                  buttonValue={i18n.backToProjects}
                  handleClick={this.handleBackButton}
                  bgColor={Colors.whiteTwo}
                  textColor={Colors.steel}
                  height={'30px'}
                  width={'180px'}
               />
               <Typo26BrightBlueHKGroteskRegular>
                  {i18n.listOfTasks}
               </Typo26BrightBlueHKGroteskRegular>
               <CommonButton
                  buttonValue={i18n.addTask}
                  handleClick={this.handleCreateTask}
                  height={'30px'}
                  width={'120px'}
                  testId={'addTask'}
               />
            </ProjectTaskHeader>

            {taskStore.totalTasksCount > 0 ? (
               <React.Fragment>
                  <TasksWrapper>
                     <TasksList
                        tasksData={tasksData}
                        handleTaskInfo={this.handleTaskInfo}
                        handleStatusChange={this.handleStatusChange}
                        workflows={workflows}
                        handleDropdownClick={this.handleWorkflowAPICall}
                        workflowsAPIStatus={workflowsAPIStatus}
                     />
                  </TasksWrapper>
                  <PaginationWrapper backgroundColor={this.isCreateClicked}>
                     <Pagination
                        hide={taskStore.totalPaginationLimit <= 1}
                        currentPageNumber={taskStore.currentPageNumber}
                        totalPages={taskStore.totalPaginationLimit}
                        handlePaginationButtons={
                           taskStore.handlePaginationButtons
                        }
                     />
                  </PaginationWrapper>
               </React.Fragment>
            ) : (
               <NoDataView text={i18n.noTasksFoundCreateANewOne} />
            )}
            <CreateTaskWrapper hide={this.isCreateClicked}>
               <CreateTask
                  handleClose={this.handleCreateTask}
                  taskStore={taskStore}
                  projectsData={projectStore.projectsList}
                  totalProjects={projectStore.totalProjectsList}
               />
            </CreateTaskWrapper>
            <TaskInfoWrapper hide={this.isTaskInfoClicked}>
               <TaskInfo
                  handleClose={this.handleTaskInfo}
                  taskObject={this.taskObject}
               />
            </TaskInfoWrapper>
            <TransitionConfirmationWrapper hide={this.isStatusChangeTriggred}>
               <TransitionChange
                  taskObject={this.taskObject}
                  handleClose={this.handleStatusChange}
                  checklistFetchingStatus={checklistFetchingStatus}
                  handleSubmit={this.handleTransitionChangeSubmit}
                  transitionApiStatus={transitionChangeAPIStatus}
                  networkCalls={this.doChecklistNetworkCalls}
               />
            </TransitionConfirmationWrapper>
            <ToasterWrapper>
               <ToastContainer transition={Slide} autoClose={3000} limit={1} />
            </ToasterWrapper>
         </TasksPageWrapper>
      )
   })

   doNetworkCalls = (id: number) => {
      const { taskStore, projectStore } = this.props
      taskStore.getTasksAPI(id)
      projectStore.getProjectsAPI()
   }

   handleWorkflowAPICall = (event: MouseEvent, taskId: string) => {
      const { taskStore } = this.props
      taskStore.getWorkflowsAPI(taskId)
   }
   handleLogout = () => {
      const { history, authStore } = this.props
      authStore.clearUserSession()
      history.push('/')
   }
   onRetryDoNetworkCalls = () => {
      let id = this.props.match.params.id
      this.doNetworkCalls(id)
   }
   render() {
      const { taskStore, projectStore } = this.props

      const apiStatus = getLoadingStatus(
         projectStore.projectsAPIStatus,
         taskStore.tasksAPIStatus
      )

      return (
         <React.Fragment>
            <Header handleProfileClick={this.handleProfile} />
            <LoadingWrapperWithFailure
               apiStatus={apiStatus}
               renderSuccessUI={this.renderSuccessUI}
               apiError={taskStore.tasksAPIError}
               onRetryClick={this.onRetryDoNetworkCalls}
            />
            <ProfileCardWrapper hide={this.isProfileClicked}>
               <ProfileCard
                  handleProfile={this.handleProfile}
                  handleLogout={this.handleLogout}
               />
            </ProfileCardWrapper>
         </React.Fragment>
      )
   }
}
export default withRouter(Tasks)
