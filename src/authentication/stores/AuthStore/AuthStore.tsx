import { observable, action, computed } from 'mobx'
import { API_INITIAL } from '@ib/api-constants'
import { bindPromiseWithOnSuccess } from '@ib/mobx-promise'
import {
   setAccessToken,
   getAccessToken,
   clearUserSession,
   setAdmin,
   getAdmin,
   clearAdmin
} from '../../../Common/utils/StorageUtils'
import { getUserDisplayableErrorMessage } from '../../../Common/utils/APIUtils'
import AuthFixtures from '../../services/AuthService/index.fixtures'
import AuthApi from '../../services/AuthService'
class AuthStore {
   @observable getSignInApiStatus!: number
   @observable getSignInError

   authService
   constructor(authService: AuthFixtures | AuthApi) {
      this.init()
      this.authService = authService
   }
   @action.bound
   init() {
      this.getSignInApiStatus = API_INITIAL
      this.getSignInError = null
   }
   @action.bound
   clearStore() {
      this.init()
   }
   getSignInAPI = (
      requestObject: { username: string; password: string },
      onSuccess: Function,
      onFailure: Function
   ) => {
      const tokenPromise = this.authService.signInAPI(requestObject)
      return bindPromiseWithOnSuccess(tokenPromise)
         .to(this.setSignInAPIStatus, response => {
            this.setSignInAPIResponse(response)
            onSuccess()
         })
         .catch(error => {
            this.setSignInAPIError(error)
            onFailure(getUserDisplayableErrorMessage(error))
         })
   }
   @action.bound
   setSignInAPIError(error) {
      this.getSignInError = getUserDisplayableErrorMessage(error)
   }
   @action.bound
   setSignInAPIStatus(apiStatus: number) {
      this.getSignInApiStatus = apiStatus
   }
   @action.bound
   setSignInAPIResponse(response) {
      const accessToken = response.access_token
      const isAdmin = response.is_admin
      setAdmin(isAdmin)
      setAccessToken(accessToken)
   }
   @action.bound
   clearUserSession() {
      clearUserSession()
      clearAdmin()
      this.clearStore()
   }
   @computed
   get isAdmin() {
      return getAdmin()
   }

   @computed
   get accessToken() {
      if (getAccessToken() !== undefined) {
         return true
      }
      return false
   }
}

export { AuthStore }
