import AuthStore from './AuthStore/index'
//import AuthApi from '../services/AuthService/index'
import AuthFixtures from '../services/AuthService/index.fixtures'

//const authService = new AuthApi()
const authService = new AuthFixtures()
const authStore = new AuthStore(authService)

export default authStore
