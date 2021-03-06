import React, { MouseEvent } from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { BsCheckCircle } from 'react-icons/bs'

import {
   API_FETCHING,
   API_SUCCESS,
   API_INITIAL,
   API_FAILED
} from '@ib/api-constants'

import CommonButton from '../../../../Common/components/CommonButton/CommonButton'
import i18n from '../../../../i18n/strings.json'
import UserTextInputField from '../../../../Common/components/UserTextInputField/UserTextInputField'
import { UserTextareaInput } from '../../../../Common/components/UserTextAreaInput/UserTextAreaInput'
import { Dropdown } from '../../../../Common/components/Dropdown/Dropdown'
import {
   Typo18BoldHKGroteskRegular,
   Typo12NeonRedHKGroteskRegular
} from '../../../../styleGuide/Typos'
import { stringValidator } from '../../../../Authentication/utils/ValidationUtils/ValidationUtils'
import CloseButton from '../../../../Common/components/Avatar/Avatar'

import {
   CreateProjectWrapper,
   CreateProjectHeader,
   ProjectDetails,
   DropdownWrapper,
   ToasterWrapper,
   CreateButtonWrapper
} from './styledComponent'

type CreateProjectProps = {
   handleClick: Function
   workflows: any
   handleDropdown: Function
   createProject: Function
   workflowFetchingStatus: Number
   createProjectFetchingStataus: Number
}
type ProjectDataType = {
   projectName: string
   description: string
   workflowType: number
   projectType: string
}
@observer
class CreateProject extends React.Component<CreateProjectProps> {
   @observable projectData: ProjectDataType = {
      projectName: '',
      description: '',
      workflowType: 0,
      projectType: ''
   }
   @observable projectNameFieldHasError: boolean = false
   @observable projectNameErrorMessage: string = ''
   @observable projectDescriptionHasError: boolean = false
   @observable projectDescriptionErrorMessage: string = ''
   @observable projectWorkflowError: string = ''
   @observable projectTypeError: string = ''
   @observable isValidated: boolean = false
   handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      this.projectData.projectName = value
      if (stringValidator(value)) {
         this.projectNameErrorMessage = ''
         this.projectNameFieldHasError = false
         this.handleValidation()
      } else {
         this.projectNameErrorMessage = i18n.thisFieldIsRequired
         this.projectNameFieldHasError = true
         this.isValidated = false
      }
   }
   handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      this.projectData.description = value
      if (stringValidator(value)) {
         this.projectDescriptionHasError = false
         this.projectDescriptionErrorMessage = ''
         this.handleValidation()
      } else {
         this.projectDescriptionHasError = true
         this.projectDescriptionErrorMessage = i18n.thisFieldIsRequired
         this.isValidated = false
      }
   }
   handleWorkflowDropdownChange = (
      event: React.ChangeEvent<HTMLSelectElement>
   ) => {
      const value = event.target.value
      if (stringValidator(value)) {
         const { workflows } = this.props
         let selectedId
         for (let i = 0; i < workflows.length; ++i) {
            if (workflows[i].name === value) {
               selectedId = workflows[i].workflowId
               break
            }
         }
         this.projectData.workflowType = selectedId

         this.projectWorkflowError = ''
         this.handleValidation()
      } else {
         this.projectWorkflowError = i18n.thisFieldIsRequired
         this.isValidated = false
      }
   }
   handleProjectTypeDropdown = (
      event: React.ChangeEvent<HTMLSelectElement>
   ) => {
      const value = event.target.value
      if (stringValidator(value)) {
         this.projectData.projectType = value.toString()
         this.projectTypeError = ''
         this.handleValidation()
      } else {
         this.projectTypeError = i18n.thisFieldIsRequired
         this.isValidated = false
      }
   }
   handleValidation = () => {
      const { projectData } = this
      if (
         stringValidator(projectData.projectName) &&
         stringValidator(projectData.description)
      ) {
         if (
            stringValidator(projectData.projectType) &&
            projectData.workflowType !== 0
         ) {
            this.isValidated = true
         }
      }
   }

   handleSubmit = (event: MouseEvent) => {
      event.preventDefault()

      if (this.isValidated) {
         const { createProject } = this.props
         const projectData = this.projectData
         const projectObject = {
            name: projectData.projectName,
            description: projectData.description,
            project_type: projectData.projectType,
            workflow_type: projectData.workflowType,
            assigned_to: []
         }
         createProject(projectObject, this.onSuccess)
      } else {
         this.handleValidation()
      }
   }
   onSuccess = () => {
      this.onResetAllToDefault()
      const { handleClick } = this.props
      toast.success(
         <React.Fragment>
            <ToasterWrapper>
               <BsCheckCircle color='white' size={20} />
               {i18n.projectCreatedSuccessfully}
            </ToasterWrapper>
         </React.Fragment>,
         {
            position: 'bottom-center',
            hideProgressBar: true,
            closeButton: false
         }
      )
      handleClick()
      setTimeout(() => window.location.reload(), 500)
   }
   onResetAllToDefault = () => {
      this.projectData = {
         projectName: '',
         description: '',
         workflowType: 0,
         projectType: ''
      }
      this.projectNameFieldHasError = false
      this.projectNameErrorMessage = ''
      this.projectDescriptionHasError = false
      this.projectDescriptionErrorMessage = ''
      this.projectWorkflowError = ''
      this.projectTypeError = ''
      this.isValidated = false
   }
   handleClose = () => {
      this.onResetAllToDefault()
      const { handleClick } = this.props
      handleClick()
   }

   render() {
      const {
         workflows,
         workflowFetchingStatus,
         createProjectFetchingStataus
      } = this.props
      const workflowValues = workflows.map(workflow => workflow.name) || []
      const projectTypeValues = [
         i18n.classicSoftware,
         i18n.financialSoftware,
         i18n.crmSoftware
      ]
      const workFlowsDropdownPlaceholder =
         workflowFetchingStatus === API_SUCCESS
            ? i18n.selectProjectPlaceholder
            : workflowFetchingStatus === API_INITIAL || API_FETCHING
            ? i18n.loading
            : i18n.somethingWentWrong

      return (
         <CreateProjectWrapper>
            <CreateProjectHeader>
               <Typo18BoldHKGroteskRegular>
                  {i18n.createHeading}
               </Typo18BoldHKGroteskRegular>
               <CloseButton
                  height={'20px'}
                  width={'20px'}
                  path={i18n.closeButtonSrc}
                  handleClick={this.handleClose}
                  testId={'close'}
               />
            </CreateProjectHeader>
            <ProjectDetails>
               <UserTextInputField
                  labelText={i18n.nameOfProject}
                  onChange={this.handleTitleChange}
                  hasError={this.projectNameFieldHasError}
                  errorMessage={this.projectNameErrorMessage}
                  validate={this.handleTitleChange}
                  value={this.projectData.projectName}
                  testId={i18n.createProjectNameTestId}
                  width={'100%'}
               />

               <UserTextareaInput
                  label={i18n.description}
                  width={'100%'}
                  onChange={this.handleDescriptionChange}
                  hasError={this.projectDescriptionHasError}
                  errorMessage={this.projectDescriptionErrorMessage}
                  validate={this.handleDescriptionChange}
                  value={this.projectData.description}
                  testId={i18n.projectDescriptionTestId}
               />
               <DropdownWrapper>
                  <Dropdown
                     values={workflowValues}
                     label={i18n.workflowType}
                     handleChange={this.handleWorkflowDropdownChange}
                     handleFocus={this.handleWorkflowDropdownChange}
                     errorMessage={this.projectWorkflowError}
                     placeholder={workFlowsDropdownPlaceholder}
                     disabled={
                        workflowFetchingStatus === API_SUCCESS ? false : true
                     }
                     testId={'workflow-dropdown'}
                  />
               </DropdownWrapper>
               <DropdownWrapper>
                  <Dropdown
                     values={projectTypeValues}
                     label={i18n.projectType}
                     handleChange={this.handleProjectTypeDropdown}
                     errorMessage={this.projectTypeError}
                     placeholder={i18n.selectType}
                     handleFocus={this.handleProjectTypeDropdown}
                     testId={'project-type'}
                  />
               </DropdownWrapper>
               <CreateButtonWrapper>
                  <CommonButton
                     buttonValue={i18n.createFinal}
                     height={'40px'}
                     width={'100%'}
                     handleClick={this.handleSubmit}
                     apiStatus={createProjectFetchingStataus}
                     isDisabled={!this.isValidated}
                  />
                  <Typo12NeonRedHKGroteskRegular>
                     {createProjectFetchingStataus === API_FAILED
                        ? i18n.somethingWentWrong
                        : ''}
                  </Typo12NeonRedHKGroteskRegular>
               </CreateButtonWrapper>
            </ProjectDetails>
         </CreateProjectWrapper>
      )
   }
}
export { CreateProject }
