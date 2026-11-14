import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Building2, Check, CreditCard, Landmark, Lock, PartyPopper, Wallet } from "lucide-react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppState } from "@/lib/app-state";
import { PerkList } from "@/components/perk-list";
import { EVENT, TIERS, getTier, type TierId } from "@/lib/event";
import { validateApplication, type ApplicationInput } from "@/lib/application";
import { cn } from "@/lib/utils";

const PAYMENT_METHODS = [
  { id: "card", label: "Card", icon: CreditCard },
  { id: "paypal", label: "PayPal", icon: Wallet },
  { id: "bank", label: "Bank transfer", icon: Landmark },
] as const;

function emptyForm(profile: { name: string; email: string; phone: string }, tier: TierId | null): ApplicationInput {
  return {
    tier: tier ?? "",
    fullName: profile.name,
    email: profile.email,
    phone: profile.phone,
    organization: "",
    paymentMethod: "",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    paypalEmail: "",
    agreeToConduct: false,
  };
}

export function ApplyDialog() {
  const { applyOpen, setApplyOpen, applyTier, profile, updateProfile } = useAppState();
  const [form, setForm] = useState<ApplicationInput>(() => emptyForm(profile, applyTier));
  const [touched, setTouched] = useState<Partial<Record<keyof ApplicationInput, boolean>>>({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (applyOpen) {
      setForm(emptyForm(profile, applyTier));
      setTouched({});
      setDone(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyOpen]);

  const { valid, errors } = useMemo(() => validateApplication(form), [form]);
  const set = <K extends keyof ApplicationInput>(key: K, value: ApplicationInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));
  const touch = (key: keyof ApplicationInput) => setTouched((t) => ({ ...t, [key]: true }));
  const err = (key: keyof ApplicationInput) => (touched[key] ? errors[key] : undefined);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || !form.tier) return;
    updateProfile({
      ticket: form.tier,
      name: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    });
    setDone(true);
    toast.success(`You're in! ${getTier(form.tier).name} seat reserved.`);
  };

  const selectedTier = form.tier ? getTier(form.tier) : null;

  return (
    <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
      <DialogContent className="max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-2xl gap-0 overflow-y-auto rounded-2xl p-0">
        {done && selectedTier ? (
          <div className="flex flex-col items-center gap-4 px-8 py-14 text-center">
            <div className="grid size-14 place-items-center rounded-full bg-brand-soft text-brand">
              <PartyPopper className="size-7" />
            </div>
            <DialogTitle className="text-2xl">Your seat is reserved</DialogTitle>
            <DialogDescription className="max-w-sm">
              We've sent your {selectedTier.name} ticket confirmation to <strong>{form.email}</strong>. See you
              in Paris on December 2.
            </DialogDescription>
            <Button className="mt-2" onClick={() => setApplyOpen(false)}>
              Back to dashboard
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <DialogHeader className="border-b px-6 py-5">
              <DialogTitle className="text-xl">Grab your seat</DialogTitle>
              <DialogDescription>Choose a ticket and fill in your details. Every field is required.</DialogDescription>
            </DialogHeader>

            <div className="space-y-8 px-6 py-6">
              <section className="space-y-3">
                <div className="eyebrow">1 · Ticket</div>
                <div role="radiogroup" aria-label="Ticket type" className="grid gap-3 sm:grid-cols-3">
                  {TIERS.map((t) => {
                    const active = form.tier === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => set("tier", t.id)}
                        className={cn(
                          "relative flex cursor-pointer flex-col items-stretch gap-1 rounded-xl border p-4 text-left transition-all",
                          active ? "border-primary bg-accent ring-1 ring-primary" : "hover:border-ring/50",
                        )}
                      >
                        {t.limited && (
                          <span className="absolute right-3 top-3 rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">
                            Limited
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-sm font-semibold">
                          {t.name}
                          {active && <Check className="size-4 text-primary" aria-hidden />}
                        </span>
                        <span className="font-display text-2xl font-semibold">${t.price}</span>
                        <span className="text-xs text-muted-foreground">
                          {t.limited ? `Only ${t.seatsLeft} left` : t.blurb}
                        </span>
                        <PerkList perks={t.perks} compact className="mt-2 border-t pt-3" />
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-3">
                <div className="eyebrow">2 · Your details</div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" error={err("fullName")}>
                    <Input value={form.fullName} maxLength={100} autoComplete="name"
                      onChange={(e) => set("fullName", e.target.value)} onBlur={() => touch("fullName")} />
                  </Field>
                  <Field label="Contact email" error={err("email")}>
                    <Input type="email" value={form.email} maxLength={255} autoComplete="email"
                      onChange={(e) => set("email", e.target.value)} onBlur={() => touch("email")} />
                  </Field>
                  <Field label="Phone number" error={err("phone")}>
                    <Input type="tel" value={form.phone} maxLength={20} placeholder="+33 6 12 34 56 78" autoComplete="tel"
                      onChange={(e) => set("phone", e.target.value)} onBlur={() => touch("phone")} />
                  </Field>
                  <Field label="Company or school" error={err("organization")}>
                    <div className="relative">
                      <Building2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input className="pl-9" value={form.organization} maxLength={120} autoComplete="organization"
                        onChange={(e) => set("organization", e.target.value)} onBlur={() => touch("organization")} />
                    </div>
                  </Field>
                </div>
              </section>

              <section className="space-y-3">
                <div className="eyebrow">3 · Payment</div>
                <div role="radiogroup" aria-label="Payment method" className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map((m) => {
                    const active = form.paymentMethod === m.id;
                    return (
                      <button key={m.id} type="button" role="radio" aria-checked={active}
                        onClick={() => set("paymentMethod", m.id)}
                        className={cn(
                          "flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                          active ? "border-primary bg-accent ring-1 ring-primary" : "hover:border-ring/50",
                        )}
                      >
                        <m.icon className="size-4" /> {m.label}
                      </button>
                    );
                  })}
                </div>

                {form.paymentMethod === "card" && (
                  <div className="grid gap-4 rounded-xl bg-muted/60 p-4 sm:grid-cols-4">
                    <Field label="Name on card" error={err("cardName")} className="sm:col-span-4">
                      <Input value={form.cardName} maxLength={100} autoComplete="cc-name"
                        onChange={(e) => set("cardName", e.target.value)} onBlur={() => touch("cardName")} />
                    </Field>
                    <Field label="Card number" error={err("cardNumber")} className="sm:col-span-2">
                      <Input inputMode="numeric" placeholder="1234 5678 9012 3456" autoComplete="cc-number"
                        value={form.cardNumber}
                        onChange={(e) => set("cardNumber", formatCard(e.target.value))} onBlur={() => touch("cardNumber")} />
                    </Field>
                    <Field label="Expiry" error={err("cardExpiry")}>
                      <Input inputMode="numeric" placeholder="MM/YY" autoComplete="cc-exp" value={form.cardExpiry}
                        onChange={(e) => set("cardExpiry", formatExpiry(e.target.value))} onBlur={() => touch("cardExpiry")} />
                    </Field>
                    <Field label="CVC" error={err("cardCvc")}>
                      <Input inputMode="numeric" placeholder="123" autoComplete="cc-csc" value={form.cardCvc}
                        onChange={(e) => set("cardCvc", e.target.value.replace(/\D/g, "").slice(0, 4))} onBlur={() => touch("cardCvc")} />
                    </Field>
                  </div>
                )}
                {form.paymentMethod === "paypal" && (
                  <div className="rounded-xl bg-muted/60 p-4">
                    <Field label="PayPal email" error={err("paypalEmail")}>
                      <Input type="email" value={form.paypalEmail} maxLength={255}
                        onChange={(e) => set("paypalEmail", e.target.value)} onBlur={() => touch("paypalEmail")} />
                    </Field>
                  </div>
                )}
                {form.paymentMethod === "bank" && (
                  <p className="rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
                    We'll email bank details to <strong className="text-foreground">{form.email || "your email"}</strong>. Your seat is held for 5 days.
                  </p>
                )}
              </section>

              <section>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border p-4">
                  <Checkbox className="mt-0.5" checked={form.agreeToConduct}
                    onCheckedChange={(v) => { set("agreeToConduct", v === true); touch("agreeToConduct"); }} />
                  <span className="text-sm leading-relaxed">
                    I have read and agree to the{" "}
                    <Link to="/code-of-conduct" target="_blank" rel="noopener"
                      className="font-semibold text-brand underline decoration-brand/40 underline-offset-4 hover:decoration-brand"
                      onClick={(e) => e.stopPropagation()}>
                      Code of Conduct
                    </Link>{" "}
                    for {EVENT.name}.
                  </span>
                </label>
                {err("agreeToConduct") && <p className="mt-1.5 text-xs text-destructive">{errors.agreeToConduct}</p>}
              </section>
            </div>

            <div className="sticky bottom-0 flex flex-col gap-3 border-t bg-background/95 px-6 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm">
                <span className="text-muted-foreground">Total </span>
                <span className="font-display text-lg font-semibold">${selectedTier?.price ?? 0}</span>
                {!valid && <span className="ml-2 text-xs text-muted-foreground">Complete all fields to continue</span>}
              </div>
              <Button type="submit" variant="cta" size="lg" disabled={!valid}>
                <Lock /> Confirm & pay
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, error, className, children }: { label: string; error?: string | undefined; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs font-medium">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function formatCard(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}
