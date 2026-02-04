import React from 'react';
import { motion } from 'framer-motion';

/*
  GlassCard functional component define kar rahe hain.
  Reason: Hum chahte hain ki glassmorphism wala card bar-bar likhna na pade.
  Params: 
    - children: Card ke andar ka content.
    - className: Custom CSS classes allowed hain.
    - delay: Animation ka start delay.
*/
const GlassCard = ({ children, className = '', delay = 0 }) => {
    return (
        /* 
           motion.div use kar rahe hain ordinary div ke bajaye.
           Reason: Framer Motion library se animations add karne ke liye.
        */
        <motion.div
            /* 
               Initial state: Opacity 0 (invisible) aur Y-axis par 20px neeche.
               Reason: Entry effect smoothly niche se upar aane wala lagega.
            */
            initial={{ opacity: 0, y: 20 }}

            /* 
               Animate state: Opacity 1 (fully visible) aur Y-axis 0 (apni jagah par).
            */
            animate={{ opacity: 1, y: 0 }}

            /* 
               Transition: 0.5 second ka duration aur 'easeInOut' easing.
               Reason: Animation natural lagni chahiye, jerky nahi.
            */
            transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}

            /* 
               ClassName string build kar rahe hain.
               'glass': Index.css se glass effect styles laata hai.
               'rounded-2xl': Corners ko round karta hai (Apple style).
               'p-6': Padding 1.5rem deta hai content ke liye.
               '${className}': Agar parent ne koi extra class bheji hai to wo bhi add hogi.
            */
            className={`glass rounded-2xl p-6 ${className}`}
        >
            {/* 
         Card ke andar ka actual content yahan render hoga.
      */}
            {children}
        </motion.div>
    );
};

/* Component ko export kar rahe hain taaki baaki files mein use ho sake */
export default GlassCard;
