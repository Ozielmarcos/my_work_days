export interface LoginResponse {
    token: string
    refresh_token: string
    user_id: string
}

export interface Login {
    email: string
    password: string
}