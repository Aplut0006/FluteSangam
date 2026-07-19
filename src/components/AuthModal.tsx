import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { createUserProfile, getUserProfile, generateUniqueUsername } from '../lib/db';
import { UserProfile } from '../types';
import { Music, X, ShieldAlert, Sparkles, Check, Chrome, Mail, Camera, Upload, Wind } from 'lucide-react';
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

  if (!isOpen) return null;

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
          throw new Error("The sign-in popup was closed before completing the sign-in. Please try again, or use the 'Instantly Join with Demo' option below!");
        }
        throw popupError;
      }

      const profile = await getUserProfile(user.uid);
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
          photoURL: user.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (step === 1) {
          if (!email || !password || password.length < 6) {
            throw new Error("Please enter a valid email and a password of at least 6 characters.");
          }
          setStep(2);
          setLoading(false);
          return;
        }

        // Create user in firebase auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;
        const userEmail = userCredential.user.email || email;

        if (!profilePhoto) {
          throw new Error("Please select a profile picture: either upload a custom photo or pick one of the 5 default cartoon avatars.");
        }

         // Create profile in firestore
         const uniqueUsername = await generateUniqueUsername(displayName || "sadhaka");
         const profile = await createUserProfile(userId, {
           displayName: displayName || "Sadhaka",
           username: uniqueUsername,
           email: userEmail,
           photoURL: profilePhoto,
           bio: bio || "Love playing classical bansuri.",
           level,
           bansuriType: bansuriType || "C Natural",
           location: location || "India"
         });

        if (profile) {
          onAuthSuccess(profile);
          onClose();
        } else {
          throw new Error("Failed to create profile in database.");
        }
      } else {
        // Sign in
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        const profile = await getUserProfile(user.uid);
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
      if (err.code === 'auth/operation-not-allowed' || (err.message && err.message.includes('operation-not-allowed'))) {
        setError("Email & Password registration is currently disabled in your Firebase project. To fix this, please go to Firebase Console -> Authentication -> Sign-in Method, and enable 'Email/Password'. Alternatively, to continue testing without changing any Firebase settings, click the 'Instantly Join with Demo' button below to bypass this immediately!");
      } else if (err.code === 'auth/email-already-in-use' || (err.message && err.message.includes('auth/email-already-in-use') || err.message?.includes('email-already-in-use'))) {
        setError("Email Already taken");
      } else {
        setError(err.message || "An authentication error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    const demoEmail = `bansuri_lover_${Math.floor(Math.random() * 1000)}@flutesangam.com`;
    const demoPassword = 'password123';
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, demoEmail, demoPassword);
      const user = userCredential.user;
      
      const names = ["Anoop", "Meenakshi", "Rohan", "Siddharth", "Kriti"];
      const locations = ["Varanasi, India", "Pune, India", "California, USA", "London, UK", "New Delhi, India"];
      const bansuris = ["E Bass", "C Natural Medium", "G Bass", "A Natural Medium"];
      const levels: ('Beginner' | 'Intermediate' | 'Advanced')[] = ["Beginner", "Intermediate", "Advanced"];

      const name = names[Math.floor(Math.random() * names.length)];
      const loc = locations[Math.floor(Math.random() * locations.length)];
      const ban = bansuris[Math.floor(Math.random() * bansuris.length)];
      const lev = levels[Math.floor(Math.random() * levels.length)];
      
      const demoUsername = await generateUniqueUsername(name);
      const profile = await createUserProfile(user.uid, {
        displayName: name,
        username: demoUsername,
        email: demoEmail,
        photoURL: CARTOON_AVATARS[Math.floor(Math.random() * CARTOON_AVATARS.length)],
        bio: `Bansuri learner and enthusiast. Currently playing the ${ban} flute and loving classical music!`,
        level: lev,
        bansuriType: ban,
        location: loc
      });

      if (profile) {
        onAuthSuccess(profile);
        onClose();
      }
    } catch (err: any) {
      console.warn("Firebase Auth demo login failed, falling back to simulated session:", err);
      // Generate a unique dummy UID that exists in Firestore users
      const mockUid = `demo_bypass_${Math.floor(Math.random() * 1000000)}`;
      const names = ["Anoop (Simulated)", "Meenakshi (Simulated)", "Rohan (Simulated)", "Siddharth (Simulated)", "Kriti (Simulated)"];
      const locations = ["Varanasi, India", "Pune, India", "California, USA", "London, UK", "New Delhi, India"];
      const bansuris = ["E Bass", "C Natural Medium", "G Bass", "A Natural Medium"];
      const levels: ('Beginner' | 'Intermediate' | 'Advanced')[] = ["Beginner", "Intermediate", "Advanced"];

      const name = names[Math.floor(Math.random() * names.length)];
      const loc = locations[Math.floor(Math.random() * locations.length)];
      const ban = bansuris[Math.floor(Math.random() * bansuris.length)];
      const lev = levels[Math.floor(Math.random() * levels.length)];

      const demoUsernameSim = await generateUniqueUsername(name);
      const profile = await createUserProfile(mockUid, {
        displayName: name,
        username: demoUsernameSim,
        email: demoEmail,
        photoURL: CARTOON_AVATARS[Math.floor(Math.random() * CARTOON_AVATARS.length)],
        bio: `Bansuri learner and enthusiast. Playing the ${ban} flute. (Simulated Demo Session)`,
        level: lev,
        bansuriType: ban,
        location: loc,
        phoneNumber: `+9198765${Math.floor(10000 + Math.random() * 90000)}`
      });

      if (profile) {
        onAuthSuccess(profile);
        onClose();
      } else {
        setError("Failed to create simulated session.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md" id="auth-modal-overlay">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md bg-white border border-bamboo-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        id="auth-modal-card"
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-bamboo-700 to-bamboo-600 px-6 py-6 text-white relative shrink-0">
          <button 
            onClick={onClose}
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
                {isSignUp ? "Join FluteSangam" : "Welcome Back"}
              </h2>
              <p className="text-xs text-bamboo-100 mt-1">
                {isSignUp ? "Connect with flute and bansuri players worldwide" : "Sign in to share your musical journey"}
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

          {isSignUp && step === 2 ? (
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
                  <label className="block text-xs font-semibold text-gray-700">Profile Picture Selection</label>
                  
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
                          : "No profile picture selected yet."}
                      </p>
                      
                      {/* Upload Button */}
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => document.getElementById('signup-photo-upload')?.click()}
                          className="px-2.5 py-1 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-[11px] font-bold text-gray-700 transition flex items-center gap-1 shadow-3xs"
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
                            className="text-[10px] text-red-600 hover:underline font-semibold"
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
                            className={`relative rounded-full p-0.5 border-2 transition-all hover:scale-105 ${
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
                  <label className="block text-xs font-medium text-gray-700 mb-1">Full Name / Display Name</label>
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
                  <label className="block text-xs font-medium text-gray-700 mb-1">Your Location</label>
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
                  <label className="block text-xs font-medium text-gray-700 mb-1">Short Bio</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell other flute enthusiasts about your journey, favorite ragas, or learning goals..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bamboo-600 focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-xl transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 bg-bamboo-700 text-white hover:bg-bamboo-600 text-sm font-semibold rounded-xl transition flex items-center justify-center space-x-2 shadow-sm"
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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bamboo-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bamboo-600 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-bamboo-700 text-white hover:bg-bamboo-600 text-sm font-semibold rounded-xl transition flex items-center justify-center space-x-2 shadow-sm"
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

          {/* GOOGLE SIGN IN BUTTON */}
          {step === 1 && (
            <div className="space-y-4 pt-3 border-t border-gray-100/60 mt-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-sm font-semibold rounded-xl transition flex items-center justify-center space-x-2 shadow-xs"
              >
                <Chrome className="w-4.5 h-4.5 text-red-500 shrink-0" />
                <span>Continue with Google</span>
              </button>
            </div>
          )}

          {/* Toggle auth mode or run demo */}
          {step === 1 && (
            <div className="mt-6 space-y-4 border-t border-gray-100 pt-5">
              <div className="text-center text-xs text-gray-500">
                {isSignUp ? "Already a member of the Sangam?" : "New to the Flute Community?"}{" "}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                  }}
                  className="text-bamboo-700 hover:underline font-semibold"
                  id="toggle-auth-mode"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="flex-shrink mx-3 text-gray-400 text-[10px] tracking-widest uppercase">Or Quick Test</span>
                <div className="flex-grow border-t border-gray-100"></div>
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full py-2 bg-yellow-50 border border-yellow-200 text-yellow-800 hover:bg-yellow-100/70 text-xs font-semibold rounded-lg transition flex items-center justify-center space-x-2"
                id="demo-login-btn"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-600 shrink-0" />
                <span>Instantly Join with Demo Flutist Profile</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
