/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { useESM: true }],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@radix|class-variance-authority|clsx|tailwind-merge|recharts|embla-carousel-react|cmdk|date-fns|dayjs|input-otp|vaul|next-themes|lucide-react|sonner|react-hook-form|@hookform)/)",
  ],
};

module.exports = config;
