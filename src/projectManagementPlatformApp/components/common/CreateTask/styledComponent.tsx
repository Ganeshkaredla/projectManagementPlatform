import styled from '@emotion/styled'
import { Colors } from '../../../../themes/Colors'

const CreateTaskWrapper = styled.div`
   display: flex;
   flex-direction: column;
   width: 30%;
   min-height: 70vh;
   border: 1px solid ${Colors.lightBlueGrey};
   border-radius: 6px;
   padding-left: 30px;
   padding-right: 30px;
   background-color: ${Colors.white};
`
const CreateTaskHeader = styled.div`
   display: flex;
   height: 40px;
   justify-content: space-between;
   background-color: ${Colors.white};
   color: ${Colors.steel};
   padding: 10px;
   padding-bottom: 40px;
   border-bottom: 0.8px solid ${Colors.lightBlueGrey};
`
const TaskDetails = styled.form`
   display: flex;
   flex-direction: column;
   padding: 10px;
`
const DropdownWrapper = styled.div`
   margin-top: 8px;
   margin-bottom: 6px;
`
const CreateButtonWrapper = styled.div`
   display: flex;
   flex-direction: column;
   margin-top: 20px;
   height: 100%;
   justify-content: center;
`
export {
   CreateTaskWrapper,
   CreateButtonWrapper,
   CreateTaskHeader,
   TaskDetails,
   DropdownWrapper
}
