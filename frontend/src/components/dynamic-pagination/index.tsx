import React, { useEffect, useState } from 'react'
import Pagination from 'react-bootstrap/Pagination'


type DynamicPaginationProps = {
    page: number,
    itemsCount: number, 
    itemsPerPage: number,
    simplePagesListLimit: number,
    onPageChange: (newPage: number) => void
}


/**
 * A Component to generate paging UI. It shows 2 kinds of paging uis per Pages count (ceil(itemsCount/itemsPagePage)) and simplePagesListLimit.
 * The simpler why, when pages count is below simplePagesListLimit, just shows paging buttons one next to each other, each showing the page number.
 * The more complex one shows first, last, prev, next and a few paging buttons in the middle, and is meant for when there's many pages to show and
 * placing all those buttons is too much. it will at max show 9 buttons (including first, last next prev), hiding the pages buttons not shown with elipsis
 */
const DynamicPagination = ({ page, itemsCount, itemsPerPage, simplePagesListLimit, onPageChange }: DynamicPaginationProps) => {
    const [ anchorPage, setAnchorPage ] = useState(page)

    useEffect(() => {
        if (page>=anchorPage-2 && page<=anchorPage+2)
            return
        setAnchorPage(page)
    }, [ page, anchorPage, setAnchorPage ])

    const pagesListLength = Math.ceil(itemsCount/itemsPerPage)

    return <Pagination>
        {pagesListLength > simplePagesListLimit ? (
            <>
                <Pagination.First disabled={page === 0} onClick={()=>onPageChange(0)}/>
                <Pagination.Prev disabled={page === 0} onClick={()=>onPageChange(page - 1)}/>
                {anchorPage > 2 && (
                    <>
                        <Pagination.Item onClick={()=>onPageChange(0)}>{1}</Pagination.Item>
                        <Pagination.Ellipsis disabled/>
                    </>
                )}
                {anchorPage > 1 && (
                    <Pagination.Item active={page === anchorPage - 2} onClick={()=>onPageChange(anchorPage - 2)}>{anchorPage - 1}</Pagination.Item>
                )}
                {anchorPage > 0 && (
                    <Pagination.Item active={page === anchorPage - 1}  onClick={()=>onPageChange(anchorPage - 1)}>{anchorPage}</Pagination.Item>
                )}
                <Pagination.Item active={page === anchorPage} onClick={()=>onPageChange(anchorPage)}>{anchorPage+1}</Pagination.Item>
                {(anchorPage < pagesListLength - 1) && (

                    <Pagination.Item active={page === anchorPage + 1} onClick={()=>onPageChange(anchorPage + 1)}>{anchorPage + 2}</Pagination.Item>
                )}
                {(anchorPage < pagesListLength - 2) && (
                    <Pagination.Item active={page === anchorPage + 2} onClick={()=>onPageChange(anchorPage + 2)}>{anchorPage + 3}</Pagination.Item>
                )}
                {(anchorPage < pagesListLength - 3) && (
                    <>
                        <Pagination.Ellipsis disabled/>
                        <Pagination.Item onClick={()=>onPageChange(pagesListLength - 1)}>{pagesListLength}</Pagination.Item>
                    </>
                )}
                <Pagination.Next disabled={page === pagesListLength-1}  onClick={()=>onPageChange(page + 1)}/>
                <Pagination.Last disabled={page === pagesListLength-1}  onClick={()=>onPageChange(pagesListLength-1)} />
            </>
        ): Array.from({ length: pagesListLength }, (x, i) => i).map((i) =>
            <Pagination.Item key={i} active={page === i} onClick={()=>onPageChange(i)}>{i+1}</Pagination.Item>
        )
        }
    </Pagination>

}

export default DynamicPagination