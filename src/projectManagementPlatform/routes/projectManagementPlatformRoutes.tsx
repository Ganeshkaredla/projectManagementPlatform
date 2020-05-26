import React from 'react'
import ProtectedRoute from '../../authentication/routes/authenticationRoutes'
import ProjectManagementPlatform from '../components/ProjectManagementPlatform/index'
const projectManagementPlatformRoutes = (
   <ProtectedRoute exact path='' component={ProjectManagementPlatform} />
)
export default projectManagementPlatformRoutes

//  /project-management-platform/login/v1