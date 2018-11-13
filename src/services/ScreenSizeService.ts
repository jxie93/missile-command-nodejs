export class ScreenSizeService {

    public static canvasWidth: number = 1
    public static canvasHeight: number = 1

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