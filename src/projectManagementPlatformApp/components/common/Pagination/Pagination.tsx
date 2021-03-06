import React, { MouseEvent } from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import ReactPaginate from 'react-paginate'

import i18n from '../../../../i18n/strings.json'
import Avatar from '../../../../Common/components/Avatar/Avatar'

import { PaginationWrapper } from './styledComponent'

type PaginationProps = {
   handlePaginationButtons: Function
   hide: boolean
   currentPageNumber: number
   totalPages: number
}
@observer
class Pagination extends React.Component<PaginationProps> {
   @observable count = 0
   handleClick = (event: any) => {
      let selectedPage = event.selected
      const { handlePaginationButtons } = this.props
      this.count = this.count + 1
      if (this.count !== 1) {
         handlePaginationButtons(selectedPage + 1)
      }
   }
   render() {
      const { currentPageNumber, totalPages, hide } = this.props
      const totalPageCount = totalPages
      const currentPage = currentPageNumber

      return (
         <PaginationWrapper data-testid={i18n.paginationTestId} hide={hide}>
            <ReactPaginate
               breakLabel={'...'}
               pageCount={totalPageCount}
               previousLabel={
                  <Avatar
                     path={i18n.paginationLeftArrowUrl}
                     height={'22px'}
                     width={'15px'}
                  />
               }
               nextLabel={
                  <Avatar
                     path={i18n.paginationRightArrowUrl}
                     height={'22px'}
                     width={'15px'}
                  />
               }
               initialPage={0}
               pageRangeDisplayed={2}
               marginPagesDisplayed={2}
               onPageChange={this.handleClick}
               containerClassName={'pagination'}
               subContainerClassName={'pages pagination'}
               activeClassName={'active'}
               breakClassName={'break-me'}
               forcePage={currentPage - 1}
            />
         </PaginationWrapper>
      )
   }
}
export { Pagination }
