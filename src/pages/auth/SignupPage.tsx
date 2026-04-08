import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { FormInput } from "../../components/form/FormInput";
import { PasswordInput } from "../../components/form/PasswordInput";
import { Checkbox } from "../../components/form/Checkbox";
import { FormButton } from "../../components/form/FormButton";
import { ProgressBar } from "../../components/form/ProgressBar";

type SignupStep = 1 | 2 | "success";

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

type Role = "student" | "instructor" | "admin";

const VALID_ROLES: Role[] = ["student", "instructor", "admin"];

type FormErrors = Partial<Record<keyof SignupFormData, string>>;

export function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState<SignupStep>(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [roleFromUrl, setRoleFromUrl] = useState<Role>("student");

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

  // Detect role from URL parameter
  useEffect(() => {
    const urlRole = searchParams.get("role") as Role | null;
    if (urlRole && VALID_ROLES.includes(urlRole)) {
      setRoleFromUrl(urlRole);
      setFormData((prev) => ({ ...prev, role: urlRole }));
    } else if (!urlRole) {
      // Redirect to /signup?role=student if no role specified
      navigate("/signup?role=student", { replace: true });
    }
  }, [searchParams, navigate]);

  const updateField = <K extends keyof SignupFormData>(field: K, value: SignupFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

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
    const newErrors: FormErrors = {};

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

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the Terms of Service";
    }

    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = "You must agree to the Privacy Policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) {
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
        <div className="space-y-6 text-center">
          <div className="text-6xl">🎉</div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-sf-ink dark:text-white">Success!</h2>
            <p className="text-sf-muted dark:text-gray-400">
              We've sent a verification email to <br />
              <span className="font-semibold text-sf-ink dark:text-white">{formData.email}</span>
            </p>
            <p className="text-sm text-sf-muted dark:text-gray-400">
              Signed up as: <span className="font-semibold text-sf-ink dark:text-white capitalize">{formData.role === "student" ? "Learner" : formData.role === "instructor" ? "Instructor" : "Administrator"}</span>
            </p>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-left dark:border-blue-900 dark:bg-blue-950">
            <p className="mb-3 text-sm font-semibold text-blue-900 dark:text-blue-200">Next Steps:</p>
            <ol className="space-y-2 text-sm text-blue-900 dark:text-blue-200">
              <li>✓ Check your inbox for verification email</li>
              <li>✓ Click the verification link to activate your account</li>
              <li>✓ Complete your profile information</li>
              <li>✓ Start exploring and learning!</li>
            </ol>
          </div>

          <div className="space-y-3 pt-4">
            <p className="text-sm text-sf-muted dark:text-gray-400">Didn't receive an email?</p>
            <button className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
              Resend verification email
            </button>
          </div>

          <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
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
        <ProgressBar current={currentStep} total={2} />

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

        {/* Step 2: Password & Terms */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-sf-ink mb-1 dark:text-white">Step 2 of 2: Secure Your Account</h3>
              <p className="text-sm text-sf-muted dark:text-gray-400">Create a strong password and agree to terms</p>
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

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm dark:border-blue-900 dark:bg-blue-950">
              <p className="mb-2 font-semibold text-blue-900 dark:text-blue-200">Password Requirements:</p>
              <ul className="space-y-1 text-blue-900 dark:text-blue-200">
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

            <div className="space-y-3 border-t border-gray-200 pt-6 dark:border-gray-700">
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
            {currentStep === 2 ? "Create Account" : "Next Step"} →
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
