import type { ReactNode, SelectHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
export function PageHeader({eyebrow,title,description,action}:{eyebrow?:string;title:string;description:string;action?:ReactNode}){return <div className="page-header"><div>{eyebrow&&<span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1><p>{description}</p></div>{action}</div>}
export function Card({children,className=""}:{children:ReactNode;className?:string}){return <section className={`card ${className}`}>{children}</section>}
export function SectionTitle({children,meta}:{children:ReactNode;meta?:string}){return <div className="section-title"><h2>{children}</h2>{meta&&<span>{meta}</span>}</div>}
export function Badge({children,tone="neutral"}:{children:ReactNode;tone?:"green"|"yellow"|"red"|"neutral"|"blue"}){return <span className={`badge ${tone}`}>{children}</span>}
export function Field({label,children,hint}:{label:string;children:ReactNode;hint?:string}){return <label className="field"><span>{label}</span>{children}{hint&&<small>{hint}</small>}</label>}
export function Input(props:InputHTMLAttributes<HTMLInputElement>){return <input {...props}/>}
export function Select(props:SelectHTMLAttributes<HTMLSelectElement>){return <select {...props}/>}
export function Textarea(props:TextareaHTMLAttributes<HTMLTextAreaElement>){return <textarea {...props}/>}
export function Empty({children}:{children:ReactNode}){return <div className="empty">{children}</div>}
export const toneForLight=(v:string)=>v==="green"?"green":v==="red"?"red":"yellow";
