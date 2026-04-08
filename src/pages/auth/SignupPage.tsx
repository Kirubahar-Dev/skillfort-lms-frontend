import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { FormInput } from "../../components/form/FormInput";
import { PasswordInput } from "../../components/form/PasswordInput";
import { Checkbox } from "../../components/form/Checkbox";
import { FormButton } from "../../components/form/FormButton";
import { ProgressBar } from "../../components/form/ProgressBar";

type SignupStep = 1 | 2 | 3 | "success";

interface SignupFormData {
  fullName: string;
  email: string;
  country: string;
  password: string;
  confirmPassword: string;
  role: "student" | "instructor" | "admin";
  agreeTerms: boolean;
  agreePrivacy: boolean;
}

const ROLES = [
  {
    id: "student" as const,
    icon: "📚",
    title: "Student",
    description: "Learn from courses, track progress & earn certificates",
  },
  {
    id: "instructor" as const,
    icon: "👨‍🏫",
    title: "Instructor",
    description: "Create & sell courses, build your teaching portfolio",
  },
  {
    id: "admin" as const,
    icon: "👨‍💼",
    title: "Admin",
    description: "Manage platform & users, access analytics & reports",
  },
];

export function SignupPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<SignupStep>(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<SignupFormData>>({});

  const [formData, setFormData] = useState<SignupFormData>({
    fullName: "",
    email: "",
    country: "",
    password: "",
    confirmPassword: "",
    role: "student",
    agreeTerms: false,
    agreePrivacy: false,
  });

  const updateField = <K extends keyof SignupFormData>(field: K, value: SignupFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateStep1 = (): boolean => {
    const newErrors: Partial<SignupFormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.country) {
      newErrors.country = "Please select your country";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Partial<SignupFormData> = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the Terms of Service";
    }

    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = "You must agree to the Privacy Policy";
    }

    setErrors(newErrors as Partial<SignupFormData>);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    } else if (currentStep === 3) {
      if (validateStep3()) {
        await handleCreateAccount();
      }
    }
  };

  const handleCreateAccount = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCurrentStep("success");
    } catch (err) {
      setErrors({ email: "An error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (currentStep === "success") {
    return (
      <AuthLayout title="Account Created!" subtitle="Welcome to SkillFort Learning">
        <div className="text-center space-y-6">
          <div className="text-6xl">🎉</div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-sf-ink">Success!</h2>
            <p className="text-sf-muted">
              We've sent a verification email to <br />
              <span className="font-semibold text-sf-ink">{formData.email}</span>
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <p className="text-sm font-semibold text-blue-900 mb-3">Next Steps:</p>
            <ol className="text-sm text-blue-900 space-y-2">
              <li>✓ Check your inbox for verification email</li>
              <li>✓ Click the verification link to activate your account</li>
              <li>✓ Complete your profile information</li>
              <li>✓ Start exploring courses and learning!</li>
            </ol>
          </div>

          <div className="pt-4 space-y-3">
            <p className="text-sm text-sf-muted">Didn't receive an email?</p>
            <button className="text-blue-600 font-semibold hover:underline">Resend verification email</button>
          </div>

          <div className="pt-4 border-t border-sf-line">
            <FormButton onClick={() => navigate("/login")}>Go to Login</FormButton>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create Your Account" subtitle="Join thousands of learners today">
      <div className="space-y-8">
        {/* Progress Bar */}
        <ProgressBar current={currentStep} total={3} />

        {/* Step 1: Account Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-sf-ink mb-1">Step 1 of 3: Account Details</h3>
              <p className="text-sm text-sf-muted">Let's start with your basic information</p>
            </div>

            <FormInput
              label="Full Name"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(val) => updateField("fullName", val)}
              error={errors.fullName as string}
              icon="👤"
              required
            />

            <FormInput
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(val) => updateField("email", val)}
              error={errors.email as string}
              hint="We'll use this to verify your account and send updates"
              icon="📧"
              required
            />

            <div>
              <label className="label-base block mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.country}
                onChange={(e) => updateField("country", e.target.value)}
                className="input-base w-full"
              >
                <option value="">Select your country</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="IN">India</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="SG">Singapore</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.country && <div className="text-sm text-red-500 mt-2">⚠ {errors.country as string}</div>}
            </div>
          </div>
        )}

        {/* Step 2: Password & Security */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-sf-ink mb-1">Step 2 of 3: Secure Your Account</h3>
              <p className="text-sm text-sf-muted">Create a strong password to protect your account</p>
            </div>

            <PasswordInput
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(val) => updateField("password", val)}
              error={errors.password as string}
              showStrength
              required
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(val) => updateField("confirmPassword", val)}
              error={errors.confirmPassword as string}
              required
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
              <p className="font-semibold text-blue-900 mb-2">Password Requirements:</p>
              <ul className="space-y-1 text-blue-900">
                <li>
                  {formData.password.length >= 8 ? "✓" : "○"} At least 8 characters
                </li>
                <li>
                  {/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) ? "✓" : "○"} One
                  uppercase and one lowercase letter
                </li>
                <li>
                  {/\d/.test(formData.password) ? "✓" : "○"} One number
                </li>
                <li>
                  {/[^a-zA-Z\d]/.test(formData.password) ? "✓" : "○"} One special character (!@#$%^&*)
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 3: Role Selection */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-sf-ink mb-1">Step 3 of 3: Choose Your Role</h3>
              <p className="text-sm text-sf-muted">Select how you'll use SkillFort</p>
            </div>

            <div className="space-y-3">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => updateField("role", role.id)}
                  className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                    formData.role === role.id
                      ? "border-sf-gold bg-sf-cream"
                      : "border-sf-line hover:border-sf-gold/50 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="role"
                      checked={formData.role === role.id}
                      onChange={() => {}}
                      className="mt-1 w-5 h-5 accent-sf-gold"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{role.icon}</span>
                        <span className="font-semibold text-sf-ink">{role.title}</span>
                      </div>
                      <p className="text-sm text-sf-muted">{role.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="space-y-3 border-t border-sf-line pt-6">
              <Checkbox
                label="I agree to the Terms of Service"
                checked={formData.agreeTerms}
                onChange={(val) => updateField("agreeTerms", val)}
              />
              {errors.agreeTerms && (
                <div className="text-sm text-red-500">⚠ {String(errors.agreeTerms)}</div>
              )}

              <Checkbox
                label="I accept the Privacy Policy"
                checked={formData.agreePrivacy}
                onChange={(val) => updateField("agreePrivacy", val)}
              />
              {errors.agreePrivacy && (
                <div className="text-sm text-red-500">⚠ {String(errors.agreePrivacy)}</div>
              )}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          {currentStep !== 1 && (
            <FormButton
              variant="outline"
              onClick={() => setCurrentStep((currentStep as number) - 1 as SignupStep)}
              disabled={loading}
            >
              ← Back
            </FormButton>
          )}
          <FormButton
            onClick={handleNext}
            loading={loading}
            disabled={loading}
            fullWidth={currentStep === 1}
          >
            {currentStep === 3 ? "Create Account" : "Next Step"} →
          </FormButton>
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-sf-muted">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-semibold hover:underline">
            Sign in here
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}
