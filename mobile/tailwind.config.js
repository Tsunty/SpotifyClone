module.exports = {
  content: [
    "./app/**/*.{js,ts,tsx}",
    "./components/**/*.{js,ts,tsx}",
    "./src/**/*.{js,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ["Satoshi-Regular"],
        "satoshi-bold": ["Satoshi-Bold"],
        "satoshi-medium": ["Satoshi-Medium"],
      },},
  },
  plugins: [],
};
