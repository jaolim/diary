export type NavigatorParams = {
    Home: undefined;
    NewStory: undefined;
    ViewStory: {id: string};
}

export type Story = {
    id: string,
    time: string,
    header: string,
    body?: string,
    image?: string,
    imageName?: string
}

