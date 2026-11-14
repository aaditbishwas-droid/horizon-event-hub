import { describe, expect, it } from "vitest";
import { getTier, upgradeCost, upgradeOptions } from "@/lib/event";
import { validateApplication, type ApplicationInput } from "@/lib/application";
import { SPEAKERS, filterSpeakers, paginate } from "@/lib/speakers";

const complete: ApplicationInput = {
  tier: "student",
  fullName: "Maya Laurent",
  email: "maya@example.com",
  phone: "+33 6 12 34 56 78",
  organization: "Sorbonne",
  paymentMethod: "card",
  cardName: "Maya Laurent",
  cardNumber: "4242 4242 4242 4242",
  cardExpiry: "12/30",
  cardCvc: "123",
  paypalEmail: "",
  agreeToConduct: true,
};

describe("ticket prices", () => {
  it("student is $59, professional $109, VIP $499", () => {
    expect(getTier("student").price).toBe(59);
    expect(getTier("professional").price).toBe(109);
    expect(getTier("vip").price).toBe(499);
  });
  it("student is prompted to upgrade to professional first", () => {
    expect(upgradeOptions("student")[0].id).toBe("professional");
    expect(upgradeCost("student", "professional")).toBe(50);
  });
});

describe("application form", () => {
  it("accepts a fully completed form", () => {
    expect(validateApplication(complete).valid).toBe(true);
  });
  it("cannot submit without agreeing to the Code of Conduct", () => {
    expect(validateApplication({ ...complete, agreeToConduct: false }).valid).toBe(false);
  });
  it("cannot submit with a missing name", () => {
    expect(validateApplication({ ...complete, fullName: "" }).valid).toBe(false);
  });
  it("cannot submit card payment without a card number", () => {
    expect(validateApplication({ ...complete, cardNumber: "" }).valid).toBe(false);
  });
});

describe("speakers", () => {
  it("has 80 speakers split into 4 pages of 20", () => {
    expect(SPEAKERS).toHaveLength(80);
    const p = paginate(SPEAKERS, 1);
    expect(p.items).toHaveLength(20);
    expect(p.pageCount).toBe(4);
  });
  it("filters by department and date together", () => {
    const res = filterSpeakers(SPEAKERS, { query: "", department: "Design", day: "2026-12-03" });
    expect(res.every((s) => s.department === "Design" && s.day === "2026-12-03")).toBe(true);
  });
});
