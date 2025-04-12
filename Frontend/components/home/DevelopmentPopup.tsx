'use client';

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { InfoIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const getCookie = (name: string) => {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')[1];
  return cookieValue ? { name, value: cookieValue } : null;
};

const setCookie = (name: string, value: string, options: { expires: number }) => {
  document.cookie = `${name}=${value}; expires=${new Date(Date.now() + options.expires).toUTCString()}; path=/`;
};

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 14,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
    transition: {
      ease: "easeInOut",
    },
  },
};



const DevelopmentPopup = () => {
  const [showPopup, setShowPopup] = useState(false);


  useEffect(() => {
    const lastVisit = getCookie('lastVisit');
    const now = new Date().getTime();
    const period = 1000 * 60 * 60; // 1 hour
    if (!lastVisit || now - parseInt(lastVisit.value) > period) {
      setShowPopup(true);
      setCookie('lastVisit', now.toString(), { expires: 1000 * 60 * 60 * 24 });
    }
  }, []);

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-55 z-50">
          <motion.div 
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative top-[30%] flex gap-2 bg-slate-950 bg-opacity-85 p-4 rounded-lg shadow-lg max-w-sm w-full z-91">
            <div className="flex grow gap-3">
              <InfoIcon
                className="mt-0.5 shrink-0 text-accent"
                size={16}
                aria-hidden="true"
                />
              <div className="flex grow flex-col gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Huomio!</p>
                  <p className="text-muted-foreground text-sm">
                    Tämä sivu on vielä kehitysvaiheessa ja saattaa sisältää virheitä.
                  </p>
                </div>
                <div>
                  <Button className="text-white bg-neutral-600" size="sm" onClick={handleClose}>Jatka</Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DevelopmentPopup;
