import styled, { css } from 'styled-components'
import { DEFAULT_GRAY_BORDER, DEFAULT_GRAY_BACKGROUND, DEFAULT_BLACK_TRANSPARENT, DEFAULT_BLACK } from 'lib/styles/colors'
import { Link } from 'react-router-dom'


export const PositionBase = css`
    position: relative;
    top: 0;
    left: 0;
`

export const NoUnderlineEver = css`
    text-decoration: none;
    &:hover,
    &:active,
    &:focus,
    &:visited {
        text-decoration: none;
    }
`

export const DefaultItemContainer = css`
    border: 1px solid ${DEFAULT_GRAY_BORDER};
    background-color:${DEFAULT_GRAY_BACKGROUND};    
`

export const PrettyClickable = css`
    cursor: pointer;

    color: ${DEFAULT_BLACK_TRANSPARENT};
    &:hover,
    &:focus {
        color: ${DEFAULT_BLACK};
    }

    &:visited {
        color: ${DEFAULT_BLACK_TRANSPARENT};
    }
`

export const PrettyClickableDiv = styled.div`
    ${PrettyClickable}
`

export const PrettyClickableSpan = styled.span`
    ${PrettyClickable}
`

export const PrettyClickableAnchor = styled.a`
    ${PrettyClickable}
    ${NoUnderlineEver}
`

export const PrettyClickableLink = styled(Link)`
    ${PrettyClickable}
    ${NoUnderlineEver}
`


export const NiceRedBadge = styled.span.attrs({ className: 'nice-red-badge' })`
    position: absolute;
    top: -14px;
    right: -14px;
    width: 40px;
    font: 14px/40px Helvetica, Arial, sans-serif;
    color: white;
    text-align: center;
    text-shadow: 0 -1px 1px rgba(black, .3);
    text-indent: -1px;
    letter-spacing: -1px;
    background: #e54930;
    border: 1px solid;
    border-color: #b33323 #ab3123 #982b1f;
    border-radius: 50%;
    user-select: none;
    background-image: linear-gradient(to bottom, #f75a3b, #d63b29);
    box-shadow: inset 0 1px 1px rgba(white, .3), 0 1px 2px rgba(black, .2);

    &:before {
    content: '';
    position: absolute;
    top: 3px;
    bottom: 3px;
    left: 3px;
    right: 3px;
    border: 2px solid #f5f8fb;
    border-radius: 18px;
    box-shadow: inset 0 1px 1px rgba(white, .2), inset 0 -1px 1px rgba(black, .25), 0 -1px 1px rgba(black, .25);
`

export const InlineList = styled.ul.attrs({ className: 'list-inline' })``
export const InlineListItem = styled.li.attrs({ className: 'list-inline-item' })``
export const UnstyledList = styled.ul.attrs({ className: 'list-unstyled' })``

