import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { createUserProfile, getUserProfile, getUserProfileByEmail, generateUniqueUsername } from '../lib/db';
import { UserProfile } from '../types';
import { Music, X, ShieldAlert, Sparkles, Check, Chrome, Mail, Camera, Upload, Wind, KeyRound, CheckCircle2, MailCheck, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CARTOON_AVATARS = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Bella",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Buddy",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Milo",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Leo",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Chloe",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Max",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Lily",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe"
];

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (profile: UserProfile) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Forgot Password state
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Email verification state
  const [verificationSent, setVerificationSent] = useState(false);
  const [createdProfile, setCreatedProfile] = useState<UserProfile | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  // Profile fields (only for sign up)
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Guru'>('Beginner');
  const [bansuriType, setBansuriType] = useState('E Bass');
  const [location, setLocation] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string>(''); // No image assigned initially
  const [photoType, setPhotoType] = useState<'none' | 'custom' | 'cartoon'>('none');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Account credentials, Step 2: Bansuri Profile details

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setIsForgotPassword(false);
    setResetEmail('');
    setResetSent(false);
    setVerificationSent(false);
    setCreatedProfile(null);
    setResendLoading(false);
    setResendMsg('');
    setDisplayName('');
    setBio('');
    setLevel('Beginner');
    setBansuriType('E Bass');
    setLocation('');
    setProfilePhoto('');
    setPhotoType('none');
    setError('');
    setLoading(false);
    setStep(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !resetEmail.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail.trim());
      setResetSent(true);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.message?.includes('user-not-found')) {
        setError("No account found with this email address.");
      } else if (err.code === 'auth/invalid-email' || err.message?.includes('invalid-email')) {
        setError("Please enter a valid email address.");
      } else {
        setError(err.message || "Failed to send password reset email.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendMsg('');
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setResendMsg("Verification email resent! Please check your inbox and spam folder.");
      } else if (email && password) {
        const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
        await sendEmailVerification(credential.user);
        await signOut(auth);
        setResendMsg("Verification email resent! Please check your inbox and spam folder.");
      } else {
        setResendMsg("Please enter your email and password on the Sign In screen to resend the verification email.");
      }
    } catch (err: any) {
      console.error(err);
      setResendMsg("Could not resend email: " + (err.message || "Please check your email and password."));
    } finally {
      setResendLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      let user;
      try {
        const result = await signInWithPopup(auth, provider);
        user = result.user;
      } catch (popupError: any) {
        console.warn("Popup blocked or iframe restriction:", popupError);
        if (popupError.code === 'auth/unauthorized-domain') {
          throw new Error("This domain (e.g. flutesangam.onrender.com) is not authorized in your Firebase Project! To fix this: Go to Firebase Console -> Authentication -> Settings tab -> Authorized Domains, click 'Add domain', and add 'flutesangam.onrender.com'. Then refresh and try again!");
        }
        if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/operation-not-supported-in-this-environment') {
          throw new Error("Google login is constrained by iframe/sandbox restrictions. Please open the app in a new tab (button at top right) to log in with real Google, or use the 'Instantly Join with Demo' option below!");
        }
        if (popupError.code === 'auth/operation-not-allowed') {
          throw new Error("Google sign-in is disabled in your Firebase project. Please enable it in the Firebase Console under Authentication -> Sign-in Method -> Google, then retry!");
        }
        if (popupError.code === 'auth/popup-closed-by-user') {
          throw new Error("The sign-in popup was closed before completing the sign-in. Please try again.");
        }
        throw popupError;
      }

      const profile = await getUserProfile(user.uid);
      if (profile && (profile.isDeleted || profile.status === 'deleted')) {
        await signOut(auth);
        throw new Error("Invalid username or password");
      }
      if (profile) {
        onAuthSuccess(profile);
        onClose();
      } else {
        const name = user.displayName || user.email?.split('@')[0] || "Flute Sadhaka";
        const uniqueUsername = await generateUniqueUsername(name);
        const newProfile = await createUserProfile(user.uid, {
          displayName: name,
          username: uniqueUsername,
          email: user.email || `${user.uid}@flutesangam-google.com`,
          photoURL: user.photoURL || CARTOON_AVATARS[0],
          bio: "Joined FluteSangam via Google Sign-In.",
          level: "Beginner",
          bansuriType: "C Natural",
          location: "Global"
        });
        if (newProfile) {
          onAuthSuccess(newProfile);
          onClose();
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed Google authentication.");
    } finally {
      setLoading(false);
    }
  };

  const COMMON_BREACHED_PASSWORDS = [
    '123456', '12345678', 'password', 'password123', 'admin123', 'flute123',
    '123456789', '12345', 'qwerty', '1234567', 'dragon', 'p@ssword', 'letmein',
    'welcome', '1234567890', 'abc12345'
  ];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (step === 1) {
          if (!email || !email.trim() || !password || password.length < 8) {
            throw new Error("Please enter a valid email address and a password of at least 8 characters.");
          }
          if (COMMON_BREACHED_PASSWORDS.includes(password.trim().toLowerCase())) {
            throw new Error("This password is known to be in data leaks. Please choose a unique password (e.g., FluteSadhaka#2026).");
          }

          // Check if an account already exists with this email address (via Google or Email auth)
          const existingProf = await getUserProfileByEmail(email.trim());
          if (existingProf) {
            throw new Error("An account with this email address already exists. Please sign in instead, or use 'Forgot password?' to set a password for email login.");
          }

          try {
            const methods = await fetchSignInMethodsForEmail(auth, email.trim());
            if (methods && methods.length > 0) {
              throw new Error("An account with this email address already exists. Please sign in instead, or use 'Forgot password?' to set a password for email login.");
            }
          } catch (fErr: any) {
            if (fErr.message?.includes("already exists")) throw fErr;
          }

          setStep(2);
          setLoading(false);
          return;
        }

        // Strict Step 2 Validations BEFORE creating account in Firebase Auth
        if (!displayName || !displayName.trim()) {
          throw new Error("Please fill in your Name before signing up.");
        }
        if (!location || !location.trim()) {
          throw new Error("Please fill in your Location before signing up.");
        }
        if (!profilePhoto || !profilePhoto.trim()) {
          throw new Error("Please select a profile picture: either upload a custom photo or choose one of the cartoon avatars.");
        }

        // If bio is blank or whitespace, default to "N/A"
        const finalBio = bio && bio.trim() ? bio.trim() : "N/A";

        // Create user in firebase auth
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const user = userCredential.user;
        const userId = user.uid;
        const userEmail = user.email || email.trim();

        // Send Email Verification
        try {
          await sendEmailVerification(user);
        } catch (vErr) {
          console.warn("Error sending email verification link:", vErr);
        }

        // Create profile in firestore
        const uniqueUsername = await generateUniqueUsername(displayName.trim());
        const profile = await createUserProfile(userId, {
          displayName: displayName.trim(),
          username: uniqueUsername,
          email: userEmail,
          photoURL: profilePhoto,
          bio: finalBio,
          level,
          bansuriType: bansuriType || "C Natural",
          location: location.trim()
        });

        if (profile) {
          setCreatedProfile(profile);
          setVerificationSent(true);
          await signOut(auth); // User must verify email before logging in
        } else {
          throw new Error("Failed to create profile in database.");
        }
      } else {
        // Sign in
        const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
        const user = userCredential.user;

        // Reload user to get latest emailVerified status
        await user.reload();

        if (!user.emailVerified) {
          try {
            await sendEmailVerification(user);
          } catch (vErr) {
            console.warn("Error sending verification email during sign in attempt:", vErr);
          }
          setVerificationSent(true);
          setResendMsg("Verification required: We've emailed a verification link to " + (user.email || email.trim()) + ". Please verify your email before logging in.");
          await signOut(auth);
          setLoading(false);
          return;
        }
        
        const profile = await getUserProfile(user.uid);
        if (profile && (profile.isDeleted || profile.status === 'deleted')) {
          await signOut(auth);
          throw new Error("Invalid username or password");
        }
        if (profile) {
          onAuthSuccess(profile);
          onClose();
        } else {
          // Create a fallback profile if none exists
          const fallbackUsername = await generateUniqueUsername(user.displayName || email.split('@')[0]);
          const fallbackProfile = await createUserProfile(user.uid, {
            displayName: user.displayName || email.split('@')[0],
            username: fallbackUsername,
            email: user.email || email,
            photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
            bio: "Flute enthusiast",
            level: "Beginner",
            bansuriType: "C Natural",
            location: "Global"
          });
          if (fallbackProfile) {
            onAuthSuccess(fallbackProfile);
            onClose();
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use' || (err.message && err.message.includes('email-already-in-use')) || (err.message && err.message.includes('already exists'))) {
        setError("An account with this email address already exists. Please sign in instead, or click 'Forgot password?' if you signed up with Google.");
      } else if (!isSignUp) {
        if (err.code === 'auth/operation-not-allowed' || (err.message && err.message.includes('operation-not-allowed'))) {
          setError("Email & Password registration is currently disabled in your Firebase project. To fix this, please go to Firebase Console -> Authentication -> Sign-in Method, and enable 'Email/Password'.");
        } else {
          // Check if profile exists by email to guide user
          const existingProf = email ? await getUserProfileByEmail(email.trim()) : null;
          if (existingProf) {
            setError("Incorrect password. If you originally signed up with Google, click 'Forgot password?' below to set an email password, or sign in with Google.");
          } else {
            setError("Invalid username or password");
          }
        }
      } else if (err.code === 'auth/operation-not-allowed' || (err.message && err.message.includes('operation-not-allowed'))) {
        setError("Email & Password registration is currently disabled in your Firebase project. To fix this, please go to Firebase Console -> Authentication -> Sign-in Method, and enable 'Email/Password'.");
      } else if (err.code === 'auth/invalid-email' || err.message?.includes('invalid-email')) {
        setError("Please enter a valid email address.");
      } else {
        setError(err.message || "An authentication error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 pb-24 sm:p-4 bg-black/40 backdrop-blur-md" id="auth-modal-overlay">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md bg-white border border-bamboo-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100dvh-6.5rem)] sm:max-h-[92vh] my-auto"
        id="auth-modal-card"
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-bamboo-700 to-bamboo-600 px-6 py-6 text-white relative shrink-0">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 transition"
            id="auth-modal-close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <Wind className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-xl font-semibold font-display tracking-wide">
                {verificationSent 
                  ? "Verify Your Email"
                  : isForgotPassword 
                  ? "Reset Password"
                  : isSignUp 
                  ? "Join FluteSangam" 
                  : "Welcome Back"}
              </h2>
              <p className="text-xs text-bamboo-100 mt-1">
                {verificationSent 
                  ? "Check your inbox to verify your account"
                  : isForgotPassword 
                  ? "Send password reset link to your email"
                  : isSignUp 
                  ? "Connect with flute and bansuri players worldwide" 
                  : "Sign in to share your musical journey"}
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-start space-x-2" id="auth-error-banner">
              <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {verificationSent ? (
            <div className="space-y-4 text-center py-2 animate-fadeIn" id="verification-sent-screen">
              <div className="mx-auto w-16 h-16 bg-bamboo-50 rounded-full flex items-center justify-center text-bamboo-700 shadow-inner">
                <MailCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Email Verification Sent!</h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-1">
                  We've sent a verification email link to <strong className="text-bamboo-800">{email}</strong>. Please check your inbox (and spam folder) to verify your account.
                </p>
              </div>

              {resendMsg && (
                <div className="p-2.5 bg-bamboo-50 border border-bamboo-200 text-bamboo-800 text-xs rounded-lg">
                  {resendMsg}
                </div>
              )}

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  className="w-full py-2.5 bg-bamboo-50 hover:bg-bamboo-100 text-bamboo-700 border border-bamboo-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>{resendLoading ? "Resending..." : "Resend Verification Email"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVerificationSent(false);
                    setStep(1);
                    setResendMsg('');
                    setError('');
                  }}
                  className="w-full py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-medium rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Change Email / Go Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (createdProfile) {
                      onAuthSuccess(createdProfile);
                    }
                    handleClose();
                  }}
                  className="w-full py-2.5 bg-bamboo-700 hover:bg-bamboo-600 text-white text-xs font-semibold rounded-xl transition shadow-sm cursor-pointer"
                >
                  Continue to App
                </button>
              </div>
            </div>
          ) : isForgotPassword ? (
            <div className="space-y-4 animate-fadeIn" id="forgot-password-screen">
              {resetSent ? (
                <div className="space-y-4 text-center py-2">
                  <div className="mx-auto w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shadow-inner">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Reset Link Sent</h3>
                    <p className="text-xs text-gray-600 leading-relaxed mt-1">
                      We've emailed a password reset link to <strong className="text-gray-900">{resetEmail}</strong>. Please check your inbox and follow the instructions to reset your password.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setResetSent(false);
                      setError('');
                    }}
                    className="w-full py-2.5 bg-bamboo-700 text-white hover:bg-bamboo-600 text-xs font-semibold rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Sign In</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4" id="forgot-password-form">
                  <div className="text-center pb-1">
                    <div className="mx-auto w-12 h-12 bg-bamboo-50 rounded-full flex items-center justify-center text-bamboo-700 mb-2">
                      <KeyRound className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">Reset Your Password</h3>
                    <p className="text-xs text-gray-500 mt-1">Enter your registered email address to receive a password reset link.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bamboo-600 focus:border-transparent"
                    />
                  </div>

                  <div className="flex space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(false);
                        setError('');
                      }}
                      className="w-1/3 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-medium rounded-xl transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2.5 bg-bamboo-700 text-white hover:bg-bamboo-600 text-xs font-semibold rounded-xl transition shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      {loading ? "Sending Link..." : "Send Reset Link"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : isSignUp && step === 2 ? (
            <form onSubmit={handleAuth} className="space-y-4 animate-fadeIn" id="auth-form-step2">
              {/* STEP 2: Profile Details */}
              <div className="space-y-4">
                <div className="text-center pb-2 border-b border-gray-100">
                  <span className="inline-flex items-center text-xs font-semibold text-bamboo-600 bg-bamboo-50 px-2.5 py-1 rounded-full">
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" />
                    Step 2: Customize Your Flute Profile
                  </span>
                </div>

                {/* Profile Picture Section */}
                <div className="space-y-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100" id="signup-avatar-selector-section">
                  <label className="block text-xs font-semibold text-gray-700">
                    Profile Picture Selection <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Current Selected Avatar Preview */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {profilePhoto ? (
                        <img 
                          src={profilePhoto} 
                          alt="Avatar Preview" 
                          className="w-14 h-14 rounded-full object-cover border-2 border-bamboo-600 shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                          <Camera className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-[11px] font-medium text-gray-500 leading-normal">
                        {profilePhoto 
                          ? (photoType === 'custom' ? "Custom uploaded image" : "Cartoon avatar selected") 
                          : "No profile picture selected yet. (Required)"}
                      </p>
                      
                      {/* Upload Button */}
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => document.getElementById('signup-photo-upload')?.click()}
                          className="px-2.5 py-1 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-[11px] font-bold text-gray-700 transition flex items-center gap-1 shadow-3xs cursor-pointer"
                        >
                          <Upload className="w-3 h-3 text-bamboo-700" />
                          Upload Photo
                        </button>
                        <input 
                          type="file"
                          id="signup-photo-upload"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setProfilePhoto(reader.result as string);
                                setPhotoType('custom');
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        {profilePhoto && (
                          <button
                            type="button"
                            onClick={() => {
                              setProfilePhoto('');
                              setPhotoType('none');
                            }}
                            className="text-[10px] text-red-600 hover:underline font-semibold cursor-pointer"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cartoon avatar chooser */}
                  <div className="space-y-1.5 pt-1.5 border-t border-gray-100">
                    <p className="text-[11px] font-semibold text-gray-600">Or choose one of the 10 default cartoon avatars:</p>
                    <div className="grid grid-cols-5 gap-2 px-1 justify-items-center">
                      {CARTOON_AVATARS.map((avatarUrl, index) => {
                        const isSelected = profilePhoto === avatarUrl;
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setProfilePhoto(avatarUrl);
                              setPhotoType('cartoon');
                            }}
                            className={`relative rounded-full p-0.5 border-2 transition-all hover:scale-105 cursor-pointer ${
                              isSelected ? 'border-bamboo-600 scale-105 bg-bamboo-50' : 'border-transparent hover:border-gray-200'
                            }`}
                          >
                            <img 
                              src={avatarUrl} 
                              alt={`Cartoon ${index + 1}`} 
                              className="w-9 h-9 rounded-full bg-white"
                              referrerPolicy="no-referrer"
                            />
                            {isSelected && (
                              <span className="absolute -top-1 -right-1 bg-bamboo-600 text-white p-0.5 rounded-full shadow-md">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Full Name / Display Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bamboo-600 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Playing Level</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-bamboo-600 focus:border-transparent"
                    >
                      <option value="Beginner">Beginner (Sadhaka)</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Guru">Guru / Expert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Primary Flute Key</label>
                    <input
                      type="text"
                      required
                      value={bansuriType}
                      onChange={(e) => setBansuriType(e.target.value)}
                      placeholder="e.g. E Bass or C Medium"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bamboo-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Your Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mumbai, India or New York, USA"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bamboo-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Short Bio <span className="text-gray-400 font-normal">(Optional - defaults to N/A)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell other flute enthusiasts about your journey, or leave blank for N/A..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bamboo-600 focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-xl transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 bg-bamboo-700 text-white hover:bg-bamboo-600 text-sm font-semibold rounded-xl transition flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
                  >
                    {loading ? "Creating Sangam Account..." : "Create Account & Enter"}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            // EMAIL & PASSWORD METHOD
            <form onSubmit={handleAuth} className="space-y-4" id="auth-form-email">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bamboo-600 focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-700">Password</label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setError('');
                        setResetSent(false);
                        setResetEmail(email);
                      }}
                      className="text-[11px] font-semibold text-bamboo-700 hover:underline cursor-pointer"
                      id="forgot-password-link"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  name={isSignUp ? "new-password" : "password"}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignUp ? "At least 8 characters (e.g. FluteSadhaka#2026)" : "Enter your password"}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bamboo-600 focus:border-transparent"
                />
                {isSignUp && (
                  <p className="text-[11px] text-gray-500 mt-1">
                    Must be at least 8 characters. Choose a unique password to protect your account.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-bamboo-700 text-white hover:bg-bamboo-600 text-sm font-semibold rounded-xl transition flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
              >
                {loading ? (
                  "Processing..."
                ) : isSignUp ? (
                  "Continue to Profile Setup"
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          )}

          {/* GOOGLE SIGN IN BUTTON & TOGGLE MODE */}
          {!verificationSent && !isForgotPassword && step === 1 && (
            <div className="space-y-3 pt-3 border-t border-gray-100/60 mt-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-sm font-semibold rounded-xl transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
                id="google-login-btn"
              >
                <Chrome className="w-4.5 h-4.5 text-red-500 shrink-0" />
                <span>Continue with Google</span>
              </button>

              <div className="text-center text-xs text-gray-600 pt-1">
                {isSignUp ? "Already a member of the Sangam?" : "New to the Flute Community?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                  }}
                  className="text-bamboo-700 hover:underline font-bold cursor-pointer"
                  id="toggle-auth-mode"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </div>

              <p className="text-[10px] text-gray-500 text-center leading-normal px-2 pt-2 border-t border-gray-100/60">
                FluteSangam uses email and Google Sign-In to authenticate users, create member accounts, and securely allow flutists to post recitals, comments, and song notation requests. We access your basic profile details (name, email, photo) solely for account creation and community identification.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
