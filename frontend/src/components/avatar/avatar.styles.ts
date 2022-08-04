import { PositionBase } from 'components/common.styles'
import styled from 'styled-components'


export const AvatarContainer = styled.div`
    background-color:#EAEAEA;

    ${PositionBase}

    border-radius: 50%;

    overflow:hidden;
    // 2016: stupid webkit bug [http://stackoverflow.com/questions/5736503/how-to-make-css3-rounded-corners-hide-overflow-in-chrome-opera]
    -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);

    width:50px;
    height:50px;

    .avatar-letter {
        text-transform: uppercase;
        position:absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        color: rgba(33,33,33,0.4);
        font-weight:700;
        z-index: 500;
        font-size:35px;
    }

    .avatar-image {
        width:100%;
        height:100%;
        z-index: 501;
        position:absolute;
        left:0;
        top:0;
    }

    .avatar-image-error {
        display: none;
        height: 0;
        width: 0;
    }
`