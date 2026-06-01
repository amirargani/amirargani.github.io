/**
 * Amir Argani - Portfolio Localization Dictionary
 * ===============================================
 * Language: English (EN)
 * Author: Amir Argani
 * 
 * Description: This file exposes `window.en` as a global dictionary object. It is mapped
 *              dynamically by `src/js/core.js` (`updateLanguage` function) to update all 
 *              DOM text nodes decorated with `data-i18n="key"` attributes when the locale 
 *              is toggled to English.
 */

var en = {
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
  cert_loader_text: "Loading PDF...",
  cert_loader_error: "The PDF could not be loaded after several attempts. Please click the Reload button (circular arrow) in the header to try manually.",

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
  hero_github_btn: "GitHub",

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
  kpi_tech_stack: "Technologies Mastered",
  kpi_avg_expertise: "Average Expertise",
  kpi_experience: "Practical Experience",
  kpi_experience_tech: "Technical Experience",
  kpi_experience_overall: "Overall Experience",
  kpi_certificates: "Earned Certificates",
  kpi_github_repos: "GitHub Repositories",

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
  skill_ml: "Machine Learning",
  skill_eda: "Exploratory Data Analysis",
  skill_al: "AL Programming Language",
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
  skill_spark: "Apache Spark",

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
  repo_all: "Repositories",

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
  contact_desc: "I look forward to hearing about opportunities in Hamburg, Lübeck, or 100% Remote. Feel free to contact me via LinkedIn.",
  contact_linkedin_btn: "Connect on LinkedIn",
  toggle_radial: "Radial",
  toggle_radar: "Radar",
  toggle_matrix: "Matrix",
  toggle_bar: "Bar",
  toggle_line: "Line",
  footer_text: `© ${new Date().getFullYear()} Amir Argani. All rights reserved.`,

  // Resume / CV
  nav_resume: "Resume",
  section_resume_title: "Resume",
  section_resume_subtitle: "My professional journey and education",
  resume_exp_title: "PROFESSIONAL EXPERIENCE",
  resume_edu_title: "EDUCATION",

  cv_exp_1_title: "Fullstack Developer with focus on Data Integration & Interfaces | CROMIND",
  cv_exp_1_meta: "06.2023 - 05.2025 • Schwarzenbek, Germany",
  cv_exp_1_p1: "Structured aggregation and processing of heterogeneous data sources to define high-impact KPIs and analytical insights",
  cv_exp_1_p2: "Engineered high-performance SQL-based data models for ERP systems to optimize enterprise-wide reporting",
  cv_exp_1_p3: "Designed and deployed the CROWBV application for fully automated acquisition, real-time processing, and secure storage of maritime measurement data",
  cv_exp_1_p4: "Conducted requirement analysis and coordination with C/AL developers (Microsoft Dynamics NAV), managed client inquiries via ticketing systems, and designed and implemented EDI and integration solutions utilizing SQL Server and SEEBURGER to automate data exchange and business processes for the client KleineWolke Lagerlogistik",
  cv_exp_1_p5: "Ensured seamless data consistency to enable precise, data-driven steering of operational business processes",
  cv_exp_1_p6: "Managed the reliable operation, proactive monitoring, and automated backups of business-critical EDI interfaces for a client's Monitor G5 ERP system",
  cv_exp_1_p7: "Successfully executed complex integration projects in the interface environment (including CRObuzzer) for Microsoft Dynamics 365 Business Central",
  cv_exp_1_p8: "Developed, optimized, and maintained modern RESTful and GraphQL APIs utilizing C# and .NET Core",
  cv_exp_1_p9: "Designed layouts, customized, and continuously developed complex analytical reports within Microsoft Dynamics 365 Business Central",
  cv_exp_1_p10: "Conducted in-depth technical analyses and code reviews, driving the continuous optimization and evolution of existing software solutions",
  cv_exp_1_p11: "Managed version control and project workflows via Azure DevOps (Repos/Boards) and orchestrated modern build/release CI/CD pipelines",
  cv_exp_1_p12: "Conducted systematic monitoring, structured logging, and precise root-cause error analysis of production systems using Icinga",

  cv_exp_2_title: "Fullstack Developer & Co-Founder | Samandahandegan Kasbokar Sana",
  cv_exp_2_meta: "05.2015 - 02.2017 • Isfahan, Iran",
  cv_exp_2_p1: "Designed and implemented robust backend architectures (APIs, SQL Server)",
  cv_exp_2_p2: "Automated complex image processing workflows utilizing Python",
  cv_exp_2_p3: "Developed cross-platform web, desktop, and mobile applications utilizing .NET and Xamarin / .NET MAUI",
  cv_exp_2_p4: "Co-founded and successfully established the startup UANDSHOP, a business-oriented social network",
  cv_exp_2_p5: "Secured seed funding and incubation support from Digikala as accelerator and investor",

  cv_exp_3_title: "Full Stack Developer & CTO | Beroz Pardaz Fahim Kostar",
  cv_exp_3_meta: "01.2014 - 05.2015 • Isfahan, Iran",
  cv_exp_3_p1: "Designed and implemented modern APIs alongside seamless integration of relational database management systems",
  cv_exp_3_p2: "Planned and implemented highly scalable backend and frontend solutions utilizing .NET and ASP.NET",
  cv_exp_3_p3: "Assumed overall technical leadership as CTO, driving software architecture, technology stack selection, and system design",
  cv_exp_3_p4: "Established development standards and best practices to systematically enhance code quality and long-term maintainability",
  cv_exp_3_p5: "Led and collaborated closely with agile cross-functional teams to translate complex technical requirements into product features",
  cv_exp_3_p6: "Developed and maintained business-critical desktop and web applications",

  cv_exp_4_title: "IT Specialist & Teacher | Karun School",
  cv_exp_4_meta: "09.2005 - 06.2013 • Isfahan, Iran",
  cv_exp_4_p1: "Delivered structured IT lectures (fundamentals & programming) and managed the comprehensive administration of the school's IT infrastructure",

  cv_edu_1_title: "Data Science | Data Science Institute by Fabian Rappert",
  cv_edu_1_meta: "05.2025 - 11.2025 • Berlin, Germany",
  cv_edu_1_p1: "Conception, construction, and orchestration of robust end-to-end data pipelines (ETL/ELT) including API integration",
  cv_edu_1_p2: "Large-scale data processing (Big Data Processing utilizing Apache Spark) and cloud scaling (AWS)",
  cv_edu_1_p3: "Architecture of structured data models and goal-oriented KPI design for business steering",
  cv_edu_1_p4: "Administration and optimization of modern database technologies (relational and NoSQL systems)",
  cv_edu_1_p5: "Establishment of high data quality standards, advanced data cleaning, and data preprocessing",
  cv_edu_1_p6: "Development of dynamic, interactive dashboards and data-driven reporting for decision-makers",
  cv_edu_1_p7: "In-depth data analysis, exploratory data analysis (EDA), and advanced statistical evaluation",
  cv_edu_1_p8: "Professional data visualization and strategic data storytelling to communicate complex insights clearly",
  cv_edu_1_p9: "Machine Learning (Designing models for Regression, Classification, Clustering, Feature Engineering, and robust Model Validation)",

  cv_edu_2_title: "B1-C1 German Course | bfw & IBH",
  cv_edu_2_meta: "12.2019 - 03.2023 • Lübeck & Hamburg, Germany",

  cv_edu_3_title: "Bachelor of Science in Software Engineering | Azad University",
  cv_edu_3_meta: "09.2013 - 03.2017 • Najafabad, Iran",

  resume_cert_title: "CERTIFICATES",
  cv_cert_1_title: "Data Science Crash Course by Fabian Rappert",
  cv_cert_1_meta: "09.11.2025 • Berlin, Germany",
  cv_cert_2_title: "telc Certificate German B2 Level",
  cv_cert_2_meta: "17.08.2022 • Hamburg, Germany",

  // Cookie Consent Banner & GDPR Manager
  cookie_settings_link: "Cookie Settings",
  cookie_title: "Cookie Consent",
  cookie_banner_desc: "I use cookies to personalize your website experience and optimize my tech stack dashboard. You can choose which cookies to allow.",
  cookie_btn_accept_all: "Accept All",
  cookie_btn_reject_all: "Reject",
  cookie_btn_customize: "Customize",
  cookie_btn_save: "Save Settings",
  cookie_cat_necessary_title: "Essential Cookies (Required)",
  cookie_cat_necessary_desc: "These cookies are strictly necessary for the core functionality of the website (e.g. saving language preferences and cookie choices) and cannot be disabled.",
  cookie_cat_pref_title: "Preference Cookies",
  cookie_cat_pref_desc: "Allows the website to remember user-personalized configurations, such as your active dashboard view (Radial / Radar).",
  cookie_cat_analytics_title: "Analytics Cookies",
  cookie_cat_analytics_desc: "Enables simulated statistics tracking to analyze how users interact with my interactive tech stack dashboard.",
  charts_overlay_title: "Interactive Charts Disabled",
  charts_overlay_desc: "To view interactive tech stack diagrams and local statistics, please enable Analytics Cookies in your settings.",
  cookie_toast_saved: "Cookie preferences saved successfully!",
  cookie_toast_accept_all: "All cookies have been successfully accepted!",
  cookie_toast_reject_all: "Optional cookies have been successfully declined.",
  cookie_toast_custom: "Cookie preferences have been successfully saved!",
  timeline_show_details: "Show Details",
  timeline_hide_details: "Hide Details"
};

