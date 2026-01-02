# Todo Application Constitution
<!--
  Sync Impact Report:
  Version: 1.0.0 (Initial Release)
  Modified Principles: N/A (new constitution)
  Added Sections: All sections (initial creation)
  Removed Sections: None
  Templates Requiring Updates:
    ✅ .specify/templates/plan-template.md - compatible (generic constitution check)
    ✅ .specify/templates/spec-template.md - compatible (no changes needed)
    ✅ .specify/templates/tasks-template.md - compatible (no changes needed)
  Follow-up TODOs: None
-->

## Core Principles

### I. Specification as Source of Truth (NON-NEGOTIABLE)

**MUST** write and approve specification before any code implementation. No code may be written without a corresponding approved specification document. This ensures clear requirements and prevents scope creep or misalignment.

**Rationale**: Specifications provide a single source of truth that aligns all stakeholders on requirements before investment in implementation. Changes to specifications require explicit approval and versioning.

### II. Accuracy & Implementation Fidelity (NON-NEGOTIABLE)

Implementation **MUST** exactly match specifications with zero deviation. Any discovered need for deviation requires specification update and re-approval before proceeding.

**Rationale**: Ensures predictability and trust in the development process. Prevents "creative interpretation" that leads to mismatched expectations.

### III. Reproducibility & Documentation

Project **MUST** run successfully using only documented steps. No undocumented dependencies, configurations, or "tribal knowledge" permitted.

**Requirements**:
- Complete setup instructions in documentation
- All dependencies explicitly declared
- Environment setup fully scripted or documented
- No manual configuration steps unless documented

**Rationale**: Enables new team members to onboard quickly, ensures consistent environments, and prevents "works on my machine" issues.

### IV. Clean Code Standards (NON-NEGOTIABLE)

Code **MUST** adhere to clean code principles:
- **Readable**: Self-documenting with clear names and structure
- **Modular**: Separated concerns with single-responsibility functions/classes
- **Single Responsibility**: Each component has one clear purpose
- **Minimal Complexity**: Simplest solution that meets requirements

**Rationale**: Clean code reduces maintenance burden, improves collaboration, and minimizes bugs.

### V. Mandatory Workflow Sequence (NON-NEGOTIABLE)

Development **MUST** follow this exact sequence without skipping steps:

1. **Specification** → Write complete spec.md
2. **Planning** → Generate implementation plan.md
3. **Task Breakdown** → Create tasks.md with testable tasks
4. **Implementation** → Execute using Claude Code

**Rationale**: Each step builds on the previous, ensuring thorough thinking before coding. Skipping steps leads to rework and technical debt.

## Functional Scope

### Mandatory Features

The application **MUST** support all five core features without exception:

1. **Add Todo** - Create new todo items
2. **View Todos** - List all todos with status visibility
3. **Update Todo** - Modify existing todo content
4. **Delete Todo** - Remove todos from the list
5. **Mark Complete/Incomplete** - Toggle todo completion status

### Data Requirements

- Each todo **MUST** have a unique ID (auto-generated)
- Data storage is in-memory only (no persistence)
- Status (complete/incomplete) **MUST** be visible in all listings
- No database, file system, or external storage permitted

**Rationale**: Defines exact scope to prevent feature creep and ensures MVP clarity.

## Technical Constraints

### Technology Stack (MANDATORY)

- **Language**: Python 3.13 or higher - **MUST** be verified before implementation
- **Application Type**: Console/CLI only - no GUI, web, or network interfaces
- **Dependency Management**: UV - **MUST** be used for all dependency management
- **Prohibited Features**:
  - No file persistence or database
  - No network communication
  - No external service integrations
  - No GUI frameworks

**Rationale**: Constraints ensure focus on core functionality and prevent over-engineering. Python 3.13+ provides modern language features and UV ensures reproducible dependency management.

### Code Quality Requirements

- Follow PEP 8 style guidelines
- Type hints required for all function signatures
- Docstrings for all public functions and classes
- Maximum function length: 50 lines (exceptions require justification)
- Maximum cyclomatic complexity: 10 (exceptions require justification)

## Development Workflow

### Spec-Driven Development Process

1. **Specification Phase**
   - Use `/sp.specify` command to create spec.md
   - Spec must include user stories, requirements, and success criteria
   - Requires explicit approval before proceeding

2. **Planning Phase**
   - Use `/sp.plan` command to generate plan.md
   - Must include architecture, technical context, and structure decisions
   - Constitution Check gate must pass

3. **Task Breakdown Phase**
   - Use `/sp.tasks` command to create tasks.md
   - Tasks must be testable, specific, and include exact file paths
   - Dependencies must be explicit

4. **Implementation Phase**
   - Use `/sp.implement` command to execute tasks
   - Follow TDD if tests are included
   - Commit after each logical task completion

### Quality Gates

- **Gate 1 (Pre-Planning)**: Specification approved and complete
- **Gate 2 (Pre-Tasks)**: Implementation plan passes Constitution Check
- **Gate 3 (Pre-Implementation)**: Tasks are concrete with clear acceptance criteria
- **Gate 4 (Post-Implementation)**: All acceptance criteria met and verified

## Governance

### Constitution Authority

This constitution supersedes all other development practices and guidelines. When conflict arises between this document and any other guidance, this constitution takes precedence.

### Amendment Process

1. Amendments require documented justification
2. All changes must be versioned using semantic versioning
3. Impact analysis required on dependent templates and artifacts
4. Approval required before amendments take effect
5. Migration plan required for breaking changes

### Compliance

- All pull requests must verify compliance with this constitution
- Code reviews must check adherence to principles
- Any complexity or deviation must be explicitly justified in plan.md
- Violations require either remediation or formal amendment

### Version Control

- Constitution changes trigger version increment
- Templates (spec, plan, tasks) must remain compatible
- Breaking changes require MAJOR version bump
- New sections/principles require MINOR version bump
- Clarifications/fixes require PATCH version bump

### Runtime Development Guidance

For agent-specific operational guidelines, refer to `CLAUDE.md` which provides execution-level instructions that complement these constitutional principles.

**Version**: 1.0.0 | **Ratified**: 2025-12-31 | **Last Amended**: 2025-12-31
