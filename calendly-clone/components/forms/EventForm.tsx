'use client'

import { useForm } from "react-hook-form"
import z from "zod"

export default function EventForm({
    event,
        
} : {
    event?:{
        id : string,
        name : string , 
        description : string,
        durationInMinutes : number,
        isActive : boolean
    }
}){
    const form = useForm<z.infer<typeof eventFormSchema>>()
}