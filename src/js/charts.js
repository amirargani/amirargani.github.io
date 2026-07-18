/**
 * Amir Argani - Dashboard Visualisations Engine (Radar, Matrix, Bar, Column)
 */

// Data config for categories (colors, frequencies for 2D matrix, and localized names)
const chartDataConfig = {
  cat_data_science: {
    color: "#00f2fe",
    grad: "#cyanGrad",
    freq: 85,
    nameEn: "Data Analysis & BI Tools",
    nameDe: "Datenanalyse & BI Tools",
    skillsEn: ["Exploratory Data Analysis", "Machine Learning", "Streamlit", "Power BI", "Tableau", "Apache Spark", "Excel"],
    skillsDe: ["Exploratory Data Analysis", "Machine Learning", "Streamlit", "Power BI", "Tableau", "Apache Spark", "Excel"]
  },
  cat_programming: {
    color: "#7f00ff",
    grad: "#purpleGrad",
    freq: 95,
    nameEn: "Programming",
    nameDe: "Programmierung",
    skillsEn: ["Python (Pandas, NumPy)", "C# (LINQ, Generics, Async)", "JavaScript (ES6+, DOM)", "HTML5 & CSS3"],
    skillsDe: ["Python (Pandas, NumPy)", "C# (LINQ, Generics, Async)", "JavaScript (ES6+, DOM)", "HTML5 & CSS3"]
  },
  cat_web_dev: {
    color: "#2575fc",
    grad: "#blueGrad",
    freq: 75,
    nameEn: "Web Development",
    nameDe: "Web-Entwicklung",
    skillsEn: ["ASP.NET Core Web API", "ASP.NET Core MVC", "ASP.NET WebForms", "HTML & CSS", "JavaScript & AJAX"],
    skillsDe: ["ASP.NET Core Web API", "ASP.NET Core MVC", "ASP.NET WebForms", "HTML & CSS", "JavaScript & AJAX"]
  },
  cat_app_dev: {
    color: "#ff0844",
    grad: "#pinkGrad",
    freq: 40,
    nameEn: "App Development",
    nameDe: "App-Entwicklung",
    skillsEn: ["Windows Forms Desktop", "WPF (XAML)", "Android App Dev", "iOS App Dev"],
    skillsDe: ["Windows Forms Desktop", "WPF (XAML)", "Android-App-Entwicklung", "iOS-App-Entwicklung"]
  },
  cat_cloud_devops: {
    color: "#ff7b00",
    grad: "#orangeGrad",
    freq: 70,
    nameEn: "Cloud Computing",
    nameDe: "Cloud Computing",
    skillsEn: ["AWS", "Azure", "GCP"],
    skillsDe: ["AWS", "Azure", "GCP"]
  },
  cat_databases: {
    color: "#00ff87",
    grad: "#emeraldGrad",
    freq: 85,
    nameEn: "Databases",
    nameDe: "Datenbanken",
    skillsEn: ["Microsoft SQL Server", "SQLite", "T-SQL Stored Procedures / Triggers", "Relational Database Design"],
    skillsDe: ["Microsoft SQL Server", "SQLite", "T-SQL Stored Procedures / Triggers", "Relationales Datenbankdesign"]
  },
  cat_automation_etl: {
    color: "#3f51b5",
    grad: "#indigoGrad",
    freq: 80,
    nameEn: "Automation & ETL",
    nameDe: "Automatisierung & ETL",
    skillsEn: ["Web Scraping (BeautifulSoup, Selenium)", "ETL Workflows", "Task Scheduling & Cron Jobs"],
    skillsDe: ["Web Scraping (BeautifulSoup, Selenium)", "ETL Workflows", "Task Scheduling & Cron-Jobs"]
  },
  cat_tools: {
    color: "#FFE259",
    grad: "#amberGrad",
    freq: 90,
    nameEn: "Tools & DevOps",
    nameDe: "Tools & DevOps",
    skillsEn: ["Git", "GitHub", "hasura.io", "Docker", "Azure DevOps"],
    skillsDe: ["Git", "GitHub", "hasura.io", "Docker", "Azure DevOps"]
  }
};

/**
 * Utility helper that scrapes the sub-skills and their actual evaluated progress percentages
 * directly from the DOM category card grids, ensuring live data reflection.
 * 
 * @param {string} catKey - The database category key (e.g. 'cat_data_science').
 * @returns {Array<{name: string, percentage: string}>} Array of scraped sub-skill details.
 */
function getSubSkillsFromDOM(catKey) {
  const bottomTitle = document.querySelector(`.skill-cat-card h3[data-i18n="${catKey}"]`);
  if (!bottomTitle) return [];
  const card = bottomTitle.closest(".skill-cat-card");
  if (!card) return [];
  
  const skillItems = card.querySelectorAll(".skill-list .skill-item");
  const result = [];
  skillItems.forEach(item => {
    const nameElem = item.querySelector(".skill-name");
    const percentElem = item.querySelector(".skill-percentage");
    if (nameElem && percentElem) {
      result.push({
        name: nameElem.textContent.replace(/\s+/g, " ").trim(),
        percentage: percentElem.textContent.trim()
      });
    }
  });
  return result;
}

/**
 * Renders the Interactive SVG Radar/Spider Chart. Computes coordinates for octagon rings,
 * draws radiating spoke lines, maps evaluated category values, renders the main glowing area
 * polygon, and setups detailed interactive hover dots with dynamic multi-line HTML tooltips.
 */
function drawRadarChart() {
  const container = document.querySelector(".radar-chart-wrapper");
  if (!container || container.style.display === "none") return;

  const svg = container.querySelector(".radar-svg");
  if (!svg) return;

  const gridGroup = svg.querySelector(".radar-grid");
  const polyGroup = svg.querySelector(".radar-polygon");
  const dotsGroup = svg.querySelector(".radar-dots");
  const labelsGroup = svg.querySelector(".radar-labels");

  // Center and scale settings
  const cx = 300;
  const cy = 190; // Center adjusted for standard 380px desktop height
  const maxR = 145; // Radius scaled for standard 380px desktop height
  const levels = 5;

  // Clear dynamic elements
  gridGroup.innerHTML = "";
  dotsGroup.innerHTML = "";
  labelsGroup.innerHTML = "";

  // 1. Draw Concentric Octagons (Grid Levels)
  for (let l = 1; l <= levels; l++) {
    const r = (l / levels) * maxR;
    const points = [];
    for (let i = 0; i < 8; i++) {
      const angle = i * 45 * Math.PI / 180;
      const x = cx + r * Math.sin(angle);
      const y = cy - r * Math.cos(angle);
      points.push(`${x},${y}`);
    }
    
    const gridPoly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    gridPoly.setAttribute("points", points.join(" "));
    gridPoly.setAttribute("fill", "none");
    gridPoly.setAttribute("stroke", "rgba(255, 255, 255, 0.05)");
    gridPoly.setAttribute("stroke-width", "1");
    gridGroup.appendChild(gridPoly);

    // Grid level annotations
    const gridText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    gridText.setAttribute("x", cx + 5);
    gridText.setAttribute("y", cy - r + 3);
    gridText.setAttribute("fill", "rgba(255, 255, 255, 0.2)");
    gridText.setAttribute("font-size", "9px");
    gridText.setAttribute("font-family", "var(--font-body)");
    gridText.textContent = `${(l / levels) * 100}%`;
    gridGroup.appendChild(gridText);
  }

  // 2. Map and Plot Data Points
  const categories = Object.keys(chartDataConfig);
  const dataPoints = [];

  categories.forEach((catKey, i) => {
    const item = document.querySelector(`.radial-progress[data-category="${catKey}"]`);
    const progress = item ? parseInt(item.getAttribute("data-progress") || "0", 10) : 70;
    
    const angle = i * 45 * Math.PI / 180;
    const r = (progress / 100) * maxR;
    const x = cx + r * Math.sin(angle);
    const y = cy - r * Math.cos(angle);
    
    dataPoints.push({ x, y, progress, catKey });

    // Axis lines (spokes)
    const axisLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    axisLine.setAttribute("x1", cx);
    axisLine.setAttribute("y1", cy);
    axisLine.setAttribute("x2", cx + maxR * Math.sin(angle));
    axisLine.setAttribute("y2", cy - maxR * Math.cos(angle));
    axisLine.setAttribute("stroke", "rgba(255, 255, 255, 0.05)");
    axisLine.setAttribute("stroke-width", "1");
    gridGroup.appendChild(axisLine);

    // Spoke Labels
    const labelDistance = maxR + 24;
    let lx = cx + labelDistance * Math.sin(angle);
    let ly = cy - labelDistance * Math.cos(angle);
    
    let textAnchor = "middle";
    if (Math.abs(lx - cx) > 10) {
      textAnchor = lx > cx ? "start" : "end";
    }
    if (Math.abs(ly - cy) < 10) {
      ly += 4;
    } else if (ly > cy) {
      ly += 5;
    } else {
      ly -= 2;
    }

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", lx);
    text.setAttribute("y", ly);
    text.setAttribute("fill", "var(--text-secondary)");
    text.setAttribute("font-size", "10px");
    text.setAttribute("font-weight", "600");
    text.setAttribute("font-family", "var(--font-heading)");
    text.setAttribute("text-anchor", textAnchor);
    
    const config = chartDataConfig[catKey];
    text.textContent = currentLang === "de" ? config.nameDe : config.nameEn;
    labelsGroup.appendChild(text);
  });

  // 3. Render Solid Glowing Data Area Polygon
  const polyPoints = dataPoints.map(p => `${p.x},${p.y}`).join(" ");
  polyGroup.setAttribute("points", polyPoints);
  polyGroup.setAttribute("fill", "rgba(0, 242, 254, 0.12)");
  polyGroup.setAttribute("stroke", "url(#coreGrad)");
  polyGroup.setAttribute("stroke-width", "3");
  polyGroup.setAttribute("filter", "drop-shadow(0 0 8px rgba(0, 242, 254, 0.4))");

  // 4. Render Interactive Glowing Dots with Tooltips
  dataPoints.forEach((p) => {
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", p.x);
    dot.setAttribute("cy", p.y);
    dot.setAttribute("r", "5.5");
    dot.setAttribute("fill", chartDataConfig[p.catKey].color);
    dot.setAttribute("stroke", "#ffffff");
    dot.setAttribute("stroke-width", "1.5");
    dot.style.cursor = "pointer";
    dot.style.transition = "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), r 0.2s ease";

    const tooltip = document.querySelector(".chart-tooltip");
    
    dot.addEventListener("mouseenter", (e) => {
      dot.setAttribute("r", "7.5");
      dot.setAttribute("filter", "drop-shadow(0 0 8px #ffffff)");
      if (tooltip) {
        const config = chartDataConfig[p.catKey];
        const title = currentLang === "de" ? config.nameDe : config.nameEn;
        const domSkills = getSubSkillsFromDOM(p.catKey);
        const skillsHtml = domSkills.map(s => `<li style="margin-top: 0.15rem; list-style: disc inside; font-size: 0.75rem;">${s.name}: <strong>${s.percentage}</strong></li>`).join("");

        tooltip.innerHTML = `
          <div style="font-weight:700; color:${config.color}; margin-bottom: 0.2rem;">${title}</div>
          <div style="font-size:0.8rem; margin-bottom:0.4rem;">Expertise-Level: <strong>${p.progress}%</strong></div>
          <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.3rem; max-width: 250px;">
            <ul style="margin: 0; padding: 0;">${skillsHtml}</ul>
          </div>
        `;
        tooltip.style.opacity = "1";
        
        const tooltipRect = tooltip.getBoundingClientRect();
        tooltip.style.left = `${e.clientX - tooltipRect.width / 2}px`;
        tooltip.style.top = `${e.clientY - tooltipRect.height - 15}px`;
      }
    });

    dot.addEventListener("mousemove", (e) => {
      if (tooltip) {
        const tooltipRect = tooltip.getBoundingClientRect();
        tooltip.style.left = `${e.clientX - tooltipRect.width / 2}px`;
        tooltip.style.top = `${e.clientY - tooltipRect.height - 15}px`;
      }
    });

    dot.addEventListener("mouseleave", () => {
      dot.setAttribute("r", "5.5");
      dot.removeAttribute("filter");
      if (tooltip) tooltip.style.opacity = "0";
    });

    dotsGroup.appendChild(dot);
  });
}

/**
 * Renders the Interactive 2D Skill Scatter/Bubble Matrix in SVG. Partitions the space
 * into 4 quadrants (Core Focus, Niche Specialist, Emerging Skills, Supporting Tools),
 * adds responsive double axis indicators (Expertise vs frequency of use), scales bubble radii
 * to represent strength dynamically, and registers custom overlay mouse events with scale transformations.
 */
function drawScatterMatrix() {
  const container = document.querySelector(".scatter-matrix-wrapper");
  if (!container || container.style.display === "none") return;

  const svg = container.querySelector(".scatter-svg");
  if (!svg) return;

  const gridGroup = svg.querySelector(".scatter-grid");
  const bubblesGroup = svg.querySelector(".scatter-bubbles");

  const width = 600;
  const height = 380; // Scaled for standard height
  const paddingLeft = 70;
  const paddingRight = 40;
  const paddingTop = 40;
  const paddingBottom = 70;

  const cx = paddingLeft + (width - paddingLeft - paddingRight) / 2;
  const cy = paddingTop + (height - paddingTop - paddingBottom) / 2;

  gridGroup.innerHTML = "";
  bubblesGroup.innerHTML = "";

  // 1. Draw 4-Quadrant Partition Gridlines
  const gridX = document.createElementNS("http://www.w3.org/2000/svg", "line");
  gridX.setAttribute("x1", paddingLeft);
  gridX.setAttribute("y1", cy);
  gridX.setAttribute("x2", width - paddingRight);
  gridX.setAttribute("y2", cy);
  gridX.setAttribute("stroke", "rgba(255, 255, 255, 0.15)");
  gridX.setAttribute("stroke-width", "1.5");
  gridX.setAttribute("stroke-dasharray", "4 4");
  gridGroup.appendChild(gridX);

  const gridY = document.createElementNS("http://www.w3.org/2000/svg", "line");
  gridY.setAttribute("x1", cx);
  gridY.setAttribute("y1", paddingTop);
  gridY.setAttribute("x2", cx);
  gridY.setAttribute("y2", height - paddingBottom);
  gridY.setAttribute("stroke", "rgba(255, 255, 255, 0.15)");
  gridY.setAttribute("stroke-width", "1.5");
  gridY.setAttribute("stroke-dasharray", "4 4");
  gridGroup.appendChild(gridY);

  const border = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  border.setAttribute("x", paddingLeft);
  border.setAttribute("y", paddingTop);
  border.setAttribute("width", width - paddingLeft - paddingRight);
  border.setAttribute("height", height - paddingTop - paddingBottom);
  border.setAttribute("fill", "none");
  border.setAttribute("stroke", "rgba(255, 255, 255, 0.05)");
  border.setAttribute("stroke-width", "1");
  gridGroup.appendChild(border);

  // 2. Draw Quadrant Labels
  const quadrantLabels = [
    { x: cx + 15, y: paddingTop + 20, en: "Core Focus (Leader)", de: "Kernkompetenz (Fokus)", anchor: "start" },
    { x: paddingLeft + 15, y: paddingTop + 20, en: "Niche Specialist", de: "Nischen-Spezialist", anchor: "start" },
    { x: cx + 15, y: height - paddingBottom - 15, en: "Emerging Skills", de: "Zukunftspotenzial", anchor: "start" },
    { x: paddingLeft + 15, y: height - paddingBottom - 15, en: "Supporting Tools", de: "Unterstützende Tools", anchor: "start" }
  ];

  quadrantLabels.forEach(q => {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", q.x);
    text.setAttribute("y", q.y);
    text.setAttribute("fill", "rgba(255, 255, 255, 0.22)");
    text.setAttribute("font-size", "9px");
    text.setAttribute("font-weight", "800");
    text.setAttribute("font-family", "var(--font-heading)");
    text.setAttribute("text-anchor", q.anchor);
    text.setAttribute("letter-spacing", "0.5px");
    text.textContent = currentLang === "de" ? q.de : q.en;
    gridGroup.appendChild(text);
  });

  // 3. Draw Axis Labels
  const yLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  yLabel.setAttribute("transform", `rotate(-90, 22, ${cy})`);
  yLabel.setAttribute("x", 22);
  yLabel.setAttribute("y", cy);
  yLabel.setAttribute("fill", "var(--text-secondary)");
  yLabel.setAttribute("font-size", "10px");
  yLabel.setAttribute("font-weight", "600");
  yLabel.setAttribute("font-family", "var(--font-body)");
  yLabel.setAttribute("text-anchor", "middle");
  yLabel.textContent = currentLang === "de" ? "Expertise-Level →" : "Expertise Level →";
  gridGroup.appendChild(yLabel);

  const xLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  xLabel.setAttribute("x", cx);
  xLabel.setAttribute("y", height - 20);
  xLabel.setAttribute("fill", "var(--text-secondary)");
  xLabel.setAttribute("font-size", "10px");
  xLabel.setAttribute("font-weight", "600");
  xLabel.setAttribute("font-family", "var(--font-body)");
  xLabel.setAttribute("text-anchor", "middle");
  xLabel.textContent = currentLang === "de" ? "Praxis-Häufigkeit in Projekten →" : "Frequency of Use in Projects →";
  gridGroup.appendChild(xLabel);

  // Scales
  const yScales = [
    { y: height - paddingBottom, label: "0%" },
    { y: cy, label: "50%" },
    { y: paddingTop, label: "100%" }
  ];
  yScales.forEach(s => {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", paddingLeft - 10);
    text.setAttribute("y", s.y + 4);
    text.setAttribute("fill", "rgba(255, 255, 255, 0.3)");
    text.setAttribute("font-size", "9px");
    text.setAttribute("font-family", "var(--font-body)");
    text.setAttribute("text-anchor", "end");
    text.textContent = s.label;
    gridGroup.appendChild(text);
  });

  const xScales = [
    { x: paddingLeft, label: currentLang === "de" ? "Selten" : "Occasional" },
    { x: cx, label: currentLang === "de" ? "Regelmäßig" : "Regular" },
    { x: width - paddingRight, label: currentLang === "de" ? "Täglich" : "Daily" }
  ];
  xScales.forEach(s => {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", s.x);
    text.setAttribute("y", height - paddingBottom + 18);
    text.setAttribute("fill", "rgba(255, 255, 255, 0.3)");
    text.setAttribute("font-size", "9px");
    text.setAttribute("font-family", "var(--font-body)");
    text.setAttribute("text-anchor", "middle");
    text.textContent = s.label;
    gridGroup.appendChild(text);
  });

  // 4. Render Dynamic Interactive Bubbles
  const categories = Object.keys(chartDataConfig);
  categories.forEach((catKey) => {
    const item = document.querySelector(`.radial-progress[data-category="${catKey}"]`);
    const progress = item ? parseInt(item.getAttribute("data-progress") || "0", 10) : 70;
    const config = chartDataConfig[catKey];

    const rangeY = height - paddingTop - paddingBottom;
    const y = height - paddingBottom - (progress / 100) * rangeY;

    const rangeX = width - paddingLeft - paddingRight;
    const x = paddingLeft + (config.freq / 100) * rangeX;

    const r = 18 + (progress / 100) * 8; 

    const bubbleG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    bubbleG.style.cursor = "pointer";

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", r);
    circle.setAttribute("fill", `url(${config.grad})`);
    circle.setAttribute("opacity", "0.75");
    circle.setAttribute("stroke", "#ffffff");
    circle.setAttribute("stroke-width", "1.5");
    circle.setAttribute("filter", `drop-shadow(0 0 8px ${config.color})`);
    circle.style.transition = "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease";
    bubbleG.appendChild(circle);

    // Skill category abbreviation inside bubble
    const abbr = currentLang === "de" ? config.nameDe.substring(0, 3) : config.nameEn.substring(0, 3);
    const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    labelText.setAttribute("x", x);
    labelText.setAttribute("y", y + 3.5);
    labelText.setAttribute("fill", "#ffffff");
    labelText.setAttribute("font-size", "9px");
    labelText.setAttribute("font-weight", "800");
    labelText.setAttribute("font-family", "var(--font-heading)");
    labelText.setAttribute("text-anchor", "middle");
    labelText.setAttribute("pointer-events", "none");
    labelText.textContent = abbr.toUpperCase();
    bubbleG.appendChild(labelText);

    const tooltip = document.querySelector(".chart-tooltip");
    
    bubbleG.addEventListener("mouseenter", (e) => {
      circle.setAttribute("opacity", "0.95");
      circle.style.transform = `scale(1.15) translate(${-x * 0.15 / r}px, ${-y * 0.15 / r}px)`;
      if (tooltip) {
        const title = currentLang === "de" ? config.nameDe : config.nameEn;
        const levelLabel = currentLang === "de" ? "Expertise-Level" : "Expertise Level";
        const freqLabel = currentLang === "de" ? "Projekthäufigkeit" : "Project Frequency";
        tooltip.innerHTML = `
          <div style="font-weight:700; color:${config.color}">${title}</div>
          <div style="font-size:0.8rem; margin-top:0.3rem;">${levelLabel}: <strong>${progress}%</strong></div>
          <div style="font-size:0.8rem;">${freqLabel}: <strong>${config.freq}%</strong></div>
        `;
        tooltip.style.opacity = "1";

        const tooltipRect = tooltip.getBoundingClientRect();
        tooltip.style.left = `${e.clientX - tooltipRect.width / 2}px`;
        tooltip.style.top = `${e.clientY - tooltipRect.height - 15}px`;
      }
    });

    bubbleG.addEventListener("mousemove", (e) => {
      if (tooltip) {
        const tooltipRect = tooltip.getBoundingClientRect();
        tooltip.style.left = `${e.clientX - tooltipRect.width / 2}px`;
        tooltip.style.top = `${e.clientY - tooltipRect.height - 15}px`;
      }
    });

    bubbleG.addEventListener("mouseleave", () => {
      circle.setAttribute("opacity", "0.75");
      circle.style.transform = "none";
      if (tooltip) tooltip.style.opacity = "0";
    });

    bubblesGroup.appendChild(bubbleG);
  });
}

/**
 * Renders the Interactive Horizontal Bar Chart in SVG. Draws vertical dashed grids
 * at proportional intervals, draws category labels, builds rounded background tracks,
 * renders color-gradient linear progress bars with smooth scale-up hovers, and injects
 * detailed tooltips containing lists of specific sub-skills.
 */
function drawBarChart() {
  const container = document.querySelector(".bar-chart-wrapper");
  if (!container || container.style.display === "none") return;

  const svg = container.querySelector(".bar-svg");
  if (!svg) return;

  const gridGroup = svg.querySelector(".bar-grid");
  const barsGroup = svg.querySelector(".bar-bars");

  const width = 600;
  const height = 380; // Standard layout size
  const paddingLeft = 140; // Spacing for category text
  const paddingRight = 50;
  const paddingTop = 30;
  const paddingBottom = 40;

  gridGroup.innerHTML = "";
  barsGroup.innerHTML = "";

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const categories = Object.keys(chartDataConfig);
  const rowHeight = chartHeight / categories.length;

  // 1. Draw Vertical Dashed Gridlines (0%, 25%, 50%, 75%, 100%)
  const steps = [0, 25, 50, 75, 100];
  steps.forEach(step => {
    const x = paddingLeft + (step / 100) * chartWidth;
    
    // Gridline
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x);
    line.setAttribute("y1", paddingTop);
    line.setAttribute("x2", x);
    line.setAttribute("y2", height - paddingBottom);
    line.setAttribute("stroke", "rgba(255, 255, 255, 0.05)");
    line.setAttribute("stroke-width", "1");
    if (step > 0 && step < 100) {
      line.setAttribute("stroke-dasharray", "4 4");
    }
    gridGroup.appendChild(line);

    // Label at bottom
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", height - paddingBottom + 18);
    text.setAttribute("fill", "rgba(255, 255, 255, 0.3)");
    text.setAttribute("font-size", "9px");
    text.setAttribute("font-family", "var(--font-body)");
    text.setAttribute("text-anchor", "middle");
    text.textContent = `${step}%`;
    gridGroup.appendChild(text);
  });

  // 2. Draw Y-Axis baseline
  const baseline = document.createElementNS("http://www.w3.org/2000/svg", "line");
  baseline.setAttribute("x1", paddingLeft);
  baseline.setAttribute("y1", paddingTop);
  baseline.setAttribute("x2", paddingLeft);
  baseline.setAttribute("y2", height - paddingBottom);
  baseline.setAttribute("stroke", "rgba(255, 255, 255, 0.15)");
  baseline.setAttribute("stroke-width", "1.5");
  gridGroup.appendChild(baseline);

  // 3. Render each bar row
  categories.forEach((catKey, i) => {
    const item = document.querySelector(`.radial-progress[data-category="${catKey}"]`);
    const progress = item ? parseInt(item.getAttribute("data-progress") || "0", 10) : 70;
    const config = chartDataConfig[catKey];
    
    const yCenter = paddingTop + i * rowHeight + rowHeight / 2;
    const barHeight = rowHeight * 0.45;
    
    const barG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    barG.style.cursor = "pointer";

    // A. Row Label (Category name)
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", paddingLeft - 15);
    label.setAttribute("y", yCenter + 4);
    label.setAttribute("fill", "var(--text-secondary)");
    label.setAttribute("font-size", "10px");
    label.setAttribute("font-weight", "600");
    label.setAttribute("font-family", "var(--font-heading)");
    label.setAttribute("text-anchor", "end");
    label.textContent = currentLang === "de" ? config.nameDe : config.nameEn;
    barG.appendChild(label);

    // B. Background track bar
    const track = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    track.setAttribute("x", paddingLeft);
    track.setAttribute("y", yCenter - barHeight / 2);
    track.setAttribute("width", chartWidth);
    track.setAttribute("height", barHeight);
    track.setAttribute("rx", barHeight / 2);
    track.setAttribute("ry", barHeight / 2);
    track.setAttribute("fill", "rgba(255, 255, 255, 0.02)");
    track.setAttribute("stroke", "rgba(255, 255, 255, 0.03)");
    track.setAttribute("stroke-width", "1");
    barG.appendChild(track);

    // C. Glowing Colored Fill Bar
    const fillWidth = (progress / 100) * chartWidth;
    const fill = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    fill.setAttribute("class", "bar-fill-rect");
    fill.setAttribute("x", paddingLeft);
    fill.setAttribute("y", yCenter - barHeight / 2);
    fill.setAttribute("width", "0"); // Animated
    fill.setAttribute("data-width", fillWidth);
    fill.setAttribute("height", barHeight);
    fill.setAttribute("rx", barHeight / 2);
    fill.setAttribute("ry", barHeight / 2);
    fill.setAttribute("fill", `url(${config.grad})`);
    fill.setAttribute("filter", `drop-shadow(0 0 6px ${config.color}50)`);
    fill.style.transition = "transform 0.2s ease, filter 0.2s ease";
    barG.appendChild(fill);

    // D. Percentage Value Label at right of bar
    const valText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    valText.setAttribute("class", "bar-label-val");
    valText.setAttribute("x", paddingLeft + fillWidth + 10);
    valText.setAttribute("y", yCenter + 3.5);
    valText.setAttribute("fill", "var(--text-primary)");
    valText.setAttribute("font-size", "9px");
    valText.setAttribute("font-weight", "800");
    valText.setAttribute("font-family", "var(--font-heading)");
    valText.style.opacity = "0"; // Animated
    valText.textContent = `${progress}%`;
    barG.appendChild(valText);

    // E. Interactive invisible wider overlay bar for robust hovering
    const hoverOverlay = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    hoverOverlay.setAttribute("x", paddingLeft);
    hoverOverlay.setAttribute("y", yCenter - rowHeight / 2);
    hoverOverlay.setAttribute("width", chartWidth);
    hoverOverlay.setAttribute("height", rowHeight);
    hoverOverlay.setAttribute("fill", "transparent");
    barG.appendChild(hoverOverlay);

    // F. Mouse hover effects and Tooltip with detailed Sub-Skills
    const tooltip = document.querySelector(".chart-tooltip");
    barG.addEventListener("mouseenter", (e) => {
      fill.style.transform = "scaleY(1.15)";
      fill.style.transformOrigin = `${paddingLeft}px ${yCenter}px`;
      fill.setAttribute("filter", `drop-shadow(0 0 10px ${config.color})`);
      
      if (tooltip) {
        const title = currentLang === "de" ? config.nameDe : config.nameEn;
        const domSkills = getSubSkillsFromDOM(catKey);
        const skillsHtml = domSkills.map(s => `<li style="margin-top: 0.15rem; list-style: disc inside; font-size: 0.75rem;">${s.name}: <strong>${s.percentage}</strong></li>`).join("");

        tooltip.innerHTML = `
          <div style="font-weight:700; color:${config.color}; margin-bottom: 0.2rem;">${title}</div>
          <div style="font-size:0.8rem; margin-bottom:0.4rem;">Expertise-Level: <strong>${progress}%</strong></div>
          <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.3rem; max-width: 250px;">
            <ul style="margin: 0; padding: 0;">${skillsHtml}</ul>
          </div>
        `;
        tooltip.style.opacity = "1";

        const tooltipRect = tooltip.getBoundingClientRect();
        tooltip.style.left = `${e.clientX - tooltipRect.width / 2}px`;
        tooltip.style.top = `${e.clientY - tooltipRect.height - 15}px`;
      }
    });

    barG.addEventListener("mousemove", (e) => {
      if (tooltip) {
        const tooltipRect = tooltip.getBoundingClientRect();
        tooltip.style.left = `${e.clientX - tooltipRect.width / 2}px`;
        tooltip.style.top = `${e.clientY - tooltipRect.height - 15}px`;
      }
    });

    barG.addEventListener("mouseleave", () => {
      fill.style.transform = "none";
      fill.setAttribute("filter", `drop-shadow(0 0 6px ${config.color}50)`);
      if (tooltip) tooltip.style.opacity = "0";
    });

    barsGroup.appendChild(barG);
  });
}

/**
 * Renders the Interactive Line & Area Chart in SVG. Draws horizontal dashed gridlines
 * and rotated bottom axis labels, maps and plots localized data points, generates
 * continuous bezier-style/straight coordinate paths, fills in the underlying linear gradient area,
 * and sets up interactive vertex overlay points with dynamic tooltips.
 */
function drawLineChart() {
  const container = document.querySelector(".line-chart-wrapper");
  if (!container || container.style.display === "none") return;

  const svg = container.querySelector(".line-svg");
  if (!svg) return;

  const gridGroup = svg.querySelector(".line-grid");
  const dotsGroup = svg.querySelector(".line-dots");
  const areaPath = svg.querySelector(".line-area-path");
  const strokePath = svg.querySelector(".line-stroke-path");

  const width = 600;
  const height = 380; // Standard layout size
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 40;
  const paddingBottom = 75; // Spacing at bottom for rotated labels

  gridGroup.innerHTML = "";
  dotsGroup.innerHTML = "";

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const categories = Object.keys(chartDataConfig);
  const colSpacing = chartWidth / categories.length;

  // 1. Draw Horizontal Dashed Gridlines (0%, 25%, 50%, 75%, 100%)
  const steps = [0, 25, 50, 75, 100];
  steps.forEach(step => {
    const y = height - paddingBottom - (step / 100) * chartHeight;
    
    // Gridline
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", paddingLeft);
    line.setAttribute("y1", y);
    line.setAttribute("x2", width - paddingRight);
    line.setAttribute("y2", y);
    line.setAttribute("stroke", "rgba(255, 255, 255, 0.05)");
    line.setAttribute("stroke-width", "1");
    if (step > 0 && step < 100) {
      line.setAttribute("stroke-dasharray", "4 4");
    }
    gridGroup.appendChild(line);

    // Label on Y-axis
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", paddingLeft - 10);
    text.setAttribute("y", y + 3.5);
    text.setAttribute("fill", "rgba(255, 255, 255, 0.3)");
    text.setAttribute("font-size", "9px");
    text.setAttribute("font-family", "var(--font-body)");
    text.setAttribute("text-anchor", "end");
    text.textContent = `${step}%`;
    gridGroup.appendChild(text);
  });

  // 2. Draw X-Axis baseline
  const baseline = document.createElementNS("http://www.w3.org/2000/svg", "line");
  baseline.setAttribute("x1", paddingLeft);
  baseline.setAttribute("y1", height - paddingBottom);
  baseline.setAttribute("x2", width - paddingRight);
  baseline.setAttribute("y2", height - paddingBottom);
  baseline.setAttribute("stroke", "rgba(255, 255, 255, 0.15)");
  baseline.setAttribute("stroke-width", "1.5");
  gridGroup.appendChild(baseline);

  // 3. Map Data Points coordinates
  const dataPoints = [];
  categories.forEach((catKey, i) => {
    const item = document.querySelector(`.radial-progress[data-category="${catKey}"]`);
    const progress = item ? parseInt(item.getAttribute("data-progress") || "0", 10) : 70;
    const config = chartDataConfig[catKey];
    
    const x = paddingLeft + i * colSpacing + colSpacing / 2;
    const y = height - paddingBottom - (progress / 100) * chartHeight;
    dataPoints.push({ x, y, progress, config, catKey });

    // Rotated Label at bottom
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", x - 8);
    label.setAttribute("y", height - paddingBottom + 15);
    label.setAttribute("fill", "var(--text-secondary)");
    label.setAttribute("font-size", "9px");
    label.setAttribute("font-weight", "600");
    label.setAttribute("font-family", "var(--font-heading)");
    label.setAttribute("text-anchor", "start");
    label.setAttribute("transform", `rotate(25, ${x - 8}, ${height - paddingBottom + 15})`);
    
    const labelName = currentLang === "de" ? config.nameDe : config.nameEn;
    label.textContent = labelName;
    gridGroup.appendChild(label);
  });

  // 4. Construct SVG Path string (Straight connections)
  let pathD = "";
  dataPoints.forEach((p, i) => {
    if (i === 0) pathD += `M ${p.x} ${p.y}`;
    else pathD += ` L ${p.x} ${p.y}`;
  });

  // Main continuous glowing stroke line
  strokePath.setAttribute("d", pathD);
  strokePath.setAttribute("stroke", "url(#coreGrad)");
  strokePath.setAttribute("stroke-width", "3.5");
  strokePath.setAttribute("fill", "none");
  strokePath.setAttribute("filter", "drop-shadow(0 0 6px rgba(0, 242, 254, 0.4))");

  // Gradient Area fill under path
  let areaD = pathD + ` L ${dataPoints[dataPoints.length - 1].x} ${height - paddingBottom} L ${dataPoints[0].x} ${height - paddingBottom} Z`;
  areaPath.setAttribute("d", areaD);
  areaPath.setAttribute("fill", "url(#cyanGrad)");
  areaPath.setAttribute("opacity", "0.08");

  // 5. Render Glowing Vertex Interactive Dots
  dataPoints.forEach((p, i) => {
    const dotG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    dotG.style.cursor = "pointer";

    // Glowing dot circle
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("class", "line-dot-circle");
    circle.setAttribute("cx", p.x);
    circle.setAttribute("cy", p.y);
    circle.setAttribute("r", "0"); // Animated
    circle.setAttribute("data-r", "5.5");
    circle.setAttribute("fill", p.config.color);
    circle.setAttribute("stroke", "#ffffff");
    circle.setAttribute("stroke-width", "1.5");
    circle.setAttribute("filter", `drop-shadow(0 0 6px ${p.config.color})`);
    circle.style.transition = "transform 0.2s ease, filter 0.2s ease, r 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    dotG.appendChild(circle);

    // Percentage Label on top of dot
    const valText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    valText.setAttribute("class", "line-label-val");
    valText.setAttribute("x", p.x);
    valText.setAttribute("y", p.y - 10);
    valText.setAttribute("fill", "var(--text-primary)");
    valText.setAttribute("font-size", "9px");
    valText.setAttribute("font-weight", "800");
    valText.setAttribute("font-family", "var(--font-heading)");
    valText.setAttribute("text-anchor", "middle");
    valText.style.opacity = "0"; // Animated
    valText.textContent = `${p.progress}%`;
    dotG.appendChild(valText);

    // Interactive invisible wider overlay rectangle for robust hovering
    const hoverOverlay = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    hoverOverlay.setAttribute("x", p.x - colSpacing / 2);
    hoverOverlay.setAttribute("y", paddingTop);
    hoverOverlay.setAttribute("width", colSpacing);
    hoverOverlay.setAttribute("height", chartHeight);
    hoverOverlay.setAttribute("fill", "transparent");
    dotG.appendChild(hoverOverlay);

    // Hover tooltip controls
    const tooltip = document.querySelector(".chart-tooltip");
    dotG.addEventListener("mouseenter", (e) => {
      circle.setAttribute("r", "7.5");
      circle.setAttribute("filter", `drop-shadow(0 0 10px ${p.config.color})`);
      
      if (tooltip) {
        const title = currentLang === "de" ? p.config.nameDe : p.config.nameEn;
        const domSkills = getSubSkillsFromDOM(p.catKey);
        const skillsHtml = domSkills.map(s => `<li style="margin-top: 0.15rem; list-style: disc inside; font-size: 0.75rem;">${s.name}: <strong>${s.percentage}</strong></li>`).join("");

        tooltip.innerHTML = `
          <div style="font-weight:700; color:${p.config.color}; margin-bottom: 0.2rem;">${title}</div>
          <div style="font-size:0.8rem; margin-bottom:0.4rem;">Expertise-Level: <strong>${p.progress}%</strong></div>
          <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.3rem; max-width: 250px;">
            <ul style="margin: 0; padding: 0;">${skillsHtml}</ul>
          </div>
        `;
        tooltip.style.opacity = "1";

        const tooltipRect = tooltip.getBoundingClientRect();
        tooltip.style.left = `${e.clientX - tooltipRect.width / 2}px`;
        tooltip.style.top = `${e.clientY - tooltipRect.height - 15}px`;
      }
    });

    dotG.addEventListener("mousemove", (e) => {
      if (tooltip) {
        const tooltipRect = tooltip.getBoundingClientRect();
        tooltip.style.left = `${e.clientX - tooltipRect.width / 2}px`;
        tooltip.style.top = `${e.clientY - tooltipRect.height - 15}px`;
      }
    });

    dotG.addEventListener("mouseleave", () => {
      circle.setAttribute("r", "5.5");
      circle.setAttribute("filter", `drop-shadow(0 0 6px ${p.config.color})`);
      if (tooltip) tooltip.style.opacity = "0";
    });

    dotsGroup.appendChild(dotG);
  });
}

// Animate featured dashboard charts based on active layout (radial, radar, matrix, bar, line)
function animateFeaturedCharts() {
  const featured = document.querySelector(".skills-featured");
  if (!featured) return;

  const isRadial = featured.classList.contains("view-radial") || (!featured.classList.contains("view-radar") && !featured.classList.contains("view-matrix") && !featured.classList.contains("view-bar") && !featured.classList.contains("view-line"));
  const isRadar = featured.classList.contains("view-radar");
  const isMatrix = featured.classList.contains("view-matrix");
  const isBar = featured.classList.contains("view-bar");
  const isLine = featured.classList.contains("view-line");

  if (isRadial) {
    const items = featured.querySelectorAll(".gauges-grid-wrapper .radial-progress");
    items.forEach((item, index) => {
      const progress = parseInt(item.getAttribute("data-progress") || "0", 10);
      const circle = item.querySelector(".progress-circle-fill");
      if (!circle) return;
      const radius = (circle.r && circle.r.baseVal && circle.r.baseVal.value > 0) ? circle.r.baseVal.value : 45;
      const circumference = 2 * Math.PI * radius;
      const targetOffset = circumference - (progress / 100) * circumference;

      // Reset to empty
      circle.style.transition = "none";
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      circle.style.strokeDashoffset = String(circumference);

      // Trigger transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            circle.style.transition = "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)";
            circle.style.strokeDashoffset = String(targetOffset);
          }, index * 80);
        });
      });
    });
  } else if (isRadar) {
    drawRadarChart();
    const poly = featured.querySelector(".radar-polygon");
    if (poly) {
      poly.style.opacity = "0";
      poly.style.transform = "scale(0.8)";
      poly.style.transformOrigin = "300px 190px"; // Origin aligned with center Y: 190
      poly.style.transition = "none";
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          poly.style.transition = "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.2s ease";
          poly.style.opacity = "1";
          poly.style.transform = "scale(1)";
        });
      });
    }
  } else if (isMatrix) {
    drawScatterMatrix();
    const bubbles = featured.querySelectorAll(".scatter-bubbles g");
    bubbles.forEach((b, index) => {
      const circle = b.querySelector("circle");
      const text = b.querySelector("text");
      if (!circle) return;

      circle.style.transform = "scale(0)";
      circle.style.transformOrigin = `${circle.getAttribute("cx")}px ${circle.getAttribute("cy")}px`;
      if (text) text.style.opacity = "0";

      setTimeout(() => {
        circle.style.transition = "transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        circle.style.transform = "scale(1)";
        if (text) {
          text.style.transition = "opacity 0.5s ease";
          text.style.opacity = "1";
        }
      }, index * 60);
    });
  } else if (isBar) {
    drawBarChart();
    const bars = featured.querySelectorAll(".bar-bars g");
    bars.forEach((b, index) => {
      const rect = b.querySelector(".bar-fill-rect");
      const text = b.querySelector(".bar-label-val");
      if (!rect) return;

      const targetWidth = parseFloat(rect.getAttribute("data-width"));
      rect.style.transition = "none";
      rect.setAttribute("width", "0");
      if (text) text.style.opacity = "0";

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            rect.style.transition = "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
            rect.setAttribute("width", targetWidth);
            if (text) {
              text.style.transition = "opacity 0.6s ease";
              text.style.opacity = "1";
            }
          }, index * 60);
        });
      });
    });
  } else if (isLine) {
    drawLineChart();
    const strokePath = featured.querySelector(".line-stroke-path");
    const areaPath = featured.querySelector(".line-area-path");
    const dots = featured.querySelectorAll(".line-dots g");

    if (strokePath && areaPath) {
      // 1. Get path length
      const length = strokePath.getTotalLength();
      
      // Reset
      strokePath.style.transition = "none";
      strokePath.style.strokeDasharray = `${length} ${length}`;
      strokePath.style.strokeDashoffset = String(length);
      areaPath.style.transition = "none";
      areaPath.style.opacity = "0";

      // Reset dots
      dots.forEach(d => {
        const circle = d.querySelector(".line-dot-circle");
        const text = d.querySelector(".line-label-val");
        if (circle) circle.setAttribute("r", "0");
        if (text) text.style.opacity = "0";
      });

      // Animate line path drawing from left to right
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          strokePath.style.transition = "stroke-dashoffset 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
          strokePath.style.strokeDashoffset = "0";
          
          areaPath.style.transition = "opacity 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
          areaPath.style.opacity = "0.08";

          // Stagger-reveal dots as line passes them
          dots.forEach((d, index) => {
            const circle = d.querySelector(".line-dot-circle");
            const text = d.querySelector(".line-label-val");
            const targetR = circle ? circle.getAttribute("data-r") : "5.5";
            
            setTimeout(() => {
              if (circle) {
                circle.setAttribute("r", targetR);
              }
              if (text) {
                text.style.transition = "opacity 0.5s ease";
                text.style.opacity = "1";
              }
            }, index * 120 + 200); // Stagger dots
          });
        });
      });
    }
  }
}

// Hook tab visualizer listeners inside DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize dashboard view toggles
  const toggleButtons = document.querySelectorAll(".toggle-btn");
  const skillsFeatured = document.querySelector(".skills-featured");

  if (toggleButtons.length > 0 && skillsFeatured) {
    // Add default view class
    skillsFeatured.classList.add("view-radial");

    // Initialize chart explanation button display to flex so it is visible for the default radial view
    const initInfoBtnContainer = document.getElementById("chart-info-btn-container");
    if (initInfoBtnContainer) {
      initInfoBtnContainer.style.display = "flex";
    }

    // Load saved view preference if present and preferences are allowed
    const consent = localStorage.getItem("portfolio_cookie_consent");
    let allowPreferences = true;
    if (consent) {
      try {
        const consentObj = JSON.parse(consent);
        allowPreferences = !!consentObj.preferences;
      } catch (e) {}
    }

    let initialView = "radial";
    if (allowPreferences) {
      const savedView = localStorage.getItem("portfolio_dashboard_view");
      if (savedView) {
        initialView = savedView;
      }
    }



    if (initialView !== "radial") {
      const targetBtn = document.querySelector(`.toggle-btn[data-view="${initialView}"]`);
      if (targetBtn) {
        toggleButtons.forEach(b => b.classList.remove("active"));
        targetBtn.classList.add("active");
        skillsFeatured.classList.remove("view-radial");
        skillsFeatured.classList.add(`view-${initialView}`);

        const gaugesWrapper = skillsFeatured.querySelector(".gauges-grid-wrapper");
        const wrapperClass = initialView === "matrix" ? ".scatter-matrix-wrapper" : `.${initialView}-chart-wrapper`;
        const wrapper = skillsFeatured.querySelector(wrapperClass);
        
        if (gaugesWrapper) gaugesWrapper.style.display = "none";
        if (wrapper) wrapper.style.display = "block";

        const infoBtnContainer = document.getElementById("chart-info-btn-container");
        if (infoBtnContainer) {
          infoBtnContainer.style.display = "flex";
        }
      }
    }


    // Dynamic toggle slider update (exposed globally to align capsule highlight on language switches)
    window.updateToggleSlider = () => {
      const slider = document.querySelector(".toggle-slider");
      const activeBtn = document.querySelector(".toggle-btn.active");
      if (slider && activeBtn) {
        slider.style.left = `${activeBtn.offsetLeft}px`;
        slider.style.width = `${activeBtn.offsetWidth}px`;
      }
    };

    // Initialize position
    setTimeout(() => {
      if (typeof window.updateToggleSlider === "function") {
        window.updateToggleSlider();
      }
    }, 150);

    // Re-align on window resize
    window.addEventListener("resize", () => {
      if (typeof window.updateToggleSlider === "function") {
        window.updateToggleSlider();
      }
    });

    toggleButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const view = btn.getAttribute("data-view");



        // Update active class on buttons
        toggleButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // Update slider position
        if (typeof window.updateToggleSlider === "function") {
          window.updateToggleSlider();
        }

        // Toggle wrappers display
        const gaugesWrapper = skillsFeatured.querySelector(".gauges-grid-wrapper");
        const radarWrapper = skillsFeatured.querySelector(".radar-chart-wrapper");
        const scatterWrapper = skillsFeatured.querySelector(".scatter-matrix-wrapper");
        const barWrapper = skillsFeatured.querySelector(".bar-chart-wrapper");
        const lineWrapper = skillsFeatured.querySelector(".line-chart-wrapper");

        if (gaugesWrapper) gaugesWrapper.style.display = view === "radial" ? "grid" : "none";
        if (radarWrapper) radarWrapper.style.display = view === "radar" ? "block" : "none";
        if (scatterWrapper) scatterWrapper.style.display = view === "matrix" ? "block" : "none";
        if (barWrapper) barWrapper.style.display = view === "bar" ? "block" : "none";
        if (lineWrapper) lineWrapper.style.display = view === "line" ? "block" : "none";

        const infoBtnContainer = document.getElementById("chart-info-btn-container");
        if (infoBtnContainer) {
          infoBtnContainer.style.display = "flex";
        }

        // Update view class on container
        skillsFeatured.classList.remove("view-radial", "view-radar", "view-matrix", "view-bar", "view-line");
        skillsFeatured.classList.add(`view-${view}`);

        // Save selected view to localStorage if Preference Cookies are enabled
        const consent = localStorage.getItem("portfolio_cookie_consent");
        let allowPreferences = true;
        if (consent) {
          try {
            const consentObj = JSON.parse(consent);
            allowPreferences = !!consentObj.preferences;
          } catch(e) {}
        }

        if (allowPreferences) {
          localStorage.setItem("portfolio_dashboard_view", view);
        } else {
          localStorage.removeItem("portfolio_dashboard_view");
        }

        // Trigger animation for the selected view
        animateFeaturedCharts();

      });
    });
  }

  // Dynamic smooth scroll-to-card for circular gauges
  document.querySelectorAll(".radial-progress[data-category]").forEach(gauge => {
    const isServer = window.location.hostname.includes("amirargani.github.io");
    if (isServer) {
      gauge.classList.add("not-clickable");
    }

    gauge.addEventListener("click", () => {
      if (isServer) return; // Exit early if on the production server
      
      const catKey = gauge.getAttribute("data-category");
      const bottomTitle = document.querySelector(`.skill-cat-card h3[data-i18n="${catKey}"]`);
      if (bottomTitle) {
        const card = bottomTitle.closest(".skill-cat-card");
        if (card) {
          card.scrollIntoView({ behavior: "smooth", block: "center" });

          // Trigger a beautiful brief glowing pulse to draw attention to the targeted card
          card.classList.add("pulsing-glow");
          setTimeout(() => {
            card.classList.remove("pulsing-glow");
          }, 1500);
        }
      }
    });
  });
});
