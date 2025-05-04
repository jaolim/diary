import { createContext, useState } from "react";

import { BackgroundContextType } from "./customTypes";

export const BackgroundContext = createContext<BackgroundContextType>(null);

export const BackgroundProvider = ({ children }: any) => {
  // variable for storing the background image url
  const [background, setBackground] = useState<any>(null);
  // backup background image url for when fetch is not succesful
  const backupUrl = 'https://apod.nasa.gov/apod/image/1609/HilbornLDN1251D1024px.jpg'

  // tries to fetch a random image's url from NASA's space image service, and if not succesful, uses a hard coded one
  const fetchBackground = async () => {
    const url = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&count=1'
    const fetchConfig = {
      method: 'GET'
    }
    const response = await fetch(url, fetchConfig)
    if (!response.ok) {
      setBackground(backupUrl)
      throw new Error(response.status.toString());
    }
    const data = await response.json();
    setBackground(data[0].url);
  }

  // context for using the provided background and fetching a new one
  return (
    <BackgroundContext.Provider value={{ background, fetchBackground }}>
      {children}
    </BackgroundContext.Provider>
  )
}