/* eslint-disable @typescript-eslint/no-unused-vars */ 
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Mail, KeyRound, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "next-intl" 

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [email, setEmail] = useState("") 
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const t = useTranslations("ForgotPassword") 

  const emailSchema = z.object({
    email: z.string().email({ message: t("validation.email") }),
  })

  const codeSchema = z.object({
    resetCode: z.string().min(1, { message: t("validation.code") }),
  })

  const passwordSchema = z.object({
    newPassword: z.string().min(6, { message: t("validation.password") }),
  })

  const emailForm = useForm<z.infer<typeof emailSchema>>({ resolver: zodResolver(emailSchema) })
  const codeForm = useForm<z.infer<typeof codeSchema>>({ resolver: zodResolver(codeSchema) })
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({ resolver: zodResolver(passwordSchema) })

  async function onEmailSubmit(values: z.infer<typeof emailSchema>) {
    setIsLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgotPasswords`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      
      if (data.statusMsg === "success") {
        toast.success(data.message || t("messages.codeSent"))
        setEmail(values.email)
        setStep(2)
      } else {
        toast.error(data.message || t("messages.failedToSend"))
      }
    } catch (error) {
      toast.error(t("messages.genericError"))
    } finally {
      setIsLoading(false)
    }
  }

  async function onCodeSubmit(values: z.infer<typeof codeSchema>) {
    setIsLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verifyResetCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data = await res.json()

      if (data.status === "Success") {
        toast.success(t("messages.verified"))
        setStep(3)
      } else {
        toast.error(data.message || t("messages.invalidCode"))
      }
    } catch (error) {
      toast.error(t("messages.genericError"))
    } finally {
      setIsLoading(false)
    }
  }

  async function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    setIsLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resetPassword`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: values.newPassword }),
      })
      const data = await res.json()

      if (data.token) {
        toast.success(t("messages.resetSuccess"))
        router.push("/login")
      } else {
        toast.error(data.message || t("messages.resetFailed"))
      }
    } catch (error) {
      toast.error(t("messages.genericError"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <div className="flex justify-center mb-2">
                 <div className="p-3 bg-primary/10 rounded-full text-primary"><Mail /></div>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">{t("step1Title")}</h1>
              <p className="text-sm text-muted-foreground">
                {t("step1Desc")}
              </p>
            </div>

            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full font-bold" type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("sendCode")}
                </Button>
              </form>
            </Form>
            <Button variant="link" className="w-full" onClick={() => router.push("/login")}>
               <ArrowLeft className="mr-2 h-4 w-4 rtl:rotate-180" /> {t("backToLogin")}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <div className="flex justify-center mb-2">
                 <div className="p-3 bg-primary/10 rounded-full text-primary"><KeyRound /></div>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">{t("step2Title")}</h1>
              <p className="text-sm text-muted-foreground">
                {t("step2Desc")} <span className="font-bold text-foreground">{email}</span>. {t("step2DescSuffix")}
              </p>
            </div>

            <Form {...codeForm}>
              <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="space-y-4">
                <FormField
                  control={codeForm.control}
                  name="resetCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                            placeholder={t("codePlaceholder")}
                            className="text-center text-lg tracking-widest" 
                            {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full font-bold" type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("verifyCode")}
                </Button>
              </form>
            </Form>
            <Button variant="link" className="w-full text-muted-foreground" onClick={() => setStep(1)}>
               {t("changeEmail")}
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <div className="flex justify-center mb-2">
                 <div className="p-3 bg-green-100 rounded-full text-green-600"><CheckCircle2 /></div>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">{t("step3Title")}</h1>
              <p className="text-sm text-muted-foreground">
                {t("step3Desc")}
              </p>
            </div>

            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("newPassword")}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full font-bold" type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4 rtl:rotate-180" />}
                  {t("resetBtn")}
                </Button>
              </form>
            </Form>
          </div>
        )}

      </div>
    </div>
  )
}