"use client"

import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { Session } from "@supabase/supabase-js"
import {
  Signal, Wifi, BatteryFull, Bell, Wallet, ArrowDownRight, Zap,
  PiggyBank, Users, ArrowDownLeft, ArrowUpRight, Utensils, Bus,
  Coffee, ShoppingBag, Lock, FileText, ChevronRight, Plus, X, LogOut, Settings,
  Home, Edit3, Trash2, PlusCircle, CheckCircle2, QrCode, Calculator, Target, UploadCloud, File
} from "lucide-react"

// --- Types ---
type Expense = { id: number; amount: number; description: string; category: string; created_at: string; user_id: string }
type Split = { id: number; person_name: string; amount: number; description: string; is_owed_to_me: boolean; user_id: string }
type Saving = { id: number; goal_name: string; current_amount: number; target_amount: number; user_id: string }
type Bill = { id: string; name: string; amount: number; color: string }
type VaultFile = { name: string; created_at: string; id: string }

const BILL_COLORS = ["bg-blue-500", "bg-purple-500", "bg-yellow-500", "bg-pink-500", "bg-emerald-500", "bg-orange-500"]

/* -------------------------------------------------------------------------- */
/* AUTHENTICATION SCREEN                                                      */
/* -------------------------------------------------------------------------- */

function AuthScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [budget, setBudget] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    if (isSignUp) {
      if (!name || !budget) { alert("Please fill in your name and budget!"); setLoading(false); return; }
      const { error } = await supabase.auth.signUp({ 
        email, password,
        options: { data: { full_name: name, monthly_budget: parseFloat(budget), bills: [], upi_id: "" } }
      })
      if (error) alert(error.message)
      else alert("Account created! You are now logged in.")
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) alert(error.message)
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-[400px] rounded-[2rem] bg-background p-8 shadow-2xl">
        <div className="mb-8 flex justify-center"><div className="flex size-16 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground shadow-lg shadow-primary/30">₹</div></div>
        <h1 className="text-center text-2xl font-bold text-foreground">{isSignUp ? "Create Account" : "Welcome Back"}</h1>
        <form onSubmit={handleAuth} className="mt-8 space-y-4">
          {isSignUp && (
            <>
              <div><label className="text-xs font-medium text-muted-foreground">Full Name</label><input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-2xl bg-muted px-4 py-3 text-sm outline-none" placeholder="Aarav Sharma" /></div>
              <div><label className="text-xs font-medium text-muted-foreground">Monthly Pocket Money (₹)</label><input type="number" required value={budget} onChange={(e) => setBudget(e.target.value)} className="mt-1 w-full rounded-2xl bg-muted px-4 py-3 text-sm outline-none" placeholder="15000" /></div>
            </>
          )}
          <div><label className="text-xs font-medium text-muted-foreground">Email</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-2xl bg-muted px-4 py-3 text-sm outline-none" placeholder="student@college.edu" /></div>
          <div><label className="text-xs font-medium text-muted-foreground">Password</label><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-2xl bg-muted px-4 py-3 text-sm outline-none" placeholder="••••••••" /></div>
          <button type="submit" disabled={loading} className="mt-2 w-full rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition active:scale-[0.98]">{loading ? "Loading..." : isSignUp ? "Sign Up" : "Log In"}</button>
        </form>
        <button onClick={() => setIsSignUp(!isSignUp)} className="mt-6 w-full text-center text-sm font-medium text-primary hover:underline">{isSignUp ? "Already have an account? Log in" : "Need an account? Sign up"}</button>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* LIVE Status Bar & Header                                                   */
/* -------------------------------------------------------------------------- */

function StatusBar() {
  const [time, setTime] = useState("")

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-foreground">
      <span className="text-sm font-semibold tracking-tight">{time || "9:41"}</span>
      <div className="flex items-center gap-1.5"><Signal className="size-4" /><Wifi className="size-4" /><BatteryFull className="size-4" /></div>
    </div>
  )
}

function AppHeader({ name, onOpenSettings, onOpenVault }: { name: string; onOpenSettings: () => void; onOpenVault: () => void }) {
  return (
    <header className="flex items-center justify-between px-5 pt-2 pb-4">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-full bg-primary text-lg font-bold uppercase text-primary-foreground">{name ? name[0] : "A"}</div>
        <div className="leading-tight">
          <p className="text-xs font-medium text-muted-foreground">Good morning,</p>
          <p className="max-w-[150px] truncate text-base font-bold tracking-tight text-foreground">{name || "Student"}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onOpenVault} className="relative flex size-11 items-center justify-center rounded-full bg-card shadow-sm ring-1 ring-border transition active:scale-95 text-foreground hover:bg-muted"><Lock className="size-5" /></button>
        <button onClick={onOpenSettings} className="relative flex size-11 items-center justify-center rounded-full bg-card shadow-sm ring-1 ring-border transition active:scale-95 text-foreground hover:bg-muted"><Settings className="size-5" /></button>
      </div>
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/* Tiles                                                                      */
/* -------------------------------------------------------------------------- */

function MonthlySurvival({ expenses, budget, totalFixed }: { expenses: Expense[], budget: number, totalFixed: number }) {
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const LEFT = budget - totalFixed - totalSpent
  const spentPct = budget > 0 ? Math.min(Math.round(((totalFixed + totalSpent) / budget) * 100), 100) : 0

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-primary p-6 text-primary-foreground shadow-lg shadow-primary/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><span className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/15"><Wallet className="size-5" /></span><h2 className="text-sm font-semibold tracking-wide">Monthly Survival</h2></div>
        <span className="rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium">{new Date().toLocaleString('default', { month: 'short' })}</span>
      </div>
      <div className="mt-6 flex items-end justify-between gap-4">
        <div><p className="text-xs font-medium text-primary-foreground/70">Flexible Cash Left</p><p className="mt-1 font-mono text-4xl font-extrabold tracking-tight">₹{LEFT.toLocaleString()}</p></div>
        <div className="pb-1 text-right text-xs"><p className="text-primary-foreground/70">of ₹{budget.toLocaleString()}</p><p className="mt-0.5 font-semibold">{100 - spentPct}% free</p></div>
      </div>
      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-primary-foreground/20"><div className="h-full rounded-full bg-primary-foreground transition-all duration-1000" style={{ width: `${100 - spentPct}%` }} /></div>
    </section>
  )
}

function SafeToSpend({ expenses, budget, totalFixed }: { expenses: Expense[], budget: number, totalFixed: number }) {
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const left = budget - totalFixed - totalSpent
  const today = new Date(); const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  const daysLeft = lastDayOfMonth.getDate() - today.getDate() + 1
  const dailyLimit = Math.max(0, Math.floor(left / daysLeft))

  return (
    <section className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-accent p-5 text-accent-foreground shadow-lg shadow-accent/20">
      <div className="flex items-center gap-2"><span className="flex size-8 items-center justify-center rounded-full bg-accent-foreground/15"><Zap className="size-4" /></span><h2 className="text-sm font-semibold">Safe to Spend</h2></div>
      <div className="mt-4"><p className="font-mono text-3xl font-extrabold tracking-tight">₹{dailyLimit.toLocaleString()}</p><p className="mt-1 text-xs font-medium text-accent-foreground/80">Daily limit ({daysLeft} days)</p></div>
    </section>
  )
}

function MonthlyBillsTile({ bills, totalFixed, onOpenSheet }: { bills: Bill[], totalFixed: number, onOpenSheet: () => void }) {
  return (
    <section className="flex flex-col justify-between rounded-[2rem] bg-card p-5 shadow-sm ring-1 ring-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary"><Home className="size-4" /></span><h2 className="text-sm font-semibold text-foreground">Fixed Bills</h2></div>
        <button onClick={onOpenSheet} className="text-xs font-semibold text-primary flex items-center gap-1"><Edit3 className="size-3" /> Edit</button>
      </div>
      <p className="mt-3 text-xs font-medium text-muted-foreground">Total locked this month</p>
      <p className="mt-0.5 font-mono text-lg font-bold text-foreground">₹{totalFixed.toLocaleString()}</p>
      <div className="mt-3 flex gap-1 overflow-hidden rounded-full h-2.5 w-full bg-muted">
        {bills.map((bill) => (bill.amount > 0 && <div key={bill.id} className={`h-full ${bill.color}`} style={{ width: `${(bill.amount / totalFixed) * 100}%` }} />))}
      </div>
    </section>
  )
}

function MicroSavings({ savings, onOpenSheet }: { savings: Saving[], onOpenSheet: () => void }) {
  const activeGoal = savings[0] || { goal_name: "Set a goal!", current_amount: 0, target_amount: 1000 }
  const pct = Math.min(Math.round((activeGoal.current_amount / activeGoal.target_amount) * 100), 100)
  
  return (
    <section className="flex flex-col justify-between rounded-[2rem] bg-card p-5 shadow-sm ring-1 ring-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary"><PiggyBank className="size-4" /></span><h2 className="text-sm font-semibold text-foreground">Savings</h2></div>
        <button onClick={onOpenSheet} className="text-xs font-semibold text-primary flex items-center gap-1"><Edit3 className="size-3" /> Manage</button>
      </div>
      <p className="mt-3 text-xs font-medium text-muted-foreground">{activeGoal.goal_name}</p>
      <p className="mt-0.5 font-mono text-lg font-bold text-foreground">₹{activeGoal.current_amount.toLocaleString()} <span className="text-sm font-medium text-muted-foreground">/ ₹{activeGoal.target_amount.toLocaleString()}</span></p>
      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all duration-1000" style={{ width: `${pct}%` }} /></div>
    </section>
  )
}

function RoommateSplits({ splits, onSplitClick }: { splits: Split[], onSplitClick: (s: Split) => void }) {
  return (
    <section className="rounded-[2rem] bg-card p-5 shadow-sm ring-1 ring-border">
      <div className="flex items-center gap-2"><span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary"><Users className="size-4" /></span><h2 className="text-sm font-semibold text-foreground">Roommate Splits</h2></div>
      <ul className="mt-4 space-y-2.5">
        {splits.length === 0 ? <p className="text-xs text-muted-foreground">All squared up!</p> : splits.map((split) => (
          <li key={split.id} onClick={() => onSplitClick(split)} className="flex items-center justify-between rounded-2xl bg-primary/5 px-4 py-3 cursor-pointer transition active:scale-[0.98] hover:bg-primary/10">
            <div className="flex items-center gap-3">
              <span className={`flex size-9 items-center justify-center rounded-full ${split.is_owed_to_me ? 'bg-emerald-500/15 text-emerald-600' : 'bg-red-500/15 text-red-600'}`}>
                {split.is_owed_to_me ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-foreground">{split.is_owed_to_me ? `${split.person_name} owes you` : `You owe ${split.person_name}`}</p>
                <p className="text-xs text-muted-foreground">{split.description}</p>
              </div>
            </div>
            <span className={`font-mono text-sm font-bold ${split.is_owed_to_me ? 'text-emerald-600' : 'text-red-600'}`}>{split.is_owed_to_me ? '+' : '−'}₹{split.amount}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* SMART DATES FOR RECENT SPENDS                                              */
/* -------------------------------------------------------------------------- */

const getCategoryIcon = (category: string) => {
  switch (category) { case "Food": return Utensils; case "Travel": return Bus; case "Snacks": return Coffee; case "Shopping": return ShoppingBag; default: return Wallet }
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  
  // Strip time to compare just the calendar dates safely
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const expDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  
  const diffTime = today.getTime() - expDate.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
}

function RecentSpends({ expenses, onDelete }: { expenses: Expense[], onDelete: (id: number) => void }) {
  return (
    <section className="flex flex-col rounded-[2rem] bg-card p-5 shadow-sm ring-1 ring-border">
      <div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-foreground">Recent Spends</h2></div>
      <ul className="mt-3 max-h-64 space-y-1 overflow-y-auto pr-1">
        {expenses.length === 0 ? <p className="py-4 text-center text-sm text-muted-foreground">No expenses yet.</p> : expenses.map((exp) => {
          const Icon = getCategoryIcon(exp.category)
          return (
            <li key={exp.id} className="flex items-center gap-2 rounded-2xl px-2 py-2.5 transition active:bg-muted">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-foreground"><Icon className="size-4" /></span>
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate text-sm font-semibold text-foreground">{exp.description}</p>
                <p className="truncate text-xs text-muted-foreground">{formatRelativeTime(exp.created_at)} • {exp.category}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-sm font-bold text-foreground">−₹{exp.amount}</span>
                <button onClick={() => onDelete(exp.id)} className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* MULTI-PERSON SPLIT FAB                                                     */
/* -------------------------------------------------------------------------- */

type SplitPerson = { id: string; name: string; amount: string; percentage: string; isOwedToMe: boolean }

function AddExpenseFab({ onExpenseAdded, userId }: { onExpenseAdded: () => void, userId: string }) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [isSplitting, setIsSplitting] = useState(false)
  const [splitPeople, setSplitPeople] = useState<SplitPerson[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const quick = [{ icon: Utensils, label: "Food" }, { icon: Bus, label: "Travel" }, { icon: Coffee, label: "Snacks" }, { icon: ShoppingBag, label: "Shopping" }]

  useEffect(() => {
    const total = parseFloat(amount) || 0
    if (total > 0 && splitPeople.length > 0) {
      setSplitPeople(prev => prev.map(p => {
        if (p.percentage) { return { ...p, amount: ((parseFloat(p.percentage) / 100) * total).toFixed(2) } }
        return p
      }))
    }
  }, [amount])

  const handleAddPerson = () => { setSplitPeople([...splitPeople, { id: Date.now().toString(), name: "", amount: "", percentage: "", isOwedToMe: true }]) }
  
  const handleSplitEqually = () => {
    const fullAmount = parseFloat(amount) || 0
    if (fullAmount === 0 || splitPeople.length === 0) return alert("Enter a total amount and add at least one person first!")
    const pieces = splitPeople.length + 1
    const perPersonSplit = (fullAmount / pieces).toFixed(2)
    const perPersonPct = (100 / pieces).toFixed(1)
    setSplitPeople(splitPeople.map(p => ({ ...p, amount: perPersonSplit, percentage: perPersonPct })))
  }

  const handleAmountChange = (id: string, val: string) => {
    const total = parseFloat(amount) || 0
    const pct = total > 0 && val ? ((parseFloat(val) / total) * 100).toFixed(1) : ""
    setSplitPeople(splitPeople.map(p => p.id === id ? { ...p, amount: val, percentage: pct } : p))
  }

  const handlePercentChange = (id: string, val: string) => {
    const total = parseFloat(amount) || 0
    const amt = total > 0 && val ? ((parseFloat(val) / 100) * total).toFixed(2) : ""
    setSplitPeople(splitPeople.map(p => p.id === id ? { ...p, percentage: val, amount: amt } : p))
  }

  const updatePersonNameOrStatus = (id: string, field: "name" | "isOwedToMe", value: any) => { setSplitPeople(splitPeople.map(p => p.id === id ? { ...p, [field]: value } : p)) }
  const removePerson = (id: string) => { setSplitPeople(splitPeople.filter(p => p.id !== id)) }

  const handleSave = async () => {
    if (!amount || !category) return alert("Please enter an amount and select a category!")
    setIsSubmitting(true)
    const fullAmount = parseFloat(amount)
    
    const { error: expError } = await supabase.from("expenses").insert([{ amount: fullAmount, description: description || category, category: category, user_id: userId }])
    
    if (isSplitting && splitPeople.length > 0) {
      const splitsToInsert = splitPeople.filter(p => p.name.trim() !== "" && parseFloat(p.amount) > 0).map(p => ({ person_name: p.name, amount: parseFloat(p.amount), description: description || category, is_owed_to_me: p.isOwedToMe, user_id: userId }))
      if (splitsToInsert.length > 0) {
        const { error: splitError } = await supabase.from("splits").insert(splitsToInsert)
        if (splitError) console.error("Error saving splits:", splitError)
      }
    }
    
    setIsSubmitting(false)
    if (expError) alert("Failed to save.")
    else { setAmount(""); setDescription(""); setCategory(""); setIsSplitting(false); setSplitPeople([]); setOpen(false); onExpenseAdded() }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="absolute bottom-6 right-6 z-30 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition active:scale-90"><Plus className="size-7" /></button>
      {open && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end">
          <button onClick={() => setOpen(false)} className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
          <div className="relative max-h-[90vh] overflow-y-auto rounded-t-[2rem] bg-card p-6 pb-8 shadow-2xl">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-foreground">Add Expense</h2><button onClick={() => setOpen(false)} className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground"><X className="size-4" /></button></div>
            <label className="block mt-2"><span className="text-xs text-muted-foreground">Total Amount</span><div className="mt-1 flex items-center rounded-2xl bg-muted px-4 py-3"><span className="font-mono text-2xl font-bold">₹</span><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-transparent pl-2 font-mono text-2xl font-bold outline-none" /></div></label>
            <label className="block mt-4"><span className="text-xs text-muted-foreground">Description</span><div className="mt-1 flex items-center rounded-2xl bg-muted px-4 py-3"><input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-transparent text-sm font-medium outline-none" /></div></label>
            <p className="mt-5 text-xs text-muted-foreground">Category</p>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {quick.map(({ icon: Icon, label }) => (
                <button key={label} onClick={() => setCategory(label)} className={`flex flex-col items-center gap-1.5 rounded-2xl py-3 ${category === label ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}><Icon className="size-5" /><span className="text-[11px] font-medium">{label}</span></button>
              ))}
            </div>
            
            <div className="mt-6">
              <button onClick={() => { setIsSplitting(!isSplitting); if (!isSplitting && splitPeople.length === 0) handleAddPerson(); }} className="flex w-full items-center justify-between rounded-2xl bg-muted p-4"><span className="text-sm font-semibold">Split with Others?</span><div className={`size-5 rounded-full border-2 border-primary transition-colors ${isSplitting ? 'bg-primary' : 'bg-transparent'}`} /></button>
              
              {isSplitting && (
                <div className="mt-3 space-y-3 p-4 rounded-2xl bg-background border border-border">
                  {splitPeople.map((person) => (
                    <div key={person.id} className="relative rounded-xl bg-muted p-3">
                      <div className="flex gap-2 mb-2">
                        <input type="text" placeholder="Name" value={person.name} onChange={(e) => updatePersonNameOrStatus(person.id, "name", e.target.value)} className="w-[45%] bg-transparent text-sm font-medium outline-none border-b border-border py-1" />
                        <div className="flex w-[20%] items-center border-b border-border py-1">
                          <input type="number" placeholder="%" value={person.percentage} onChange={(e) => handlePercentChange(person.id, e.target.value)} className="w-full bg-transparent text-sm font-bold outline-none text-center" />
                          <span className="text-xs font-bold text-muted-foreground ml-1">%</span>
                        </div>
                        <div className="flex w-[35%] items-center border-b border-border py-1">
                          <span className="text-sm font-bold text-muted-foreground mr-1">₹</span>
                          <input type="number" placeholder="Amt" value={person.amount} onChange={(e) => handleAmountChange(person.id, e.target.value)} className="w-full bg-transparent text-sm font-bold outline-none" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => updatePersonNameOrStatus(person.id, "isOwedToMe", true)} className={`flex-1 text-[10px] py-1.5 rounded-lg font-bold transition-colors ${person.isOwedToMe ? 'bg-emerald-500/15 text-emerald-600' : 'bg-background text-muted-foreground'}`}>They Owe Me</button>
                        <button onClick={() => updatePersonNameOrStatus(person.id, "isOwedToMe", false)} className={`flex-1 text-[10px] py-1.5 rounded-lg font-bold transition-colors ${!person.isOwedToMe ? 'bg-red-500/15 text-red-600' : 'bg-background text-muted-foreground'}`}>I Owe Them</button>
                      </div>
                      {splitPeople.length > 1 && <button onClick={() => removePerson(person.id)} className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md"><X className="size-3" /></button>}
                    </div>
                  ))}
                  <div className="flex gap-2 pt-1">
                    <button onClick={handleAddPerson} className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted transition"><PlusCircle className="size-3.5" /> Add Person</button>
                    <button onClick={handleSplitEqually} className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border-2 border-primary/20 bg-primary/10 text-primary py-2.5 text-xs font-semibold hover:bg-primary/20 transition"><Calculator className="size-3.5" /> Split Equally</button>
                  </div>
                </div>
              )}
            </div>
            <button onClick={handleSave} disabled={isSubmitting} className="mt-6 w-full rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground">{isSubmitting ? "Saving..." : "Save Expense"}</button>
          </div>
        </div>
      )}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* MASTER PAGE COMPONENT                                                      */
/* -------------------------------------------------------------------------- */

export default function Page() {
  const [session, setSession] = useState<Session | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [splits, setSplits] = useState<Split[]>([])
  const [savings, setSavings] = useState<Saving[]>([])
  
  const [showSettings, setShowSettings] = useState(false)
  const [showBills, setShowBills] = useState(false)
  const [selectedSplit, setSelectedSplit] = useState<Split | null>(null) 
  
  const [showSavings, setShowSavings] = useState(false)
  const [savingName, setSavingName] = useState("")
  const [savingTarget, setSavingTarget] = useState("")
  const [savingCurrent, setSavingCurrent] = useState("")

  const [showVault, setShowVault] = useState(false)
  const [vaultFiles, setVaultFiles] = useState<VaultFile[]>([])
  const [uploading, setUploading] = useState(false)
  
  const [editName, setEditName] = useState("")
  const [editBudget, setEditBudget] = useState("")
  const [editUpi, setEditUpi] = useState("") 
  const [bills, setBills] = useState<Bill[]>([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setSession(session) })
    return () => subscription.unsubscribe()
  }, [])

  const fetchAllData = async () => {
    if (!session?.user?.id) return
    const { data: expData } = await supabase.from('expenses').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })
    if (expData) setExpenses(expData)
    const { data: splitData } = await supabase.from('splits').select('*').eq('user_id', session.user.id).order('id', { ascending: false })
    if (splitData) setSplits(splitData)
    const { data: savingData } = await supabase.from('savings').select('*').eq('user_id', session.user.id)
    if (savingData) setSavings(savingData)
  }

  const fetchVaultFiles = async () => {
    if (!session?.user?.id) return
    const { data, error } = await supabase.storage.from('vault').list(session.user.id + '/', { sortBy: { column: 'created_at', order: 'desc' } })
    if (data) setVaultFiles(data as VaultFile[])
    if (error && error.message !== "The resource was not found") console.error(error)
  }

  useEffect(() => {
    if (session) {
      fetchAllData()
      setEditName(session.user.user_metadata?.full_name || "")
      setEditBudget(session.user.user_metadata?.monthly_budget || "")
      setEditUpi(session.user.user_metadata?.upi_id || "")
      const loadedBills = session.user.user_metadata?.bills
      if (Array.isArray(loadedBills)) setBills(loadedBills)
    }
  }, [session])

  useEffect(() => { if (showVault) fetchVaultFiles() }, [showVault])

  const handleUpdateProfile = async () => { await supabase.auth.updateUser({ data: { full_name: editName, monthly_budget: parseFloat(editBudget), upi_id: editUpi } }); setShowSettings(false); alert("Profile saved!") }
  const handleUpdateBills = async () => { await supabase.auth.updateUser({ data: { bills } }); setShowBills(false) }

  const addNewBill = () => { setBills([...bills, { id: Date.now().toString(), name: "", amount: 0, color: BILL_COLORS[bills.length % BILL_COLORS.length] }]) }
  const updateBill = (id: string, field: "name" | "amount", value: string | number) => { setBills(bills.map(b => b.id === id ? { ...b, [field]: value } : b)) }
  const deleteBill = (id: string) => { setBills(bills.filter(b => b.id !== id)) }

  const handleDeleteSplit = async (id: number) => { await supabase.from('splits').delete().eq('id', id); setSelectedSplit(null); fetchAllData() }
  const handleDeleteExpense = async (id: number) => { if (window.confirm("Are you sure you want to delete this expense?")) { await supabase.from('expenses').delete().eq('id', id); fetchAllData() } }

  const openSavingsMenu = () => {
    const active = savings[0]
    setSavingName(active?.goal_name || ""); setSavingTarget(active?.target_amount?.toString() || ""); setSavingCurrent(active?.current_amount?.toString() || "")
    setShowSavings(true)
  }

  const handleSaveSavings = async () => {
    if (!session?.user?.id || !savingName || !savingTarget) return alert("Please fill out the goal name and target!")
    const active = savings[0]
    if (active) await supabase.from('savings').update({ goal_name: savingName, target_amount: parseFloat(savingTarget), current_amount: parseFloat(savingCurrent) || 0 }).eq('id', active.id)
    else await supabase.from('savings').insert([{ goal_name: savingName, target_amount: parseFloat(savingTarget), current_amount: parseFloat(savingCurrent) || 0, user_id: session.user.id }])
    setShowSavings(false)
    fetchAllData()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !session?.user?.id) return
    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}` 
    const filePath = `${session.user.id}/${fileName}` 
    const { error } = await supabase.storage.from('vault').upload(filePath, file)
    setUploading(false)
    if (error) alert("Upload failed: " + error.message)
    else fetchVaultFiles()
  }

  const handleDeleteFile = async (name: string) => {
    if (!session?.user?.id) return
    if (window.confirm("Are you sure you want to delete this file?")) {
      await supabase.storage.from('vault').remove([`${session.user.id}/${name}`])
      fetchVaultFiles()
    }
  }

  const handleLogout = async () => { await supabase.auth.signOut() }

  if (!session) return <AuthScreen />

  const userName = session.user.user_metadata?.full_name || "Student"
  const userBudget = session.user.user_metadata?.monthly_budget || 0
  const userUpi = session.user.user_metadata?.upi_id || "" 
  const totalFixed = bills.reduce((sum, bill) => sum + (Number(bill.amount) || 0), 0)
  const qrCodeUrl = selectedSplit && userUpi ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${userUpi}&pn=${userName}&am=${selectedSplit.amount}&cu=INR` : ""

  return (
    <div className="flex min-h-screen justify-center bg-secondary">
      <div className="relative flex min-h-screen w-full max-w-[440px] flex-col bg-background shadow-2xl">
      
        <AppHeader name={userName} onOpenSettings={() => setShowSettings(true)} onOpenVault={() => setShowVault(true)} />

        <main className="flex-1 overflow-y-auto px-4 pb-28">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><MonthlySurvival expenses={expenses} budget={userBudget} totalFixed={totalFixed} /></div>
            <SafeToSpend expenses={expenses} budget={userBudget} totalFixed={totalFixed} />
            <MicroSavings savings={savings} onOpenSheet={openSavingsMenu} />
            <MonthlyBillsTile bills={bills} totalFixed={totalFixed} onOpenSheet={() => setShowBills(true)} />
            <div className="col-span-2"><RoommateSplits splits={splits} onSplitClick={setSelectedSplit} /></div>
            <div className="col-span-2"><RecentSpends expenses={expenses} onDelete={handleDeleteExpense} /></div>
          </div>
        </main>
        
        {/* Settings Modal */}
        {showSettings && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-[2rem] bg-card p-6 shadow-2xl">
              <h2 className="text-lg font-bold text-foreground">App Settings</h2>
              <div className="mt-4 space-y-4">
                <div><label className="text-xs text-muted-foreground">Your Name</label><input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full rounded-xl bg-muted px-4 py-3 outline-none" /></div>
                <div><label className="text-xs text-muted-foreground">Monthly Pocket Money (₹)</label><input type="number" value={editBudget} onChange={(e) => setEditBudget(e.target.value)} className="w-full rounded-xl bg-muted px-4 py-3 outline-none" /></div>
                <div><label className="text-xs text-muted-foreground flex items-center gap-1"><QrCode className="size-3"/> Your UPI ID (Optional)</label><input type="text" value={editUpi} onChange={(e) => setEditUpi(e.target.value)} placeholder="e.g. name@okbank" className="w-full rounded-xl bg-muted px-4 py-3 outline-none placeholder:text-muted-foreground/50" /></div>
                <div className="flex gap-2 pt-2"><button onClick={() => setShowSettings(false)} className="flex-1 rounded-xl bg-muted py-3 font-bold text-foreground">Cancel</button><button onClick={handleUpdateProfile} className="flex-1 rounded-xl bg-primary py-3 font-bold text-primary-foreground">Save</button></div>
                <button onClick={handleLogout} className="mt-4 w-full rounded-xl border border-red-500/20 bg-red-500/10 py-3 font-bold text-red-500">Log Out</button>
              </div>
            </div>
          </div>
        )}

        {/* Data Vault Modal */}
        {showVault && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <button onClick={() => setShowVault(false)} className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
            <div className="relative max-h-[85vh] flex flex-col rounded-t-[2rem] bg-card p-6 pb-8 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2"><Lock className="size-5 text-primary"/> Secure Vault</h2>
                <button onClick={() => setShowVault(false)} className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground"><X className="size-4" /></button>
              </div>
              
              <label className="mt-2 flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 py-6 transition-colors hover:bg-primary/10">
                <UploadCloud className="size-8 text-primary opacity-80" />
                <span className="mt-2 text-sm font-semibold text-primary">{uploading ? "Uploading securely..." : "Tap to upload receipt or PDF"}</span>
                <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileUpload} disabled={uploading} />
              </label>

              <div className="mt-6 flex-1 overflow-y-auto pr-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Your Stored Files</h3>
                {vaultFiles.length === 0 && !uploading && (<p className="text-center text-sm text-muted-foreground mt-8">Your vault is empty.</p>)}
                <div className="space-y-2">
                  {vaultFiles.filter(f => f.name !== ".emptyFolderPlaceholder").map((file) => {
                    const fileUrl = supabase.storage.from('vault').getPublicUrl(`${session.user.id}/${file.name}`).data.publicUrl
                    return (
                      <div key={file.id} className="flex items-center justify-between rounded-xl bg-muted p-3">
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background"><File className="size-4 text-primary" /></div>
                          <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-foreground">Document {file.name.slice(-8)}</p><p className="text-xs text-muted-foreground">Tap to view</p></div>
                        </a>
                        <button onClick={() => handleDeleteFile(file.name)} className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"><Trash2 className="size-4" /></button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Savings Goal Bottom Sheet */}
        {showSavings && (
          <div className="absolute inset-0 z-40 flex flex-col justify-end">
            <button onClick={() => setShowSavings(false)} className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
            <div className="relative max-h-[80vh] overflow-y-auto rounded-t-[2rem] bg-card p-6 pb-8 shadow-2xl">
              <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-foreground">Manage Savings Goal</h2><button onClick={() => setShowSavings(false)} className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground"><X className="size-4" /></button></div>
              <div className="mt-4 space-y-4">
                <div><label className="text-xs font-medium text-muted-foreground">What are you saving for?</label><input type="text" value={savingName} onChange={(e) => setSavingName(e.target.value)} className="mt-1 w-full rounded-xl bg-muted px-4 py-3 text-sm outline-none" placeholder="e.g. Concert Tickets" /></div>
                <div className="flex gap-3">
                  <div className="flex-1"><label className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Target className="size-3" /> Target Amount</label><div className="mt-1 flex items-center rounded-xl bg-muted px-3 py-3"><span className="text-sm font-bold text-muted-foreground mr-1">₹</span><input type="number" value={savingTarget} onChange={(e) => setSavingTarget(e.target.value)} className="w-full bg-transparent text-sm font-bold outline-none" placeholder="5000" /></div></div>
                  <div className="flex-1"><label className="text-xs font-medium text-muted-foreground flex items-center gap-1"><PiggyBank className="size-3" /> Saved So Far</label><div className="mt-1 flex items-center rounded-xl bg-primary/10 px-3 py-3 border border-primary/20"><span className="text-sm font-bold text-primary mr-1">₹</span><input type="number" value={savingCurrent} onChange={(e) => setSavingCurrent(e.target.value)} className="w-full bg-transparent text-sm font-bold text-primary outline-none" placeholder="0" /></div></div>
                </div>
                <div className="pt-2">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Quick Add Funds:</p>
                  <div className="flex gap-2">
                    <button onClick={() => setSavingCurrent((Number(savingCurrent) + 100).toString())} className="flex-1 rounded-lg bg-muted py-2 text-xs font-bold text-foreground hover:bg-primary/10 transition">+ ₹100</button>
                    <button onClick={() => setSavingCurrent((Number(savingCurrent) + 500).toString())} className="flex-1 rounded-lg bg-muted py-2 text-xs font-bold text-foreground hover:bg-primary/10 transition">+ ₹500</button>
                    <button onClick={() => setSavingCurrent((Number(savingCurrent) + 1000).toString())} className="flex-1 rounded-lg bg-muted py-2 text-xs font-bold text-foreground hover:bg-primary/10 transition">+ ₹1000</button>
                  </div>
                </div>
              </div>
              <button onClick={handleSaveSavings} className="mt-6 w-full rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground">Update Savings Goal</button>
            </div>
          </div>
        )}

        {/* SETTLE UP Modal */}
        {selectedSplit && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <button onClick={() => setSelectedSplit(null)} className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
            <div className="relative rounded-t-[2rem] bg-card p-6 pb-8 shadow-2xl text-center">
              <div className="flex justify-end"><button onClick={() => setSelectedSplit(null)} className="flex size-8 items-center justify-center rounded-full bg-muted"><X className="size-4" /></button></div>
              <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary"><Users className="size-8" /></div>
              <h2 className="text-xl font-bold text-foreground">Settle Up</h2>
              <p className="mt-1 text-sm text-muted-foreground">{selectedSplit.is_owed_to_me ? `${selectedSplit.person_name} owes you` : `You owe ${selectedSplit.person_name}`} for {selectedSplit.description}</p>
              <p className={`mt-3 font-mono text-4xl font-extrabold ${selectedSplit.is_owed_to_me ? 'text-emerald-500' : 'text-red-500'}`}>₹{selectedSplit.amount}</p>
              {selectedSplit.is_owed_to_me && userUpi ? (
                <div className="mt-6 flex flex-col items-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Scan to Pay</p>
                  <div className="rounded-2xl bg-white p-3 shadow-sm border border-border"><img src={qrCodeUrl} alt="UPI QR Code" className="size-40" /></div>
                  <p className="mt-2 text-xs font-medium text-muted-foreground">{userUpi}</p>
                </div>
              ) : null}
              <button onClick={() => handleDeleteSplit(selectedSplit.id)} className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground transition active:scale-95"><CheckCircle2 className="size-5" /> Mark as Paid (Remove)</button>
            </div>
          </div>
        )}

        {/* Bills Bottom Sheet */}
        {showBills && (
          <div className="absolute inset-0 z-40 flex flex-col justify-end">
            <button onClick={() => setShowBills(false)} className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
            <div className="relative max-h-[80vh] overflow-y-auto rounded-t-[2rem] bg-card p-6 pb-8 shadow-2xl">
              <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-foreground">Manage Fixed Bills</h2><button onClick={() => setShowBills(false)} className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground"><X className="size-4" /></button></div>
              <div className="mt-4 space-y-3">
                {bills.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">No fixed bills added yet.</p>}
                {bills.map((bill) => (
                  <div key={bill.id} className="flex items-center gap-2 rounded-2xl bg-muted px-3 py-2">
                    <div className={`w-1.5 h-10 rounded-full ${bill.color}`} />
                    <input type="text" value={bill.name} onChange={(e) => updateBill(bill.id, "name", e.target.value)} className="w-1/2 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground" placeholder="Bill Name" />
                    <div className="flex flex-1 items-center rounded-xl bg-background px-2 py-1.5"><span className="text-xs font-bold text-muted-foreground mr-1">₹</span><input type="number" value={bill.amount || ""} onChange={(e) => updateBill(bill.id, "amount", Number(e.target.value))} className="w-full bg-transparent text-sm font-bold outline-none" placeholder="0" /></div>
                    <button onClick={() => deleteBill(bill.id)} className="flex size-8 shrink-0 items-center justify-center rounded-full text-red-500 hover:bg-red-500/10"><Trash2 className="size-4" /></button>
                  </div>
                ))}
                <button onClick={addNewBill} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition"><PlusCircle className="size-4" /> Add Custom Bill</button>
              </div>
              <button onClick={handleUpdateBills} className="mt-6 w-full rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground">Save Bills</button>
            </div>
          </div>
        )}

        <AddExpenseFab onExpenseAdded={fetchAllData} userId={session.user.id} />
      </div>
    </div>
  )
}