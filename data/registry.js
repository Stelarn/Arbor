window.DOMAINS = {
  engines: {
    id: "engines",
    label: "Game Engines",
    icon: "🕹️",
    dataFile: "data/engines.json",
    primaryKey: "engine",
    dateKey: "release_date",
    tagline: "75 real-time 2D/3D engines, runtime memory models, netcode & console porting pipelines",
    era: "1993 – 2026",
    tracks: [
      { id: 1, label: "id Tech / Quake / Valve Source" },
      { id: 2, label: "Valve Source 1 & 2" },
      { id: 3, label: "Epic Unreal Engine Trunk" },
      { id: 4, label: "CryEngine / Amazon / O3DE" },
      { id: 5, label: "Microsoft XNA / MonoGame / FNA" },
      { id: 6, label: "Unity / Flax / Godot" },
      { id: 7, label: "Indie 2D & Modern ECS (Bevy / Defold)" }
    ],
    tableColumns: [
      { key: "engine", label: "Engine", type: "text", sticky: true },
      { key: "language", label: "Language", type: "badge" },
      { key: "network_model.badge", label: "Network Tier", type: "net-status" },
      { key: "console_model.badge", label: "Console Tier", type: "console-status" },
      { key: "form", label: "Form", type: "text" },
      { key: "share", label: "Market Share", type: "share" },
      { key: "last_update", label: "Last Update", type: "date" },
      { key: "physics", label: "Physics Engine", type: "text" }
    ],
    filterFacets: [
      { id: "form", label: "Form", options: ["3D", "2D", "Framework", "Web", "Fantasy"] },
      { id: "network", label: "Network Readiness", options: ["AAA Server", "High-Level RPC", "P2P / WebRTC", "Sockets / DIY", "Offline Focus"] },
      { id: "console", label: "Console Porting", options: ["Tier 1", "Tier 2", "Tier 3", "N/A"] }
    ]
  },

  coding_languages: {
    id: "coding_languages",
    label: "Coding Languages",
    icon: "💻",
    dataFile: "data/coding-languages.json",
    primaryKey: "name",
    dateKey: "year",
    tagline: "43 systems & scripting languages, type theories, memory models & C/C++ FFI overhead",
    era: "1949 – 2026",
    tracks: [
      { id: "tr_hardware", label: "Low-Level Systems & C Trunk" },
      { id: "tr_algol", label: "ALGOL / Pascal / Managed .NET" },
      { id: "tr_simula_oop", label: "Simula / Smalltalk / JVM & Mobile" },
      { id: "tr_lisp_web", label: "Lisp / Web Scripting & TypeScript" },
      { id: "tr_ml_rust", label: "ML / Type Theory & Rust Systems" },
      { id: "tr_dynamic", label: "Dynamic Scripting (Python / Lua / Ruby)" }
    ],
    tableColumns: [
      { key: "name", label: "Language", type: "text", sticky: true },
      { key: "year", label: "Year", type: "number" },
      { key: "lineage_type", label: "Archetype", type: "lineage-badge" },
      { key: "creator", label: "Creator", type: "text" },
      { key: "paradigms", label: "Primary Paradigm", type: "array-first" },
      { key: "memory_model", label: "Memory Architecture", type: "text" },
      { key: "ffi_status", label: "C FFI Status", type: "badge" }
    ],
    filterFacets: [
      { id: "lineage", label: "Archetype", options: ["Fresh Root", "Direct Evolution", "Crossbreed", "Hard Fork", "Inspired Evolution"] },
      { id: "mem", label: "Memory Model", options: ["Manual", "Ownership", "Garbage", "ARC"] }
    ]
  },

  written_languages: {
    id: "written_languages",
    label: "Written & Natural Languages",
    icon: "📖",
    dataFile: "data/written-languages.json",
    primaryKey: "name",
    dateKey: "year",
    tagline: "Proto-languages, writing script evolutions, phonological shifts & historical language families",
    era: "8000 BCE – 2026 CE",
    tracks: [
      { id: 1, label: "Indo-European Phylum (Germanic / Italic / Hellenic)" },
      { id: 2, label: "Afroasiatic Phylum (Egyptian / Semitic / Phoenician)" },
      { id: 3, label: "Sino-Tibetan Phylum (Old Chinese -> Middle Chinese -> Mandarin)" },
      { id: 4, label: "Ancient Isolates & Cuneiform (Sumerian)" }
    ],
    tableColumns: [
      { key: "name", label: "Language", type: "text", sticky: true },
      { key: "year_display", label: "Attested Era", type: "text" },
      { key: "lineage_type", label: "Archetype", type: "lineage-badge" },
      { key: "family", label: "Linguistic Family", type: "badge" },
      { key: "script", label: "Writing Script / System", type: "text" },
      { key: "speakers", label: "Speakers / Status", type: "text" }
    ],
    filterFacets: [
      { id: "family", label: "Language Family", options: ["Indo-European", "Afroasiatic", "Sino-Tibetan", "Language Isolate"] },
      { id: "lineage", label: "Lineage Type", options: ["Fresh Root", "Direct Evolution", "Crossbreed"] }
    ]
  }
};
