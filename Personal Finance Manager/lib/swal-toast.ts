"use client"

import Swal from "sweetalert2"

type Icon = "success" | "error" | "warning" | "info" | "question"

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer)
    toast.addEventListener("mouseleave", Swal.resumeTimer)
  },
})

export function swalToast(title: string, icon: Icon = "success", opts?: { timer?: number }) {
  return Toast.fire({ title, icon, timer: opts?.timer })
}
