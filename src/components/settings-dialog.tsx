import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Camera, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppState, type SettingsTab } from "@/lib/app-state";
import { contactSchema } from "@/lib/application";
import { getTier, upgradeCost, upgradeOptions } from "@/lib/event";
import { initials } from "@/lib/speakers";
import { cn } from "@/lib/utils";

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;

export function SettingsDialog() {
  const { settingsOpen, setSettingsOpen, settingsTab, profile, updateProfile, openApply } = useAppState();
  const [tab, setTab] = useState<SettingsTab>(settingsTab);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (settingsOpen) {
      setTab(settingsTab);
      setName(profile.name);
      setEmail(profile.email);
      setPhone(profile.phone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsOpen, settingsTab]);

  const onPhoto = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file.");
    if (file.size > MAX_PHOTO_BYTES) return toast.error("Photo must be under 2 MB.");
    const reader = new FileReader();
    reader.onload = () => {
      updateProfile({ avatar: String(reader.result) });
      toast.success("Profile picture updated");
    };
    reader.readAsDataURL(file);
  };

  const nameValid = name.trim().length >= 2 && name.trim().length <= 100;
  const contact = contactSchema.safeParse({ email, phone });
  const contactErrors = contact.success
    ? {}
    : Object.fromEntries(contact.error.issues.map((i) => [i.path[0], i.message]));
  const contactChanged = email.trim() !== profile.email || phone.trim() !== profile.phone;

  const current = profile.ticket ? getTier(profile.ticket) : null;
  const upgrades = profile.ticket ? upgradeOptions(profile.ticket) : [];

  return (
    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
      <DialogContent className="max-h-[92vh] max-w-lg overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage your profile, contact details and ticket.</DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as SettingsTab)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="ticket">Ticket</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 pt-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="size-20 rounded-2xl">
                  <AvatarImage src={profile.avatar} alt={profile.name} className="object-cover" />
                  <AvatarFallback className="rounded-2xl text-lg">{initials(profile.name)}</AvatarFallback>
                </Avatar>
                <button type="button" onClick={() => fileRef.current?.click()} aria-label="Change photo"
                  className="absolute -bottom-1 -right-1 grid size-8 cursor-pointer place-items-center rounded-full border-2 border-background bg-primary text-primary-foreground">
                  <Camera className="size-4" />
                </button>
              </div>
              <div className="space-y-1">
                <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>Upload new photo</Button>
                <p className="text-xs text-muted-foreground">JPG or PNG, up to 2 MB.</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { onPhoto(e.target.files?.[0]); e.target.value = ""; }} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="settings-name" className="text-xs">Display name</Label>
              <Input id="settings-name" value={name} maxLength={100} onChange={(e) => setName(e.target.value)} />
              {!nameValid && <p className="text-xs text-destructive">Enter at least 2 characters</p>}
            </div>
            <div className="flex justify-end">
              <Button disabled={!nameValid || name.trim() === profile.name}
                onClick={() => { updateProfile({ name: name.trim() }); toast.success("Profile saved"); }}>
                Save profile
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <Label htmlFor="settings-email" className="text-xs">Contact email</Label>
              <Input id="settings-email" type="email" value={email} maxLength={255} onChange={(e) => setEmail(e.target.value)} />
              {contactErrors.email && <p className="text-xs text-destructive">{contactErrors.email}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="settings-phone" className="text-xs">Phone number</Label>
              <Input id="settings-phone" type="tel" value={phone} maxLength={20} placeholder="+33 6 12 34 56 78" onChange={(e) => setPhone(e.target.value)} />
              {contactErrors.phone && phone && <p className="text-xs text-destructive">{contactErrors.phone}</p>}
            </div>
            <div className="flex justify-end">
              <Button disabled={!contact.success || !contactChanged}
                onClick={() => { updateProfile({ email: email.trim(), phone: phone.trim() }); toast.success("Contact details saved"); }}>
                Save contact details
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="ticket" className="space-y-4 pt-4">
            {!current ? (
              <div className="rounded-xl border border-dashed p-6 text-center">
                <p className="font-semibold">You don't have a ticket yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Seats start at $59 for students.</p>
                <Button variant="cta" className="mt-4" onClick={() => { setSettingsOpen(false); openApply(); }}>
                  Grab your seat now!
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between rounded-xl bg-muted/60 p-4">
                  <div>
                    <div className="eyebrow">Current ticket</div>
                    <div className="font-display text-lg font-semibold">{current.name}</div>
                  </div>
                  <div className="font-display text-xl font-semibold">${current.price}</div>
                </div>

                {upgrades.length === 0 ? (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="size-4 text-success" /> You have our best ticket. Enjoy the front row!
                  </p>
                ) : (
                  upgrades.map((t, i) => (
                    <div key={t.id} className={cn("rounded-xl border p-4", i === 0 && "border-brand/60 bg-brand-soft/40")}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          {i === 0 && (
                            <div className="mb-1 inline-flex items-center gap-1 text-xs font-semibold text-brand">
                              <Sparkles className="size-3.5" /> Suggested upgrade
                            </div>
                          )}
                          <div className="font-semibold">{t.name} · ${t.price}</div>
                          <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                            {t.perks.map((p) => <li key={p}>• {p}</li>)}
                          </ul>
                        </div>
                        <Button size="sm" variant={i === 0 ? "cta" : "outline"}
                          onClick={() => {
                            const cost = upgradeCost(current.id, t.id);
                            updateProfile({ ticket: t.id });
                            toast.success(`Upgraded to ${t.name}`, { description: `We'll email an invoice for the $${cost} difference.` });
                          }}>
                          Upgrade +${upgradeCost(current.id, t.id)} <ArrowUpRight />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
