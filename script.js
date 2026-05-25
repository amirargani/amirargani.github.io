/**
 * Amir Argani - Portfolio Controller & Localisation
 */

const translations = {
  de: {
    // Navigation
    nav_about: "Über Mich",
    nav_problem_solution: "Mein Ansatz",
    nav_projects: "Projekte",
    nav_skills: "Kenntnisse",
    nav_certificates: "Zertifikate",
    nav_contact: "Kontakt",

    // Certificates Section
    section_cert_title: "Zertifikate & Abschlussbescheinigungen",
    section_cert_subtitle: "Offizielle Nachweise meiner Data-Science-Ausbildung an der DSI Berlin",
    cert_1_title: "Zertifikat – 6 Monate Data Science",
    cert_1_issuer: "DSI Berlin – Data Science Institute",
    cert_2_title: "Abschlussbescheinigung Data Science",
    cert_2_issuer: "DSI Berlin – Data Science Institute",
    cert_view_btn: "PDF öffnen",
    cert_modal_close: "Schließen",

    // Hero Section
    hero_badge: "Software Engineer & Data Enthusiast",
    hero_greeting: "Hallo, ich bin",
    hero_title: "Amir Argani",
    hero_subtitle: "Data meets Software Engineering",
    hero_desc: "Ich baue die Brücke zwischen Code, KI und Business Value. Seit 2014 entwickle ich digitale Lösungen und kombiniere Computer Engineering mit praxisnaher Weiterbildung in Data Science & KI (DSI Berlin).",
    hero_roles_title: "Ich suche neue Herausforderungen als:",
    hero_roles: "Data Scientist • Analytics Engineer • Data Engineer",
    hero_pref_title: "Bevorzugt:",
    hero_pref: "Hamburg • Lübeck • 100% Remote in Deutschland",
    hero_cv_btn: "Kontakt aufnehmen",
    hero_github_btn: "GitHub ansehen",

    // Problem & Solution
    section_ps_title: "Das Problem & Mein Ansatz",
    section_ps_subtitle: "Wie ich helfe, Daten produktiv nutzbar zu machen",
    problem_title: "Das Problem in Unternehmen",
    problem_desc_1: "Viele Unternehmen erfassen Daten – nutzen sie aber nicht effektiv.",
    problem_point_1: "Manuelle Prozesse verlangsamen wertvolle Abläufe.",
    problem_point_2: "Daten bleiben in isolierten Datensilos gefangen (z.B. zwischen Zeiterfassung und ERP-Systemen).",
    problem_point_3: "Fehlende Struktur führt zu schlechter Datenqualität und unzuverlässigen Entscheidungen.",
    solution_title: "Mein Lösungsansatz",
    solution_desc_1: "Ich entwickle Systeme, die diese Barrieren durchbrechen.",
    solution_point_1: "Integration von Daten direkt in bestehende Unternehmensprozesse.",
    solution_point_2: "Klare Datenstrukturen, saubere Zuordnung und automatisierte Validierung.",
    solution_point_3: "Vollständige Automatisierung statt manueller Datenübertragung.",
    solution_point_4: "Intelligente Kombination von ERP-Systemen mit Machine Learning.",

    // Projects (CRObuzzer)
    section_projects_title: "Erfolgsgeschichten & Projekte",
    section_projects_subtitle: "Praxisbeispiele für datengetriebene Integrationen",
    crobuzzer_badge: "ERP-Integration",
    crobuzzer_title: "CRObuzzer",
    crobuzzer_desc: "Ein Paradebeispiel für Datenintegration: Die nahtlose Verbindung von timeBuzzer mit Microsoft Dynamics 365 Business Central.",
    crobuzzer_challenge_title: "Herausforderung:",
    crobuzzer_challenge: "Zeiterfassungsdaten manuell zu übertragen ist fehleranfällig und blockiert wertvolle Ressourcen.",
    crobuzzer_solution_title: "Ergebnis:",
    crobuzzer_result_1: "Automatische Überführung von Zeiterfassungsdaten in Projekt- und Abrechnungslogik.",
    crobuzzer_result_2: "Deutlich weniger manuelle Arbeit, fehlerfreie Datenqualität und eine verlässliche Entscheidungsbasis im Projektcontrolling.",
    crobuzzer_tech_used: "Technologien: Business Central (AL), APIs, JavaScript, Postman",
    project_link_text: "Website ansehen",

    // Skills
    section_skills_title: "Kenntnisse & Tech-Skills",
    section_skills_subtitle: "Strukturierte Übersicht über mein Technologie-Stack",
    skill_level_label: "Kenntnisstand",

    // Skill Categories
    cat_data_science: "Datenanalyse & BI Tools",
    cat_programming: "Programmierung",
    cat_web_dev: "Web-Entwicklung",
    cat_app_dev: "App-Entwicklung",
    cat_cloud_devops: "Cloud & DevOps",
    cat_databases: "Datenbanken",
    cat_automation_etl: "Automatisierung & ETL",
    cat_office_365: "Office 365",
    cat_tools: "Tools & Plattformen",
    cat_languages: "Sprachen",

    // Skill Subcategories
    subcat_data_science: "Data Science",
    subcat_bi_tools: "BI-Tools",
    subcat_relational: "Relationale Datenbanken",
    subcat_nosql: "NoSQL-Datenbanken",

    // Skill Specific labels
    skill_ml: "Maschinelles Lernen (Scikit-Learn, Regression, etc.)",
    skill_eda: "EDA (Explorative Datenanalyse)",
    skill_al: "AL Programming Language (Business Central)",
    skill_nosql: "MongoDB",
    skill_sql_server: "SQL Server",
    skill_mysql: "MySQL",
    skill_postgresql: "PostgreSQL",
    skill_sqlite: "SQLite",
    skill_make: "Make",
    skill_n8n: "n8n",
    skill_airflow: "Apache Airflow",
    skill_excel: "Excel",
    skill_word: "Word",
    skill_powerpoint: "PowerPoint",
    skill_tableau: "Tableau",

    // Languages
    lang_persian: "Persisch (Muttersprache)",
    lang_german: "Deutsch (Fließend)",
    lang_english: "Englisch (Konversationssicher)",
    lang_persian_level: "100%",
    lang_german_level: "70%",
    lang_english_level: "47%",

    // GitHub Repositories Section
    section_repos_title: "GitHub Repositories",
    section_repos_subtitle: "Entdecken Sie meine Open-Source-Projekte und Code-Architekturen",
    repo_filter_all: "Alle",
    repo_filter_ds: "Data Science",
    repo_filter_web: "Web & Cloud",
    repo_filter_desktop: "Desktop & System-Utilities",
    repo_filter_mobile: "Mobile & Cross-Platform",
    repo_what_is: "Was ist das & Ziel",
    repo_desc: "Beschreibung",
    repo_techs: "Verwendete Technologien",
    repo_visit: "Projekt auf GitHub ansehen",

    repo_1_what_is: "Ein automatisiertes Datenpipeline- und Vorhersageprojekt, das offizielle monatliche Arbeitsmarktdaten für Deutschland herunterlädt und verarbeitet.",
    repo_1_desc: "Lädt offizielle monatliche Arbeitslosenzahlen der Bundesagentur für Arbeit (BA) herunter, bereitet sie in CSV-Datensätze auf und nutzt zwei unabhängige AutoML-Engines (H2O AutoML und Auto-sklearn), um die Zahlen des aktuellen Monats vorherzusagen. Die Pipeline ist vollständig in Docker und Docker Compose containerisiert.",

    repo_2_what_is: "Ein professionelles Full-Stack-Überwachungs-Dashboard zur Echtzeit-Überwachung und vollautomatischen Wiederherstellung kritischer Windows-Dienste.",
    repo_2_desc: "Ein professionelles Client-Server-Überwachungs-Dashboard zur Verfolgung kritischer Windows-Dienste. Bietet Echtzeit-Statusüberwachung, benutzerdefinierte automatische Wiederherstellungsrichtlinien, interaktive Diagramme mit Recharts und eine tiefe Integration von Google Gemini AI zur Analyse von Logdateien und zur Empfehlung von Diagnoselösungen.",

    repo_3_what_is: "Eine interaktive Datenanalyse- und Machine-Learning-Webanwendung, die die Herausforderungen der Jugend in Deutschland beleuchtet.",
    repo_3_desc: "Ein kollaboratives Data-Science-Projekt zur Untersuchung von Bildungs-, Beschäftigungs- und psychischen Herausforderungen junger Menschen in Deutschland. Entwickelt als interaktives Streamlit-Dashboard mit maßgeschneiderten Datenpipelines über Pandas, dynamischen Plotly-Visualisierungen, Scikit-learn-Regressionsmodellen für Arbeitslosenprognosen und vergleichenden Power BI-Dashboards.",

    repo_4_what_is: "Eine hochperformante Windows Forms Desktop-Anwendung zur kontinuierlichen Überwachung und automatisierten Wiederherstellung kritischer Windows-Dienste.",
    repo_4_desc: "Eine robuste Systemüberwachungsanwendung auf .NET 10-Basis zur Überwachung kritischer Programme. Startet ausgefallene Dienste sofort neu, verschlüsselt sensible Konfigurationen (SMTP/Zugangsdaten) mittels AES-Verschlüsselung, schreibt Diagnoseprotokolle mit log4net, versendet ausfallsichere E-Mail-Benachrichtigungen bei anhaltenden Fehlern und enthält eine umfassende Suite von 56 xUnit-Tests.",

    repo_5_what_is: "Eine plattformübergreifende Komplettlösung zur effizienten Verwaltung, Organisation und Helferkoordination von Kirchengemeinden.",
    repo_5_desc: "Ein einheitliches Kirchengemeinde-Orchestrierungssystem mit nativen Client-Anwendungen für iOS (entwickelt mit Swift, UIKit und URLSession) und Android (entwickelt mit Java, Volley und RecyclerView), gesteuert über ein schlankes JavaScript-Backend auf Google Apps Script, das Google Sheets als Datenbank nutzt und sich mit dem Google Calendar synchronisiert.",

    repo_6_what_is: "Ein ultra-schnelles Legacy-System-Utility zum schnellen Patch-Versionswechsel des Spiels Warcraft III: The Frozen Throne.",
    repo_6_desc: "Entwickelt zwischen 2009 und 2013 für kompetitive Garena-Spieler. Dieses leichtgewichtige Windows-Utility manipuliert Registry-Pfade, um Spiel-Patches in weniger als 10 Sekunden heiß zu wechseln, wodurch Gigabytes an Speicherplatz durch Vermeidung von Ordnerduplikaten gespart werden. Bietet ein benutzerdefiniertes rahmenloses Fenster mit klassischem und dunklem Design.",

    repo_7_what_is: "Ein umfassendes, webbasiertes Kirchen- und Gemeindeverwaltungssystem mit integrierten Benutzerrollen und mehrsprachiger Unterstützung.",
    repo_7_desc: "Eine voll ausgestattete Enterprise-Webanwendung auf Basis von ASP.NET Core 5.0 MVC und C# 9.0. Nutzt Entity Framework Core für das Datenmanagement, ASP.NET Core Identity für sichere Authentifizierung, SQL Server (mit SQLite-Unterstützung) und ein reaktives, Bootstrap-gesteuertes Frontend mit persischer/Farsi-Lokalisierung zur Verwaltung von Gottesdiensten, Sprecherplänen, Veranstaltungen und Diensten.",

    repo_8_what_is: "Ein professionelles, konsolidiertes Restaurant-Management-System zur Digitalisierung von Menüs, Kategorien, Medien und Systemadministration.",
    repo_8_desc: "Ein konsolidierter Arbeitsbereich mit zwei unabhängigen Full-Stack-Restaurant-Verwaltungssystemen: Eine moderne Webanwendung auf Basis von ASP.NET Core 1.1 (C#, EF Core) und eine klassische Webanwendung auf Basis von ASP.NET MVC 5 / .NET Framework 4.7.2 (EF 6 Database-First). Beide Stacks nutzen SQL Server-Datenbanken, Razor Views und responsive Speisekarten.",

    repo_9_what_is: "Ein intelligentes Web-FAQ-System zur automatisierten Beantwortung von Kundenanfragen mittels Textähnlichkeits-Algorithmen.",
    repo_9_desc: "Entwickelt als Bachelorarbeit. Eine C# .NET Framework 4.8 Full-Stack-Anwendung mit einer dedizierten Bibliothek (`KefirProjectLib`), die TF-IDF-Vektorisierung und Kosinus-Ähnlichkeitsberechnungen für semantischen Textabgleich durchführt. Nicht übereinstimmende Anfragen werden in einer SQL Server-Datenbank gespeichert und können in einem reaktiven AngularJS 1.5.8- und Bootstrap 3-Dashboard eingesehen werden.",

    repo_10_what_is: "Eine ansprechende Windows Forms Desktop-Anwendung mit kontinuierlicher MP3-Audiowiedergabe und flüssigen grafischen Übergängen.",
    repo_10_desc: "Intern bekannt als „Dictionary 2015“. Eine C# .NET Framework 4.5.1 Windows Forms-App, die eine nahtlose Audio-Integration demonstriert. Sie extrahiert beim Start eine eingebettete MP3-Ressource in das temporäre Verzeichnis für eine kontinuierliche Wiedergabe mit der WMPLib COM-Bibliothek, verpackt in einem benutzerdefinierten, rahmenlosen und ziehbaren Fenster mit sanften Einblend- und Schiebeanimationen.",

    // Contact
    section_contact_title: "Lassen Sie uns vernetzen!",
    section_contact_subtitle: "Bereit für das nächste datengetriebene Projekt?",
    contact_desc: "Ich freue mich über Anfragen für Positionen in Hamburg, Lübeck oder 100% Remote. Kontaktieren Sie mich gerne über LinkedIn oder GitHub.",

    contact_linkedin_btn: "Auf LinkedIn vernetzen",
    footer_text: "© 2026 Amir Argani. Alle Rechte vorbehalten. Entwickelt mit Fokus auf Data Science & Software Engineering."
  },
  en: {
    // Navigation
    nav_about: "About Me",
    nav_problem_solution: "My Approach",
    nav_projects: "Projects",
    nav_skills: "Skills",
    nav_certificates: "Certificates",
    nav_contact: "Contact",

    // Certificates Section
    section_cert_title: "Certificates & Completion Certificates",
    section_cert_subtitle: "Official proof of my Data Science training at DSI Berlin",
    cert_1_title: "Certificate – 6 Months Data Science",
    cert_1_issuer: "DSI Berlin – Data Science Institute",
    cert_2_title: "Certificate of Completion – Data Science",
    cert_2_issuer: "DSI Berlin – Data Science Institute",
    cert_view_btn: "Open PDF",
    cert_modal_close: "Close",

    // Hero Section
    hero_badge: "Software Engineer & Data Enthusiast",
    hero_greeting: "Hello, I am",
    hero_title: "Amir Argani",
    hero_subtitle: "Data meets Software Engineering",
    hero_desc: "I build the bridge between code, AI, and business value. Since 2014, I have been developing digital solutions, combining Computer Engineering with practical training in Data Science & AI (DSI Berlin).",
    hero_roles_title: "I am looking for new challenges as:",
    hero_roles: "Data Scientist • Analytics Engineer • Data Engineer",
    hero_pref_title: "Preferences:",
    hero_pref: "Hamburg • Lübeck • 100% Remote in Germany",
    hero_cv_btn: "Get in Touch",
    hero_github_btn: "View GitHub",

    // Problem & Solution
    section_ps_title: "The Problem & My Approach",
    section_ps_subtitle: "How I help companies turn data into actionable solutions",
    problem_title: "The Problem in Enterprises",
    problem_desc_1: "Many companies collect data – but don't utilize it effectively.",
    problem_point_1: "Manual processes slow down valuable operations.",
    problem_point_2: "Data remains trapped in isolated datasis (e.g., between time tracking and ERP systems).",
    problem_point_3: "A lack of structure leads to poor data quality and unreliable decision-making.",
    solution_title: "My Solution Approach",
    solution_desc_1: "I build systems that break down these barriers.",
    solution_point_1: "Integration of data directly into existing business workflows.",
    solution_point_2: "Clear data structures, clean mapping, and automated validation.",
    solution_point_3: "Full automation instead of manual data entry/transfer.",
    solution_point_4: "Intelligent combination of ERP systems with Machine Learning.",

    // Projects (CRObuzzer)
    section_projects_title: "Success Stories & Projects",
    section_projects_subtitle: "Real-world examples of data-driven integrations",
    crobuzzer_badge: "ERP Integration",
    crobuzzer_title: "CRObuzzer",
    crobuzzer_desc: "A prime example of data integration: The seamless connection of timeBuzzer with Microsoft Dynamics 365 Business Central.",
    crobuzzer_challenge_title: "Challenge:",
    crobuzzer_challenge: "Manually transferring time-tracking data is error-prone and blocks valuable resources.",
    crobuzzer_solution_title: "Outcome:",
    crobuzzer_result_1: "Automatic synchronization of time tracking data directly into project and billing logic.",
    crobuzzer_result_2: "Significantly reduced manual labor, error-free data quality, and a reliable foundation for decision-making in project controlling.",
    crobuzzer_tech_used: "Technologies: Business Central (AL), APIs, JavaScript, Postman",
    project_link_text: "Visit Website",

    // Skills
    section_skills_title: "Knowledge & Tech Skills",
    section_skills_subtitle: "Structured overview of my technology stack",
    skill_level_label: "Skill Level",

    // Skill Categories
    cat_data_science: "Data Analysis & BI Tools",
    cat_programming: "Programming",
    cat_web_dev: "Web Development",
    cat_app_dev: "App Development",
    cat_cloud_devops: "Cloud & DevOps",
    cat_databases: "Databases",
    cat_automation_etl: "Automation & ETL",
    cat_office_365: "Office 365",
    cat_tools: "Tools & Platforms",
    cat_languages: "Languages",

    // Skill Subcategories
    subcat_data_science: "Data Science",
    subcat_bi_tools: "BI Tools",
    subcat_relational: "Relational Databases",
    subcat_nosql: "NoSQL Databases",

    // Skill Specific labels
    skill_ml: "Machine Learning (Scikit-Learn, Regression, etc.)",
    skill_eda: "EDA (Exploratory Data Analysis)",
    skill_al: "AL Programming Language (Business Central)",
    skill_nosql: "MongoDB",
    skill_sql_server: "SQL Server",
    skill_mysql: "MySQL",
    skill_postgresql: "PostgreSQL",
    skill_sqlite: "SQLite",
    skill_make: "Make",
    skill_n8n: "n8n",
    skill_airflow: "Apache Airflow",
    skill_excel: "Excel",
    skill_word: "Word",
    skill_powerpoint: "PowerPoint",
    skill_tableau: "Tableau",

    // Languages
    lang_persian: "Persian (Native)",
    lang_german: "German (Fluent)",
    lang_english: "English (Conversational)",
    lang_persian_level: "100%",
    lang_german_level: "70%",
    lang_english_level: "47%",

    // GitHub Repositories Section
    section_repos_title: "GitHub Repositories",
    section_repos_subtitle: "Explore my open-source projects and code architectures",
    repo_filter_all: "All",
    repo_filter_ds: "Data Science",
    repo_filter_web: "Web & Cloud",
    repo_filter_desktop: "Desktop & Systems",
    repo_filter_mobile: "Mobile & Cross-Platform",
    repo_what_is: "What it is & Goal",
    repo_desc: "Description",
    repo_techs: "Technologies Used",
    repo_visit: "View project on GitHub",

    repo_1_what_is: "An automated data pipeline and forecasting project that downloads and processes official monthly labor market data for Germany.",
    repo_1_desc: "Downloads official monthly unemployment data from the Federal Employment Agency (BA), parses it into CSV datasets, and runs two independent AutoML engines (H2O AutoML and Auto-sklearn) to forecast the current month's figures. The pipeline is containerized using Docker and Docker Compose.",

    repo_2_what_is: "A professional-grade full-stack monitoring dashboard for real-time monitoring and fully automated recovery of critical Windows services.",
    repo_2_desc: "A professional-grade client-server monitoring dashboard that tracks critical Windows services. Features real-time status heartbeats, custom auto-recovery retry policies, interactive charts via Recharts, and deep Google Gemini AI integration to analyze log files and recommend diagnostic solutions.",

    repo_3_what_is: "An interactive data analysis and machine learning web application highlighting the challenges facing youth in Germany.",
    repo_3_desc: "A collaborative data science project exploring educational, employment, and mental health challenges facing German youth. Built as an interactive Streamlit dashboard featuring custom data pipelines with Pandas, dynamic Plotly visualizations, Scikit-learn regression models for unemployment forecasting, and comparative Power BI (.pbix) dashboards.",

    repo_4_what_is: "A high-performance Windows Forms desktop application for continuous monitoring and automated recovery of critical Windows services.",
    repo_4_desc: "A robust system-monitoring application built on .NET 10 that tracks critical running programs. Instantly restarts failed services, encrypts sensitive configurations (SMTP/credentials) using AES encryption, prints diagnostic traces with log4net, sends fail-safe email notifications upon persistent failure, and includes a full suite of 56 xUnit tests.",

    repo_5_what_is: "A cross-platform complete solution for efficient management, organization, and volunteer coordination of church parishes.",
    repo_5_desc: "A unified church orchestration system containing native client applications for iOS (built with Swift, UIKit, and URLSession) and Android (built with Java, Volley, and RecyclerView), powered by a lightweight JavaScript backend running on Google Apps Script, using Google Sheets as a database and syncing with Google Calendar.",

    repo_6_what_is: "An ultra-fast legacy system utility for rapidly switching patch versions of the game Warcraft III: The Frozen Throne.",
    repo_6_desc: "Developed between 2009 and 2013 for competitive Garena players. This lightweight Windows utility manipulates registry paths to hot-swap game patches in under 10 seconds, saving gigabytes of storage by avoiding folder duplication. Features a custom borderless form with both classic and dark themes.",

    repo_7_what_is: "A comprehensive, web-based church and parish management system with integrated user roles and multilingual support.",
    repo_7_desc: "A full-featured enterprise web application built on ASP.NET Core 5.0 MVC and C# 9.0. It leverages Entity Framework Core for data management, ASP.NET Core Identity for secure authentication, SQL Server (with SQLite support), and a responsive Bootstrap-powered frontend with Farsi/Persian localization to manage worship services, speaker scheduling, events, and ministries.",

    repo_8_what_is: "A professional, consolidated restaurant management system for digitizing menus, categories, media, and system administration.",
    repo_8_desc: "A consolidated workspace housing two independent, full-stack restaurant administration systems: a modern web application built on ASP.NET Core 1.1 (C#, EF Core) and a classic web app built on ASP.NET MVC 5 / .NET Framework 4.7.2 (EF 6 Database-First). Both stacks utilize SQL Server databases, Razor Views, and responsive frontend menus.",

    repo_9_what_is: "An intelligent web FAQ system for automated answering of customer inquiries using text similarity algorithms.",
    repo_9_desc: "Designed as a Bachelor's thesis project. A C# .NET Framework 4.8 full-stack application featuring a dedicated library (`KefirProjectLib`) that runs TF-IDF vectorization and cosine similarity calculations for semantic text matching. Unmatched queries are persisted to a SQL Server database for review in a responsive AngularJS 1.5.8 and Bootstrap 3 dashboard.",

    repo_10_what_is: "An engaging Windows Forms desktop application with continuous MP3 audio playback and fluid graphical transitions.",
    repo_10_desc: "Known internally as 'Dictionary 2015'. A C# .NET Framework 4.5.1 Windows Forms app showcasing seamless audio integration. It extracts an embedded MP3 resource to the temp directory on startup for continuous playback using the WMPLib COM library, all wrapped in a custom borderless draggable frame with smooth fade and slide animations.",

    // Contact
    section_contact_title: "Let's Connect!",
    section_contact_subtitle: "Ready for the next data-driven project?",
    contact_desc: "I look forward to hearing about opportunities in Hamburg, Lübeck, or 100% Remote. Feel free to contact me via LinkedIn or GitHub.",

    contact_linkedin_btn: "Connect on LinkedIn",
    footer_text: "© 2026 Amir Argani. All rights reserved. Built with focus on Data Science & Software Engineering."
  }
};

// Global variables
let currentLang = localStorage.getItem("portfolio_lang") || "en";


// Calculate dynamic category percentages based on bottom subcategories
function calculateCategoryPercentages() {
  const radialProgresses = document.querySelectorAll(".radial-progress[data-category]");
  radialProgresses.forEach(item => {
    const catKey = item.getAttribute("data-category");
    // Find the category card in the bottom grid
    const bottomTitle = document.querySelector(`.skill-cat-card h3[data-i18n="${catKey}"]`);
    if (bottomTitle) {
      const card = bottomTitle.closest(".skill-cat-card");
      if (card) {
        const skillItems = card.querySelectorAll(".skill-list .skill-item");
        let total = 0;
        let count = 0;
        skillItems.forEach(skill => {
          const progressAttr = skill.getAttribute("data-progress");
          if (progressAttr) {
            total += parseInt(progressAttr, 10);
            count++;
          }
        });
        const average = count > 0 ? Math.round(total / count) : 0;
        item.setAttribute("data-progress", average);

        const valElem = item.querySelector(".gauge-val");
        if (valElem) {
          valElem.textContent = `${average}%`;
        }
      }
    }
  });
}

// Function to update the page texts
function updateLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("portfolio_lang", lang);

  // Update HTML lang attribute
  document.documentElement.setAttribute("lang", lang);

  // Find all elements with data-i18n attribute
  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      // If it has children (like nested SVGs or icons), we might only want to replace text.
      // But we can use innerHTML for clean integration if we format translations correctly.
      element.innerHTML = translations[lang][key];
    }
  });

  // Handle active states on language switch buttons
  document.querySelectorAll(".lang-btn").forEach(btn => {
    const btnLang = btn.getAttribute("data-lang");
    if (btnLang === lang) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Calculate dynamic percentages for circular gauges (data-progress set here)
  calculateCategoryPercentages();
  // Note: animateSkillBars() is intentionally NOT called here —
  // it is triggered once by the IntersectionObserver when the user scrolls to #skills
}

// Skill bars progress animation — runs once on page load with stagger
function animateSkillBars() {
  const skillItems = document.querySelectorAll(".skill-item, .radial-progress");

  skillItems.forEach((item, index) => {
    const progress = item.getAttribute("data-progress");
    const delay = index * 55; // 55ms stagger between each bar/circle

    // Animate linear progress bar
    const bar = item.querySelector(".progress-bar-fill");
    if (bar) {
      bar.style.transition = "none";
      bar.style.width = "0%";         // reset to start
      bar.getBoundingClientRect();    // force reflow
      setTimeout(() => {
        bar.style.transition = "width 1.4s cubic-bezier(0.16, 1, 0.3, 1)";
        bar.style.width = `${progress}%`;
      }, delay);
    }

    // Animate radial progress ring
    const circle = item.querySelector(".progress-circle-fill");
    if (circle) {
      const radius = (circle.r && circle.r.baseVal && circle.r.baseVal.value > 0) ? circle.r.baseVal.value : 45;
      const circumference = 2 * Math.PI * radius;
      const targetOffset = circumference - (progress / 100) * circumference;

      circle.style.transition = "none";
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      circle.style.strokeDashoffset = circumference; // reset to empty
      circle.getBoundingClientRect();                 // force reflow
      setTimeout(() => {
        circle.style.transition = "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)";
        circle.style.strokeDashoffset = targetOffset;
      }, delay);
    }
  });
}

// Setup reveal animations on scroll
function setupScrollAnimations() {
  const animatedElements = document.querySelectorAll(".reveal");
  const skillsFeatured = document.querySelector(".skills-featured");
  let circlesAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target); // fire once per element

        // 1) Circular gauges: animate when the featured gauge row enters view
        if (!circlesAnimated && entry.target.classList.contains("skills-featured")) {
          circlesAnimated = true;
          setTimeout(() => animateRadialCircles(), 150);
        }

        // 2) Linear bars: animate per card when each skill-cat-card enters view
        if (entry.target.classList.contains("skill-cat-card")) {
          setTimeout(() => animateBarsInCard(entry.target), 150);
        }
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  animatedElements.forEach(el => observer.observe(el));
}

// Animate only the circular radial gauges (once on scroll into view)
function animateRadialCircles() {
  const circles = document.querySelectorAll(".radial-progress");
  circles.forEach((item, index) => {
    const progress = parseInt(item.getAttribute("data-progress") || "0", 10);
    const circle = item.querySelector(".progress-circle-fill");
    if (!circle) return;
    const radius = (circle.r && circle.r.baseVal && circle.r.baseVal.value > 0) ? circle.r.baseVal.value : 45;
    const circumference = 2 * Math.PI * radius;
    const targetOffset = circumference - (progress / 100) * circumference;

    // Reset to empty (no transition)
    circle.style.transition = "none";
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = String(circumference);

    // Double rAF: ensures browser has painted the reset before starting transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          circle.style.transition = "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)";
          circle.style.strokeDashoffset = String(targetOffset);
        }, index * 80);
      });
    });
  });
}

// Animate only the linear progress bars inside a given skill category card
function animateBarsInCard(card) {
  const bars = card.querySelectorAll(".skill-item");
  bars.forEach((item, index) => {
    const progress = parseInt(item.getAttribute("data-progress") || "0", 10);
    const bar = item.querySelector(".progress-bar-fill");
    if (!bar) return;

    // Reset to 0 (no transition)
    bar.style.transition = "none";
    bar.style.width = "0%";

    // Double rAF: ensures browser has painted reset before transition starts
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          bar.style.transition = "width 1.4s cubic-bezier(0.16, 1, 0.3, 1)";
          bar.style.width = `${progress}%`;
        }, index * 80);
      });
    });
  });
}

// Legacy: kept for compatibility (e.g. language switch scenario)
function animateSkillBars() {
  animateRadialCircles();
  document.querySelectorAll(".skill-cat-card").forEach(card => animateBarsInCard(card));
}


// Mouse movement interactive light effect (glow cards)
function setupCardGlowEffect() {
  const cards = document.querySelectorAll(".glow-card");

  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top;  // y position within the element

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
}

// Document ready entry point
document.addEventListener("DOMContentLoaded", () => {
  // Setup language toggle triggers
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const selectedLang = btn.getAttribute("data-lang");
      updateLanguage(selectedLang);
    });
  });

  // Mobile menu control
  const mobileToggle = document.getElementById("mobile-toggle");
  const navLinks = document.getElementById("nav-links");

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      mobileToggle.classList.toggle("active");
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        mobileToggle.classList.remove("active");
      });
    });
  }

  // Set initial language
  updateLanguage(currentLang);

  // Setup visual effects & animations
  setupScrollAnimations();
  setupCardGlowEffect();

  // Dynamic smooth scroll-to-card for circular gauges
  document.querySelectorAll(".radial-progress[data-category]").forEach(gauge => {
    gauge.addEventListener("click", () => {
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

  // GitHub Repositories Filter Logic
  const filterBtns = document.querySelectorAll(".repo-filter-btn");
  const repoItems = document.querySelectorAll(".repo-item");

  if (filterBtns.length > 0 && repoItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filterValue = btn.getAttribute("data-filter");

        repoItems.forEach(item => {
          if (item.hasAttribute("open")) {
            item.removeAttribute("open");
          }

          if (filterValue === "all" || item.getAttribute("data-category") === filterValue) {
            item.style.display = "block";
            item.style.opacity = "0";
            item.style.transform = "translateY(10px)";
            item.style.transition = "opacity 0.4s ease, transform 0.4s ease";
            setTimeout(() => {
              item.style.opacity = "1";
              item.style.transform = "translateY(0)";
            }, 50);
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  }

  // Back to Top Button logic
  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // ==========================================
  // PDF Viewer Modal Logic
  // ==========================================
  const certButtons = document.querySelectorAll(".cert-open-btn");
  const modal = document.getElementById("cert-modal");
  const modalIframe = document.getElementById("cert-modal-iframe");
  const modalTitle = document.getElementById("cert-modal-title");
  const modalClose = document.getElementById("cert-modal-close");

  function openPdfModal(pdfUrl, title) {
    if (!modal || !modalIframe) return;

    modalTitle.textContent = title;
    // Use Google Docs Viewer to bypass Safari's native PDF HUD
    modalIframe.src = "https://docs.google.com/gview?url=" + encodeURIComponent(pdfUrl) + "&embedded=true";

    modal.classList.add("open");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  }

  function closePdfModal() {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
    // Clear iframe src after animation to stop loading
    setTimeout(() => {
      if (modalIframe) modalIframe.src = "";
    }, 350);
  }

  // Attach click events to all certificate buttons
  certButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = btn.closest(".cert-card");
      if (!card) return;

      // Get the correct PDF based on current language and decode it
      const pdfUrlBase64 = card.getAttribute(`data-pdf-${currentLang}`);
      let pdfUrl = "";
      try {
        pdfUrl = atob(pdfUrlBase64);
      } catch (e) {
        console.error("Error decoding PDF URL", e);
        return;
      }
      
      const titleElement = card.querySelector(".cert-title");
      const title = titleElement ? titleElement.textContent : "Certificate";

      openPdfModal(pdfUrl, title);
    });
  });

  // Close modal when close button is clicked
  if (modalClose) {
    modalClose.addEventListener("click", closePdfModal);
  }

  // Close modal when clicking outside the box (on the overlay)
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closePdfModal();
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("open")) {
      closePdfModal();
    }
  });

});
