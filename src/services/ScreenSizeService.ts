export class ScreenSizeService {

    public static canvasWidth?: number
    public static canvasHeight?: number

    public static screenWidth(): number {
        return window.innerWidth
    }

    public static screenHeight(): number {
        return window.innerHeight
    }

    public static ratio(): number {
        return window.devicePixelRatio
    }

}