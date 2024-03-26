// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme';


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.html',
    './src/**/*.jsx',
    './src/**/*.tsx',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
],
theme: {
  extend: {
    boxShadow:{
      customized:"0 20px 27px 0 rgba(0,0,0,.05)"
    },
    fontFamily: {
      sans: ["Nunito", ...defaultTheme.fontFamily.sans],
      diaryTitleAlt:["Gorditas",...defaultTheme.fontFamily.serif],
      diaryMontserrat:["Montserrat Alternates","sans-serif"],
      diaryCrimson:["Crimson Text",defaultTheme.fontFamily.serif],
      diaryNunito:["Nunito",defaultTheme.fontFamily.serif],
      diaryHandWriting:["Patrick Hand",'cursive'],
      diaryHandWritingAlt:["Loved by the King",'cursive'],
      diaryTitle:["Handlee", "cursive"],
      diarySignature:["Clicker Script", 'cursive'],
      diaryQuickSand:["Quicksand", 'sans-serif'],


    },
    backgroundColor: {
      'diaryPrimary': '#191970', // Primary color
      'diaryDarkPrimary':'#080836',
      'diarySecondary': '#FFFF99', // Secondary color
      'diaryAccent': '#FF6F61',
      "diaryDark":"#4d4b4b", // Accent color
      'diaryNeutral': '#D3D3D3', // Neutral color
      "diaryLightBlue":"#f4f7fe"
    },
    colors:{
      "diaryPrimaryText": "#FFFFFF",    
      'diaryBlueText': '#191970', // Primary color
      "diarySecondaryText": "#FFFF99",
      "diaryHiddenText": "#333333",
      "diaryErrorText": "#FF0000",
      "diaryAccentText":"#FF6F61",      "diaryLightBlue":"#f4f7fe"

    }
  },
},
  darkMode: "class",
  plugins: [ ],
}

