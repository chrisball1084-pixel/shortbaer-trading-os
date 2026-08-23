import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./routine.css";
import "./updates.css";
import { StoreProvider } from "@/lib/store";
import { PwaRegister } from "@/components/pwa-register";

export const metadata: Metadata = { title:"ShortBär Trading OS", description:"System statt Intuition – persönlicher Trading-Workflow.", applicationName:"ShortBär Trading OS", appleWebApp:{ capable:true, statusBarStyle:"black-translucent", title:"ShortBär" }, formatDetection:{ telephone:false } };
export const viewport: Viewport = { width:"device-width", initialScale:1, maximumScale:1, viewportFit:"cover", themeColor:"#07111f" };

export default function RootLayout({ children }:{ children:React.ReactNode }) {
  return <html lang="de"><body style={{fontFamily:'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'}}><StoreProvider>{children}</StoreProvider><PwaRegister/></body></html>;
}
