"use client";
import { useEffect } from "react";
export function PwaRegister(){useEffect(()=>{const basePath=process.env.NEXT_PUBLIC_BASE_PATH??"";if("serviceWorker" in navigator&&process.env.NODE_ENV==="production")navigator.serviceWorker.register(`${basePath}/sw.js`,{scope:`${basePath}/`}).catch(()=>undefined)},[]);return null}
