export type NavigatorParams = {
    Home: undefined;
    NewStory: undefined;
    ViewStory: {id: string};
    Signin: undefined;
    Signup: undefined;
}

export type AuthContextType = any

export type Story = {
    id: string,
    user: string,
    time: string,
    header: string,
    body: string,
    image: string,
}

export type User = {
    name: string,
    password: string
}


export type ActiveUser = {
    name: string
}