"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { submitAppointment } from "@/lib/actions";

const services = [
  "Blood Collection (Venipuncture)",
  "Capillary Blood Draw",
  "CBC (Complete Blood Count)",
  "HbA1c Test",
  "Lipid Panel",
  "Thyroid Panel (TFT/TSH)",
  "SMAC 25 / Metabolic Panel",
  "PSA Test",
  "GTT (Glucose Tolerance Test)",
  "Pap Smear Collection",
  "Urine Collection",
  "Saliva Collection",
  "Stool Collection",
  "Nasal Swab",
  "Throat Swab",
  "Other (specify in notes)",
];

const timeSlots = [
  "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM",
  "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM",
  "3:00 PM", "4:00 PM", "5:00 PM",
];

type FormData = {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneHome: string;
  phoneMobile: string;
  email: string;
  address: string;
  nationalInsurance: string;
  maritalStatus: string;
  occupation: string;
  service: string;
  requestedDate: string;
  requestedTime: string;
  specialInstructions: string;
};

const empty: FormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  phoneHome: "",
  phoneMobile: "",
  email: "",
  address: "",
  nationalInsurance: "",
  maritalStatus: "",
  occupation: "",
  service: "",
  requestedDate: "",
  requestedTime: "",
  specialInstructions: "",
};

export default function BookPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const nextStep = () => {
    setError("");
    setStep((s) => s + 1);
  };

  const prevStep = () => {
    setError("");
    setStep((s) => s - 1);
  };

  const validateStep1 = () => {
    if (!form.firstName.trim()) {
      setError("First name is required.");
      return false;
    }
    if (!form.lastName.trim()) {
      setError("Last name is required.");
      return false;
    }
    if (!form.dateOfBirth.trim()) {
      setError("Date of birth is required.");
      return false;
    }
    if (!form.gender.trim()) {
      setError("Gender is required.");
      return false;
    }
    if (!form.phoneMobile.trim()) {
      setError("Mobile phone is required.");
      return false;
    }
    if (!form.email.trim()) {
      setError("Email is required.");
      return false;
    }
    if (!form.address.trim()) {
      setError("Home address is required.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!form.service.trim()) {
      setError("Please select a service.");
      return false;
    }
    if (!form.requestedDate.trim()) {
      setError("Please select a preferred date.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      await submitAppointment({
        ...form,
        firstName: form.firstName.trim(),
        middleName: form.middleName.trim(),
        lastName: form.lastName.trim(),
        dateOfBirth: form.dateOfBirth.trim(),
        gender: form.gender.trim(),
        phoneHome: form.phoneHome.trim(),
        phoneMobile: form.phoneMobile.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        nationalInsurance: form.nationalInsurance.trim(),
        maritalStatus: form.maritalStatus.trim(),
        occupation: form.occupation.trim(),
        service: form.service.trim(),
        requestedDate: form.requestedDate.trim(),
        requestedTime: form.requestedTime.trim(),
        specialInstructions: form.specialInstructions.trim(),
      });

      router.push("/booking-success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const steps = ["Patient Info", "Appointment", "Review & Submit"];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-yellow-600 font-semibold text-sm uppercase tracking-widest mb-1">
              Schedule a Visit
            </p>
            <h1 className="font-bold text-3xl text-teal-800">Book an Appointment</h1>
            <p className="text-gray-500 mt-2 text-sm">
              We&apos;ll come to you — home, office, or hotel.
            </p>
          </div>

          <div className="flex items-center justify-center gap-0 mb-8">
            {steps.map((label, i) => (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      step > i + 1
                        ? "bg-teal-600 text-white"
                        : step === i + 1
                        ? "bg-teal-600 text-white ring-4 ring-teal-100"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > i + 1 ? "✓" : i + 1}
                  </div>
                  <span
                    className={`text-xs mt-1 font-medium ${
                      step === i + 1 ? "text-teal-700" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mb-4 transition-all duration-300 ${
                      step > i + 1 ? "bg-teal-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="font-bold text-lg text-gray-800 mb-4">Patient Information</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={form.firstName}
                      onChange={set("firstName")}
                      placeholder="First"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Middle Name
                    </label>
                    <input
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={form.middleName}
                      onChange={set("middleName")}
                      placeholder="Middle"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={form.lastName}
                      onChange={set("lastName")}
                      placeholder="Last"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={form.dateOfBirth}
                      onChange={set("dateOfBirth")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                      value={form.gender}
                      onChange={set("gender")}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Mobile Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={form.phoneMobile}
                      onChange={set("phoneMobile")}
                      placeholder="242-xxx-xxxx"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Home Phone
                    </label>
                    <input
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={form.phoneHome}
                      onChange={set("phoneHome")}
                      placeholder="242-xxx-xxxx"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="you@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Home Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={form.address}
                    onChange={set("address")}
                    placeholder="Street, Nassau, Bahamas"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      National Insurance #
                    </label>
                    <input
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={form.nationalInsurance}
                      onChange={set("nationalInsurance")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Marital Status
                    </label>
                    <select
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                      value={form.maritalStatus}
                      onChange={set("maritalStatus")}
                    >
                      <option value="">Select</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Occupation
                    </label>
                    <input
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={form.occupation}
                      onChange={set("occupation")}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="font-bold text-lg text-gray-800 mb-4">Appointment Details</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Service Requested <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                    value={form.service}
                    onChange={set("service")}
                  >
                    <option value="">Select a service</option>
                    {services.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      value={form.requestedDate}
                      onChange={set("requestedDate")}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Preferred Time
                    </label>
                    <select
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                      value={form.requestedTime}
                      onChange={set("requestedTime")}
                    >
                      <option value="">Any time</option>
                      {timeSlots.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Visit Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Where should we come? (if different from home address)"
                    value={form.address}
                    onChange={set("address")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Special Instructions
                  </label>
                  <textarea
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    rows={4}
                    value={form.specialInstructions}
                    onChange={set("specialInstructions")}
                    placeholder="Any allergies, medical conditions, access instructions, or special requests..."
                  />
                </div>

                <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 text-sm text-teal-700">
                  <p className="font-semibold mb-1">What to expect</p>
                  <ul className="space-y-1 text-teal-600 list-disc list-inside">
                    <li>We&apos;ll confirm your appointment within 24 hours</li>
                    <li>Our phlebotomist will call before arriving</li>
                    <li>Please have your ID and insurance card ready</li>
                    <li>Fast beforehand if required for your test</li>
                  </ul>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h2 className="font-bold text-lg text-gray-800 mb-4">Review Your Appointment</h2>

                <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
                  <div className="font-semibold text-gray-700 uppercase tracking-widest text-xs mb-3">
                    Patient
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-500">Name</span>
                    <span className="font-medium text-gray-800">
                      {form.firstName} {form.middleName} {form.lastName}
                    </span>
                    <span className="text-gray-500">Date of Birth</span>
                    <span className="font-medium text-gray-800">{form.dateOfBirth}</span>
                    <span className="text-gray-500">Gender</span>
                    <span className="font-medium text-gray-800">{form.gender}</span>
                    <span className="text-gray-500">Mobile</span>
                    <span className="font-medium text-gray-800">{form.phoneMobile}</span>
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium text-gray-800">{form.email}</span>
                    <span className="text-gray-500">Address</span>
                    <span className="font-medium text-gray-800">{form.address}</span>
                  </div>
                </div>

                <div className="bg-teal-50 rounded-xl p-5 space-y-3 text-sm border border-teal-100">
                  <div className="font-semibold text-teal-700 uppercase tracking-widest text-xs mb-3">
                    Appointment
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-gray-500">Service</span>
                    <span className="font-medium text-gray-800">{form.service}</span>
                    <span className="text-gray-500">Date</span>
                    <span className="font-medium text-gray-800">{form.requestedDate}</span>
                    <span className="text-gray-500">Time</span>
                    <span className="font-medium text-gray-800">
                      {form.requestedTime || "Any time"}
                    </span>
                    {form.specialInstructions && (
                      <>
                        <span className="text-gray-500">Notes</span>
                        <span className="font-medium text-gray-800">{form.specialInstructions}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
                  By submitting this form you agree to our terms of service and consent to our
                  phlebotomist visiting your location.
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              {step > 1 ? (
                <button
                  onClick={prevStep}
                  className="border-2 border-gray-200 text-gray-600 font-semibold px-6 py-3 rounded-xl hover:border-teal-300 hover:text-teal-600 transition-all text-sm"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  onClick={() => {
                    if (step === 1 && !validateStep1()) return;
                    if (step === 2 && !validateStep2()) return;
                    nextStep();
                  }}
                  className="bg-teal-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-teal-700 transition-all text-sm"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-yellow-500 text-white font-semibold px-8 py-3 rounded-xl hover:bg-yellow-600 transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Confirm Appointment"}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}