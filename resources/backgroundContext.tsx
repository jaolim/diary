import { createContext, useState } from "react";

import { BackgroundContextType } from "./customTypes";

export const BackgroundContext = createContext<BackgroundContextType>(null);

export const BackgroundProvider = ({ children }: any) => {
  const [background, setBackground] = useState<any>(null);
  const backupUrl = 'https://apod.nasa.gov/apod/image/1609/HilbornLDN1251D1024px.jpg'

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

  return (
    <BackgroundContext.Provider value={{ background, fetchBackground }}>
      {children}
    </BackgroundContext.Provider>
  )
}