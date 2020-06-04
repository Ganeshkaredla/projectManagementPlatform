import { AuthStore } from '../../Authentication/stores/AuthStore/AuthStore'
import AuthApi from '../../Authentication/services/AuthService/index'
import ProjectStore from './ProjectStore'
import ProjectsService from '../services/ProjectsService/index.fixtures'
import TaskStore from './TaskStore'
import TasksAPI from '../services/TaskService/index.Api'
import TasksFixturesAPI from '../services/TaskService/index.fixtures'
import ProjectsApi from '../services/ProjectsService/index.Api'

const authApi = new AuthApi()
const authStore = new AuthStore(authApi)
//const projectsService = new ProjectsService()
const projectsService = new ProjectsApi()
const projectStore = new ProjectStore(projectsService)

//const taskService = new TasksFixturesAPI()
const taskService = new TasksAPI()
const taskStore = new TaskStore(taskService)
export default { authStore, projectStore, taskStore }
