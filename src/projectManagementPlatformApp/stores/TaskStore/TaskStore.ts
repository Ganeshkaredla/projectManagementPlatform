import { observable, action, computed } from 'mobx'
import { API_INITIAL } from '@ib/api-constants'
import { bindPromiseWithOnSuccess } from '@ib/mobx-promise'
import TaskModel from '../models/TaskModel'
import TransitionChecklistModel from '../models/TransitionChecklistModel'
import StatesModel from '../models/StatesModel'
import TasksFixturesAPI from '../../services/TaskService/index.fixtures'
import TasksAPI from '../../services/TaskService/index.Api'

export type WorkflowType = {
   name: string
   workflowId: number
}
export type ChecklistType = {
   name: string
   id: number
   isMandatory: boolean
}
export type TaskModelType = {
   taskTitle: string
   projectTitle: string
   description: string
   id: number
   workflow: Array<WorkflowType>
   createdAt: string
   status: string
   checklist: Array<ChecklistType>
   createdBy: string
}
class TaskStore {
   @observable tasksList!: Array<Array<TaskModelType>>
   @observable tasksAPIStatus!: number
   @observable checklistAPIStatus!: number
   @observable createTaskAPIStatus!: number
   @observable changeStatusAPIStatus!: number
   @observable getWorkflowsAPIStatus!: number
   @observable getWorkflowsAPIError!: Error | null
   @observable changeStatusAPIError
   @observable createTaskAPIError
   @observable checklistAPIError
   @observable tasksAPIError
   @observable taskChecklist!: Array<ChecklistType>
   @observable totalTasks!: number
   @observable totalPaginationLimit!: number
   @observable currentPageNumber!: number
   @observable tasksLimitPerPage!: number
   @observable workflows!: Array<WorkflowType>
   @observable projectId!: number
   @observable offset!: number
   taskService
   constructor(taskService: TasksFixturesAPI | TasksAPI) {
      this.init()
      this.taskService = taskService
   }
   init() {
      this.tasksList = []
      this.tasksAPIStatus = API_INITIAL
      this.createTaskAPIStatus = API_INITIAL
      this.checklistAPIStatus = API_INITIAL
      this.getWorkflowsAPIStatus = API_INITIAL
      this.getWorkflowsAPIError = null
      this.checklistAPIError = null
      this.createTaskAPIError = null
      this.tasksAPIError = null
      this.tasksLimitPerPage = 10
      this.totalTasks = 0
      this.currentPageNumber = 1
      this.workflows = []
      this.taskChecklist = []
      this.totalPaginationLimit = 0
      this.projectId = 0
      this.offset = 0
   }
   @action.bound
   clearStore() {
      this.init()
   }
   @action.bound
   getTasksAPI(id: number) {
      if (
         this.tasksList[this.currentPageIndex] === undefined ||
         this.tasksList[this.currentPageIndex].length === 0
      ) {
         this.projectId = id
         const tasksPromise = this.taskService.getTasksAPI(
            this.projectId,
            this.tasksLimitPerPage,
            this.offset
         )
         return bindPromiseWithOnSuccess(tasksPromise)
            .to(this.setTasksAPIStatus, response => {
               this.setTasksAPIResponse(response)
            })
            .catch(error => {
               this.setTasksAPIError(error)
            })
      }
   }

   @action.bound
   createTaskAPI(taskDetailsObject, onSuccess: Function, onFailure: Function) {
      const createTaskPromise = this.taskService.createTaskAPI(
         taskDetailsObject
      )
      return bindPromiseWithOnSuccess(createTaskPromise)
         .to(this.setCreateTaskAPIStatus, response => {
            this.setCreateTaskAPIResponse(response)
            onSuccess()
         })
         .catch(error => {
            this.setCreateTaskAPIError(error)
            onFailure()
         })
   }

   @action.bound
   changeTaskStatusAPI(requestObject, onSuccess: Function) {
      const changeTaskPromise = this.taskService.changeTaskStatusAPI()
      return bindPromiseWithOnSuccess(changeTaskPromise)
         .to(this.setChangeTaskAPIStatus, response => {
            this.setChangeTaskAPIResponse(response)
            onSuccess()
         })
         .catch(error => {
            this.setChangeTaskAPIError(error)
         })
   }
   @action.bound
   getChecklistAPI(requestObject, taskId: number, onSuccess: Function) {
      const checklistPromise = this.taskService.getChecklistAPI(
         requestObject,
         taskId
      )
      return bindPromiseWithOnSuccess(checklistPromise)
         .to(this.setChecklistAPIStatus, response => {
            this.setChecklistAPIResponse(response)
            onSuccess()
         })
         .catch(error => this.setChecklistAPIError(error))
   }
   @action.bound
   getWorkflowsAPI(id: string) {
      if (this.workflows.length === 0) {
         const workflowsPromise = this.taskService.getWorkflowsAPI(id)
         return bindPromiseWithOnSuccess(workflowsPromise)
            .to(this.setWorkflowsAPIStatus, response => {
               this.setWorkflowsResponse(response)
            })
            .catch(error => {
               this.setWorkflowsAPIError(error)
            })
      }
   }

   @action.bound
   setWorkflowsAPIStatus(apiStatus: number) {
      this.getWorkflowsAPIStatus = apiStatus
   }
   @action.bound
   setWorkflowsAPIError(error) {
      this.getWorkflowsAPIError = error
   }
   @action.bound
   setWorkflowsResponse(response) {
      this.onAddStates(response.to_states)
   }
   @action.bound
   onAddStates(response) {
      const states = response.map(state => new StatesModel(state))
      this.workflows = states
   }
   @action.bound
   setChecklistAPIStatus(apiStatus: number) {
      this.checklistAPIStatus = apiStatus
   }
   @action.bound
   setChecklistAPIError(error) {
      console.log(error)
      this.checklistAPIError = error
   }

   @action.bound
   setChecklistAPIResponse(response) {
      // console.log(response)
      this.onAddChecklists(response)
   }

   @action.bound
   setChangeTaskAPIStatus(apiStatus: number) {
      this.changeStatusAPIStatus = apiStatus
   }
   @action.bound
   setChangeTaskAPIError(error) {
      this.changeStatusAPIError = error
   }
   @action.bound
   setChangeTaskAPIResponse(response) {}

   @action.bound
   setCreateTaskAPIStatus(apiStatus: number) {
      this.createTaskAPIStatus = apiStatus
   }
   @action.bound
   setCreateTaskAPIError(error) {
      this.createTaskAPIError = error
   }
   @action.bound
   setCreateTaskAPIResponse(response) {}

   @action.bound
   onInitializeArrayElements(length: number) {
      const array = this.tasksList
      const emptyArray: Array<TaskModelType> = []
      for (let i = 0; i < length; ++i) {
         array.push(emptyArray)
      }
      this.tasksList = array
   }
   @action.bound
   setTasksAPIStatus(apiStatus: number) {
      this.tasksAPIStatus = apiStatus
   }
   @action.bound
   setTasksAPIError(error) {
      this.tasksAPIError = error
   }
   @action.bound
   setTasksAPIResponse(response) {
      this.totalTasks = response.total_count_of_tasks
      if (this.tasksList.length === 0) {
         this.onInitializeArrayElements(this.totalTasks)
      }
      const totalPages = response.total_count_of_tasks / this.tasksLimitPerPage
      this.totalPaginationLimit = totalPages
      this.onAddTasks(response.tasks)
   }
   @action.bound
   onAddTasks(tasks) {
      const tasksList = tasks.map(eachTask => new TaskModel(eachTask))
      this.tasksList = tasksList
   }

   @action.bound
   onAddChecklists(response) {
      const checklist = response.checklists
      const checklistMap = checklist.map(
         eachChecklist => new TransitionChecklistModel(eachChecklist)
      )
      this.taskChecklist = checklistMap
   }

   @action.bound
   handlePaginationButtons(value) {
      this.offset = value * this.tasksLimitPerPage - this.tasksLimitPerPage

      this.currentPageNumber = value
      this.getTasksAPI(value)
   }
   @computed
   get currentPageIndex() {
      return this.currentPageNumber - 1
   }
   @computed
   get renderedTasksList() {
      const { tasksList } = this
      if (tasksList.length > 0) {
         return tasksList
      } else {
         return tasksList
      }
   }

   @computed
   get totalTasksCount() {
      const tasksList = this.tasksList
      let count = 0
      for (let i = 0; i < tasksList.length; ++i) {
         count++
      }
      return count
   }
}
export { TaskStore }
