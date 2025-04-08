export type NavigatorParams = {
    Home: undefined;
    NewStory: undefined;
}

export type Story = {
    id: number,
    time: string,
    header: string,
    body?: string,
}