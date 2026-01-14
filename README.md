# CareConnect

**Left-Handed Caregivers — Accessible UI for Clinical Workflows**

CareConnect is a cross-platform user interface project focused on designing workflows optimized for left-handed caregivers, where traditional UI systems implicitly assume right-handed interaction. The goal is to reduce friction in documentation, scheduling, task execution, and navigation without degrading right-handed usability.

---

## Team Information

**Team Name:** The Three Stoodents (Team 2)  
**Course:** SWEN 661 — User Interface Implementation  
**Institution:** University of Maryland Global Campus  
**Project Type:** Academic (UI/UX, Human-Centered Design)

---

## Team Members & Roles

| Member          | Primary Role (Rotating)               |
|-----------------|---------------------------------------|
| Corey Bayliss   | Research & Usability Lead             |
| James Stevens   | Project Lead / Coordinator            |
| Tako Wiliss     | UX Design Lead                        |

**Role Rotation:** Every 2 weeks (see charter for schedule)

**Shared Responsibilities:**  
All team members will contribute to:
- Documentation & reporting  
- Research activities  
- Testing & evaluation  
- Design feedback and collaboration  
- Reviewing major decisions  

---

## Communication Protocol

**Primary Channel:** Microsoft Teams  
**Secondary Channel:** UMGC Email  
**Backup/Emergency:** Phone (shared privately), only if:
- Blocking issue < 24 hours before deadline
- Unresponsiveness > 48 hours
- Instructor-directed urgency

**Response Expectations:** Within 24 hours (Mon–Fri)

**Weekly Meetings:** 15–30 min synchronous check-ins, additional ad-hoc meetings as needed.

---

## Project Goals

CareConnect aims to:

1. Design UI layouts that support left-handed ergonomics without excluding right-handed users.
2. Improve workflow efficiency for left-handed caregivers in common digital tasks.
3. Apply human-centered design processes including research, prototyping, and usability testing.
4. Deliver a functional prototype for academic evaluation.
5. Produce supporting documentation detailing research, design rationale, and testing outcomes.

---

## Scope

**In Scope:**
- UI/UX design research
- Handedness ergonomics and workflow modeling
- Prototypes, wireframes, and visual layouts
- Front-end or prototype-only implementation
- Usability testing and documentation

**Out of Scope:**
- Backend services, servers, auth systems, databases
- HIPAA/PHI data or real clinical integrations
- Production deployment or distribution
- Full accessibility coverage beyond handedness focus

---

## Repository Structure

The repository is organized to support multiple UI platforms and shared documentation:

```text
CareConnect/
├── apps/
│   ├── flutter/
│   │   ├── .gitignore
│   │   └── README.md
│   ├── react-native/
│   │   ├── .gitignore
│   │   └── README.md
│   ├── electron/
│   │   ├── .gitignore
│   │   └── README.md
│   └── react/
│       ├── .gitignore
│       └── README.md
├── docs/
│   ├── TEAM-CHARTER.md
│   └── research/
├── .gitignore
└── README.md
```

Each folder under `apps/` will eventually contain a functioning prototype representing the CareConnect concept.

---


Each prototype folder under `apps/` will eventually represent a platform-specific UI based on the CareConnect concept.

---

## Git Workflow

The team follows standardized conventions defined in the charter:

**Branching:**  
`feature/<name>`, `fix/<name>`, `docs/<name>`

**Pull Requests:**  
- Required for all merges
- At least **one peer review**
- Must pass build/tests if applicable

**Merge Policy:**  
- No direct commits to `main`
- `main` must remain demo-ready

---

## Work Distribution Philosophy

The team allocates work based on:
- Rotating role assignments
- Skills and learning goals
- Timeline and workload balancing

Each member contributes to:
- Prototyping or coding
- Testing and QA
- Documentation
- Research and design feedback

Redistribution occurs if:
- Deadlines shift
- Availability changes
- Workload becomes uneven

---

## Definition of Done

A task is considered “Done” when:

- Requirements are met
- Work is reviewed by at least one teammate
- Issues/blockers are resolved
- Documentation is updated (if applicable)
- No obvious errors or missing content remain

Project success is defined by:
- All deliverables submitted on time
- Functional prototype demonstration
- Complete research + testing documentation
- Professional and constructive collaboration

---

## Team Charter

The full charter (including roles, escalation, success criteria, and conflict resolution) can be found at:

`./docs/TEAM-CHARTER.md`

---

## Tech Stacks

This project may involve:

- **Flutter** (Mobile)
- **React Native** (Mobile)
- **Electron** (Desktop)
- **React** (Web)

Only UI and workflow layers are in scope.

---

## Setup Instructions (To Be Updated)

Instructions will be added as each stack is initialized.

---

## Licensing / Notes

This repository is for academic use as part of **SWEN 661 — User Interface Implementation**.  
No parts of this project are intended for real clinical deployment.

---

**End of README**




