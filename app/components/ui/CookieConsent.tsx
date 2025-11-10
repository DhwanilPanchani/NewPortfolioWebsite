'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../shared/Button';
import { Cookie, X } from 'lucide-react';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Delay showing consent banner
      setTimeout(() => setShowConsent(true), 2000);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    setShowConsent(false);
    
    // Initialize analytics if accepted
    if (allAccepted.analytics) {
      initializeAnalytics();
    }
  };

  const handleAcceptSelected = () => {
    const selected = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie-consent', JSON.stringify(selected));
    setShowConsent(false);
    
    if (preferences.analytics) {
      initializeAnalytics();
    }
  };

  const handleRejectAll = () => {
    const rejected = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie-consent', JSON.stringify(rejected));
    setShowConsent(false);
  };

  const initializeAnalytics = () => {
    // Initialize your analytics here (e.g., Google Analytics, Plausible)
    console.log('Analytics initialized');
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
          <div className="mx-auto max-w-4xl">
            <div className="glass rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Cookie className="text-primary" size={24} />
                  <h3 className="text-lg font-bold">Cookie Preferences</h3>
                </div>
                <button
                  onClick={() => setShowConsent(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                You can customize your preferences or accept all cookies.
              </p>

              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3 mb-4"
                >
                  {/* Necessary Cookies */}
                  <div className="flex items-center justify-between p-3 glass rounded-lg">
                    <div>
                      <h4 className="font-semibold text-sm">Necessary Cookies</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Required for the website to function properly
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.necessary}
                      disabled
                      className="w-5 h-5 rounded accent-primary cursor-not-allowed"
                    />
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-center justify-between p-3 glass rounded-lg">
                    <div>
                      <h4 className="font-semibold text-sm">Analytics Cookies</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Help us understand how visitors interact with our website
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) =>
                        setPreferences({ ...preferences, analytics: e.target.checked })
                      }
                      className="w-5 h-5 rounded accent-primary cursor-pointer"
                    />
                  </div>

                  {/* Marketing Cookies */}
                  <div className="flex items-center justify-between p-3 glass rounded-lg">
                    <div>
                      <h4 className="font-semibold text-sm">Marketing Cookies</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Used to deliver personalized advertisements
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) =>
                        setPreferences({ ...preferences, marketing: e.target.checked })
                      }
                      className="w-5 h-5 rounded accent-primary cursor-pointer"
                    />
                  </div>
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAcceptAll}
                  className="flex-1"
                >
                  Accept All
                </Button>
                {showDetails && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleAcceptSelected}
                    className="flex-1"
                  >
                    Accept Selected
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={showDetails ? handleRejectAll : () => setShowDetails(true)}
                  className="flex-1"
                >
                  {showDetails ? 'Reject All' : 'Customize'}
                </Button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-500 mt-4 text-center">
                Read our{' '}
                <a href="/privacy-policy" className="underline hover:text-primary">
                  Privacy Policy
                </a>{' '}
                for more information
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}