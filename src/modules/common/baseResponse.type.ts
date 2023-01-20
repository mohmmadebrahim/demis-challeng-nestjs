export declare interface IBaseResponse<T> {
    status: boolean
    message?: string | any
    body?: T
}
