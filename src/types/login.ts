export interface LoginResponse {
    token: string
    refreshToken: string
    user_id: string
}

export interface Login {
    email: string
    password: string
}