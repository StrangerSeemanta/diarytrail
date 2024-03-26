export default async function detectTheme() {
  const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
  if (darkThemeMq.matches) {
    return "dark";
  } else {
    return "light";
  }
}
