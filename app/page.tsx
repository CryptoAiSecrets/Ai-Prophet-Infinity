import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to dashboard immediately
  redirect("/dashboard")

  // This return is just for TypeScript, it will never be rendered
  return null
}

