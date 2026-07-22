---
description: Rule: Comprehensive PRD & Visual Asset Scanning
---

henever you are tasked with analyzing requirements, creating an implementation plan, or generating code for this project, you MUST perform a comprehensive read of the entire `PRD/` directory and all of its subdirectories (`PRD/**`).

### Mandatory Execution Steps:
1. **Scan Directory Structure:** Read all files inside `PRD/`, including subdirectories such as `PRD/RANCANGAN/` and `PRD/UIUX/`.
2. **Text Specifications:** Parse and understand all Markdown (`.md`) or text specifications thoroughly.
3. **Visual UI/UX Inspection (Crucial):** Do NOT ignore image files. You MUST explicitly execute your multimodal vision tool to load, view, and analyze every `.png`, `.jpg`, or `.webp` file found inside the `PRD/UIUX/` directory (and any other subdirectories inside `PRD/`).
4. **Cross-Referencing:** Synthesize the layout, color tokens, typography, and DOM hierarchy from the visual PNGs with the business logic and requirements written in the Markdown specifications before writing any code.