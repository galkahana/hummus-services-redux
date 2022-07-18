declare module 'hummus-reports' {
    export class PDFEngine {
        constructor(paths: ExternalsMap)
        generatePDF(document: PDFEngineDocument, outputStream: import('hummus').WriterStream, writerOptions?: import('hummus').WriterOptions): void
    }

    export type ExternalsMap = {[key:string]: string|string[]}

    export type PDFEngineDocument = {
        pages: PDFEnginePage[]
        protection?: PDFEngineProtection
        source?: string
    }

    export enum PDFEngineProtectionPermission {
        AllowPrint = 'allowPrint',
        AllowModification = 'allowModification',
        AllowCopy = 'allowCopy',
        AllowAnnotations = 'allowAnnotations',
        AllowFilling = 'allowFilling',
        AllowAccessibility = 'allowAccessibility',
        AllowAssemble = 'allowAssemble',
        AllowPrintHighRes = 'allowPrintHighRes'
    }

    export type PDFEngineProtection = {
        userPassword: string
        ownerPassword?: string
        userProtectionFlag: number | PDFEngineProtectionPermission[]
    }

    export type PDFEnginePage = PDFEngineNewPage | PDFEngineModifiedPage | PDFEngineAppendPage

    export type PDFEngineNewPage = {
        width: number
        height: number
        boxes?: PDFEngineBox
    }

    export type PDFEngineModifiedPage = {
        modifiedForm: number
        boxes?: PDFEngineBox
    }
    
    export type PDFEngineAppendPage = {
        appendedFrom: {
            source: string
            index?: 'all' | number
            endIndex?: number,
            password?: string
        }
    }

    export enum PDFEngineAlignment {
        Left =  'left',
        Right = 'right',
        Center = 'center'
    }

    export type BoxId = string

    export type PDFEnginBoxAnchor = {
        box: BoxId
        offset: number
    }

    export type PDFEngineBox = PDFEngineBoxText | PDFEngineBoxImage | PDFEngineBoxShape | PDFEngineBoxStream | PDFEngineBoxMultiple

    type PDFEngineBoxBaseNoPosition = {
        left: number | PDFEnginBoxAnchor
        id?: BoxId
        origin?: 'pageTop'
        alignment?: PDFEngineAlignment
        width?: number
        height?: number
    }

    type PDFEngineBoxBottomBase = PDFEngineBoxBaseNoPosition & {
        bottom: number
    }

    type PDFEngineBoxTopBase = PDFEngineBoxBaseNoPosition & {
        top: number | PDFEnginBoxAnchor
    }

    type PDFEngineBoxBase = PDFEngineBoxBottomBase | PDFEngineBoxTopBase

    export enum PDFEngineCSSColor {
        aliceblue = 'aliceblue',
        antiquewhite = 'antiquewhite',
        aqua = 'aqua',
        aquamarine = 'aquamarine',
        azure = 'azure',
        beige = 'beige',
        bisque = 'bisque',
        black = 'black',
        blanchedalmond = 'blanchedalmond',
        blue = 'blue',
        blueviolet = 'blueviolet',
        brown = 'brown',
        burlywood = 'burlywood',
        cadetblue = 'cadetblue',
        chartreuse = 'chartreuse',
        chocolate = 'chocolate',
        coral = 'coral',
        cornflowerblue = 'cornflowerblue',
        cornsilk = 'cornsilk',
        crimson = 'crimson',
        cyan = 'cyan',
        darkblue = 'darkblue',
        darkcyan = 'darkcyan',
        darkgoldenrod = 'darkgoldenrod',
        darkgray = 'darkgray',
        darkgreen = 'darkgreen',
        darkkhaki = 'darkkhaki',
        darkmagenta = 'darkmagenta',
        darkolivegreen = 'darkolivegreen',
        darkorange = 'darkorange',
        darkorchid = 'darkorchid',
        darkred = 'darkred',
        darksalmon = 'darksalmon',
        darkseagreen = 'darkseagreen',
        darkslateblue = 'darkslateblue',
        darkslategray = 'darkslategray',
        darkturquoise = 'darkturquoise',
        darkviolet = 'darkviolet',
        deeppink = 'deeppink',
        deepskyblue = 'deepskyblue',
        dimgray = 'dimgray',
        dodgerblue = 'dodgerblue',
        firebrick = 'firebrick',
        floralwhite = 'floralwhite',
        forestgreen = 'forestgreen',
        fuchsia = 'fuchsia',
        gainsboro = 'gainsboro',
        ghostwhite = 'ghostwhite',
        gold = 'gold',
        goldenrod = 'goldenrod',
        gray = 'gray',
        green = 'green',
        greenyellow = 'greenyellow',
        honeydew = 'honeydew',
        hotpink = 'hotpink',
        indianred = 'indianred',
        indigo = 'indigo',
        ivory = 'ivory',
        khaki = 'khaki',
        lavender = 'lavender',
        lavenderblush = 'lavenderblush',
        lawngreen = 'lawngreen',
        lemonchiffon = 'lemonchiffon',
        lightblue = 'lightblue',
        lightcoral = 'lightcoral',
        lightcyan = 'lightcyan',
        lightgoldenrodyellow = 'lightgoldenrodyellow',
        lightgray = 'lightgray',
        lightgreen = 'lightgreen',
        lightpink = 'lightpink',
        lightsalmon = 'lightsalmon',
        lightseagreen = 'lightseagreen',
        lightskyblue = 'lightskyblue',
        lightslategray = 'lightslategray',
        lightsteelblue = 'lightsteelblue',
        lightyellow = 'lightyellow',
        lime = 'lime',
        limegreen = 'limegreen',
        linen = 'linen',
        magenta = 'magenta',
        maroon = 'maroon',
        mediumaquamarine = 'mediumaquamarine',
        mediumblue = 'mediumblue',
        mediumorchid = 'mediumorchid',
        mediumpurple = 'mediumpurple',
        mediumseagreen = 'mediumseagreen',
        mediumslateblue = 'mediumslateblue',
        mediumspringgreen = 'mediumspringgreen',
        mediumturquoise = 'mediumturquoise',
        mediumvioletred = 'mediumvioletred',
        midnightblue = 'midnightblue',
        mintcream = 'mintcream',
        mistyrose = 'mistyrose',
        moccasin = 'moccasin',
        navajowhite = 'navajowhite',
        navy = 'navy',
        oldlace = 'oldlace',
        olive = 'olive',
        olivedrab = 'olivedrab',
        orange = 'orange',
        orangered = 'orangered',
        orchid = 'orchid',
        palegoldenrod = 'palegoldenrod',
        palegreen = 'palegreen',
        paleturquoise = 'paleturquoise',
        palevioletred = 'palevioletred',
        papayawhip = 'papayawhip',
        peachpuff = 'peachpuff',
        peru = 'peru',
        pink = 'pink',
        plum = 'plum',
        powderblue = 'powderblue',
        purple = 'purple',
        red = 'red',
        rosybrown = 'rosybrown',
        royalblue = 'royalblue',
        saddlebrown = 'saddlebrown',
        salmon = 'salmon',
        sandybrown = 'sandybrown',
        seagreen = 'seagreen',
        seashell = 'seashell',
        sienna = 'sienna',
        silver = 'silver',
        skyblue = 'skyblue',
        slateblue = 'slateblue',
        slategray = 'slategray',
        snow = 'snow',
        springgreen = 'springgreen',
        steelblue = 'steelblue',
        tan = 'tan',
        teal = 'teal',
        thistle = 'thistle',
        tomato = 'tomato',
        turquoise = 'turquoise',
        violet = 'violet',
        wheat = 'wheat',
        white = 'white',
        whitesmoke = 'whitesmoke',
        yellow = 'yellow',
        yellowgreen = 'yellowgreen',
        empty = ''
    }

    export enum PDFEngineColorspace  {
        RGB = 'rgb',
        CMYK = 'cmyk',
        Gray = 'gray'
    }

    export enum PDFEngineDirection { 
        LRT = 'ltr',
        RTL = 'rtl'
    }

    export type PDFEngineBoxText = PDFEngineBoxBase & {
        text: PDFEngineTextItem
    }

    export type PDFEngineTextItem = {
        text: string
        options: {
            size: number
            fontSource: string
            fontIndex?: number
            color: string | number | PDFEngineCSSColor
            colorspace?: PDFEngineColorspace
            direction: PDFEngineDirection
            underline?: boolean
        }
        link?: string    
    }

    export type PDFEngineBoxImage = PDFEngineBoxBase & {
        image: PDFEngineImageItem
    }   
    
    export enum PDFEngineFitMode {
        Overflow = 'overflow',
        Always = 'always'
    }

    export type PDFEngineImageItem = {
        source: string,
        index?: number,
        transformation?: [number, number, number, number, number, number] | {
            width?: number
            height?: number
            proportional?: boolean
            fit?: PDFEngineFitMode
        }
        link?: string
    }

    export type PDFEngineBoxShape = PDFEngineBoxBase & {
        shape: PDFEngineShapeItem
    }     

    export enum PDFShapeType  {
        Stroke = 'stroke',
        Fill = 'fill'
    }

    export type PDFEngineShapeItem = PDFEngineShapeItemRectangle | PDFEngineShapeItemSquare | PDFEngineShapeItemCircle | PDFEngineShapeItemPath

    type PDFEngineShapeItemBase = {
        options: {
            type?: PDFEngineShapeType
            color: string | number | PDFEngineCSSColor
            colorspace?: PDFEngineColorspace
            width?: number
            close?: boolean
        }
    }

    export type PDFEngineShapeItemRectangle = PDFEngineShapeItemBase & {
        method: 'rectangle'
        width: number
        height: number
    }    

    export type PDFEngineShapeItemSquare = PDFEngineShapeItemBase & {
        method: 'square'
        width: number
    }    

    export type PDFEngineShapeItemCircle = PDFEngineShapeItemBase & {
        method: 'circle'
        radius: number
    }    

    export type PDFEngineShapeItemPath = PDFEngineShapeItemBase & {
        method: 'path'
        radius: number[]
    } 
    
    export type PDFEngineBoxMultiple = PDFEngineBoxBase & {
        items: PDFEngineItem[]
    }

    export type PDFEngineItemNoStream = (PDFEngineImageItem & {
        type: 'image'
    }) | 
    (PDFEngineTextItem & {
        type: 'text'
    }) | 
    (PDFEngineShapeItem & {
        type: 'shape'
    })

    export type PDFEngineItem = PDFEngineItemNoStream | 
    (PDFEngineStreamItem & {
        type: 'stream'
    })

    export type PDFEngineBoxStream = PDFEngineBoxBase & {
        stream: PDFEngineStreamItem
    }

    export type PDFEngineStreamItem = {
        items : (PDFEngineItemNoStream | Omit<PDFEngineBox, 'top'|'bottom'|'left'>)[],
        leading?: number,
        direction?: PDFEngineDirection
    }

}

