module.exports = {
  content: [
    "./app/**/*.{js,ts,tsx}",
    "./components/**/*.{js,ts,tsx}",
    "./src/**/*.{js,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        satoshi: ["Satoshi-Regular"],
        "satoshi-bold": ["Satoshi-Bold"],
        "satoshi-medium": ["Satoshi-Medium"],
      },
      boxShadow: {
        top: "0 -5px 10px 0 rgba(0, 0, 0, 0.1)",
        "top-xl": "0 -10px 20px 0 rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [],
};
