export type NavigatorParams = {
    Home: undefined;
    NewStory: {img: string, storyId?:string};
    ViewStory: {id: string};
    Camera: {storyId: string};
}

export type Story = {
    id: string,
    time: string,
    header: string,
    body?: string,
    image?: string,
    imageName?: string
}

