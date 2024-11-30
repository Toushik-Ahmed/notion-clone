import stringToColor from '@/lib/stringToColor';
import { motion } from 'framer-motion';

function FollowPointer({
  x,
  y,
  info,
}: {
  x: number;
  y: number;
  info: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const color = stringToColor(info.email || '1');

  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{
        top: y,
        left: x,
        transform: 'translate(-50%, -50%)', // Center the cursor
      }}
      initial={{
        opacity: 0,
        scale: 0.5,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0,
      }}
      transition={{
        duration: 0.2,
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
    >
      {/* Cursor Pointer */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
      >
        <path
          d="M7 7L12 2L17 7M12 2V16"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle
          cx="12"
          cy="20"
          r="2"
          fill={color}
          stroke={color}
          strokeWidth="2"
        />
      </svg>

      {/* User Info Tooltip */}
      {(info.name || info.email) && (
        <motion.div
          className="absolute top-full left-1/2 mt-2 -translate-x-1/2
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            rounded-lg shadow-lg
            px-3 py-2 text-sm
            text-gray-700 dark:text-gray-200"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {info.name || info.email}
        </motion.div>
      )}
    </motion.div>
  );
}

export default FollowPointer;
