const gridDemo = document.querySelector("[data-demo-grid]");
const toggleButton = document.querySelector("[data-grid-toggle]");
const status = document.querySelector("[data-grid-status]");

const breakpointQueries = [
  { label: "XS", query: window.matchMedia("(max-width: 320px)") },
  { label: "SM", query: window.matchMedia("(min-width: 321px) and (max-width: 480px)") },
  { label: "MD", query: window.matchMedia("(min-width: 481px) and (max-width: 768px)") },
  { label: "LG", query: window.matchMedia("(min-width: 769px) and (max-width: 1024px)") },
  { label: "XL", query: window.matchMedia("(min-width: 1025px) and (max-width: 1280px)") },
];

function updateBreakpointStatus() {
  const activeBreakpoint = breakpointQueries.find(({ query }) => query.matches);
  const label = activeBreakpoint ? activeBreakpoint.label : "XL+";

  status.textContent = `Viewport: ${label} (${window.innerWidth}px)`;
}

toggleButton.addEventListener("click", () => {
  const isHidden = gridDemo.classList.toggle("demo-grid--overlay-hidden");
  toggleButton.textContent = isHidden ? "Show grid" : "Hide grid";
  toggleButton.setAttribute("aria-pressed", String(!isHidden));
});

breakpointQueries.forEach(({ query }) => {
  query.addEventListener("change", updateBreakpointStatus);
});

window.addEventListener("resize", updateBreakpointStatus);
updateBreakpointStatus();
