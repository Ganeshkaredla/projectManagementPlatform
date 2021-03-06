import styled from '@emotion/styled'
import { Colors } from '../../../../themes/Colors'

export const MemberWrapper = styled.div`
   min-height: 80vh;
   width: 100%;
`
export const MemberHeader = styled.div`
   display: flex;
   width: 100%;
   justify-content: space-between;
   padding-left: 80px;
   padding-right: 80px;
   padding-top: 30px;
   padding-bottom: 30px;
`

export const TasksWrapper = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   width: 100%;
   height: 500px;
`
export const CreateTaskWrapper = styled.div<{ hide: any }>`
   display: ${props => (props.hide ? 'flex' : 'none')};
   justify-content: center;
   align-items: center;
   position: absolute;
   z-index: 20;
   top: 0;
   width: 100%;
   height: 100vh;
   background-color: ${props => (props.hide ? Colors.black60 : 'inherit')};
`
export const ProjectTaskHeader = styled.div`
   display: flex;
   width: 100%;
   justify-content: space-between;
   padding-left: 80px;
   padding-right: 80px;
   padding-top: 30px;
   padding-bottom: 30px;
`
export const PaginationWrapper = styled.div<{ backgroundColor: boolean }>``
