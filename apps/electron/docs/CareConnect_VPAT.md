# Voluntary Product Accessibility Template (VPAT)
**Version 2.4 — WCAG 2.1 Edition**

---

## Product Information

| | |
|---|---|
| **Product Name** | CareConnect Desktop |
| **Product Version** | 0.1.0 |
| **Report Date** | March 2026 |
| **Report Version** | 1.0 |
| **Contact** | James Stevens — SWEN-661 Team 2 |
| **Description** | CareConnect Desktop is an Electron-based healthcare task and patient management desktop application built with React, designed to support clinical workflows for caregivers including doctors, nurses, and home health professionals. |

---

## Applicable Standards

- Web Content Accessibility Guidelines (WCAG) 2.1, Levels A and AA
- Section 508 of the Rehabilitation Act (as amended)

---

## Conformance Level Definitions

| Term | Definition |
|------|-----------|
| **Supports** | The product meets the success criterion |
| **Partially Supports** | Some functionality meets the criterion, some does not |
| **Does Not Support** | The product does not meet the success criterion |
| **Not Applicable** | The criterion is not relevant to this product |

---

## WCAG 2.1 Success Criteria — Level A

| # | Criteria | Conformance Level | Remarks |
|---|----------|------------------|---------|
| 1.1.1 | Non-text Content | Supports | All images include descriptive alt text. The CareConnect logo includes alt="CareConnect". Decorative icons are marked aria-hidden="true" so screen readers skip them. |
| 1.2.1 | Audio-only and Video-only | Not Applicable | No audio or video content in the application. |
| 1.2.2 | Captions | Not Applicable | No video content present. |
| 1.2.3 | Audio Description | Not Applicable | No video content present. |
| 1.3.1 | Info and Relationships | Supports | Semantic HTML used throughout. Headings follow a logical hierarchy (h1 to h2). Form fields are associated with labels via htmlFor and id. Tables on the Shortcuts page include scope attributes on headers. |
| 1.3.2 | Meaningful Sequence | Supports | DOM order matches the visual reading order across all screens. |
| 1.3.3 | Sensory Characteristics | Supports | No instructions rely solely on shape, color, size, or spatial location. All instructions use text descriptions. |
| 1.4.1 | Use of Color | Supports | Color is not the only means of conveying information. Priority badges include text labels in addition to color coding. |
| 1.4.2 | Audio Control | Not Applicable | No audio content present. |
| 2.1.1 | Keyboard | Supports | All features are operable via keyboard. Custom keyboard shortcuts implemented for navigation (Cmd+1–4), task creation (Cmd+N), patient management (Cmd+P), and layout toggle (Cmd+Shift+L/R). |
| 2.1.2 | No Keyboard Trap | Supports | Modal dialogs trap focus intentionally and provide Escape key dismissal and a visible close button. Focus returns to the triggering element on close. |
| 2.1.4 | Character Key Shortcuts | Supports | All keyboard shortcuts require modifier keys (Cmd/Ctrl), preventing accidental activation by single keypress. |
| 2.2.1 | Timing Adjustable | Not Applicable | No time limits are imposed on users. |
| 2.2.2 | Pause, Stop, Hide | Not Applicable | No moving or auto-updating content present. |
| 2.3.1 | Three Flashes | Supports | No flashing content present in the application. |
| 2.4.1 | Bypass Blocks | Supports | Main content area includes id="main" with tabindex="-1" to support skip navigation. |
| 2.4.2 | Page Titled | Supports | Application window title is set to CareConnect. |
| 2.4.3 | Focus Order | Supports | Focus order follows a logical top-to-bottom, left-to-right sequence matching the visual layout across all screens. |
| 2.4.4 | Link Purpose | Supports | All buttons and links have descriptive visible text or aria-label attributes that clearly indicate their purpose. |
| 2.5.1 | Pointer Gestures | Not Applicable | No multi-point or path-based gestures are required. |
| 2.5.2 | Pointer Cancellation | Supports | All actions are triggered on click completion, not on press down. |
| 2.5.3 | Label in Name | Supports | Visible button labels match their accessible names. No discrepancy between visible text and ARIA labels. |
| 2.5.4 | Motion Actuation | Not Applicable | No device motion or sensor input is used. |
| 3.1.1 | Language of Page | Supports | Application is rendered in English. The lang attribute is set on the document element. |
| 3.2.1 | On Focus | Supports | No context changes occur on focus alone. |
| 3.2.2 | On Input | Supports | No unexpected context changes occur on input. |
| 3.3.1 | Error Identification | Supports | Login errors are displayed in a role="alert" region with descriptive text identifying the error. |
| 3.3.2 | Labels or Instructions | Supports | All form fields include visible labels. Required fields are marked with an asterisk and described in field instructions. |
| 4.1.1 | Parsing | Supports | Valid HTML structure used throughout. No duplicate IDs present. |
| 4.1.2 | Name, Role, Value | Supports | All interactive components include appropriate ARIA roles, names, and state values. Tabs use role="tab" with aria-selected. Sidebar uses aria-label="Sidebar navigation". Active route uses aria-current="page". |

---

## WCAG 2.1 Success Criteria — Level AA

| # | Criteria | Conformance Level | Remarks |
|---|----------|------------------|---------|
| 1.2.4 | Captions (Live) | Not Applicable | No live audio content. |
| 1.2.5 | Audio Description | Not Applicable | No video content. |
| 1.3.4 | Orientation | Supports | Application supports both landscape and portrait orientations without loss of content. |
| 1.3.5 | Identify Input Purpose | Supports | Login form inputs include autocomplete="email" and autocomplete="current-password" to support autofill. |
| 1.4.3 | Contrast Minimum | Supports | All text meets the 4.5:1 contrast ratio requirement. UI has been tested against WCAG contrast requirements. |
| 1.4.4 | Resize Text | Supports | Zoom level is configurable in Settings from 75% to 150%. Text reflows without loss of content or functionality. |
| 1.4.5 | Images of Text | Supports | No images of text are used. All text is rendered as live text. |
| 1.4.10 | Reflow | Supports | Content reflows at higher zoom levels without requiring horizontal scrolling. |
| 1.4.11 | Non-text Contrast | Supports | UI components including buttons, inputs, and focus indicators meet the 3:1 contrast ratio requirement. |
| 1.4.12 | Text Spacing | Supports | No loss of content or functionality occurs when text spacing is adjusted. |
| 1.4.13 | Content on Hover or Focus | Supports | No additional content appears on hover that cannot be dismissed or persisted by the user. |
| 2.4.5 | Multiple Ways | Supports | Caregivers can navigate via sidebar, keyboard shortcuts, and toolbar quick action buttons. |
| 2.4.6 | Headings and Labels | Supports | All pages include a descriptive h1 heading. All form fields have descriptive labels. |
| 2.4.7 | Focus Visible | Supports | Focus indicators are visible on all interactive elements including buttons, inputs, selects, checkboxes, and navigation items. |
| 3.1.2 | Language of Parts | Not Applicable | Application is English only with no foreign language passages. |
| 3.2.3 | Consistent Navigation | Supports | Sidebar navigation is consistent in position and order across all screens. |
| 3.2.4 | Consistent Identification | Supports | Icons and buttons are used consistently and identified consistently throughout the application. |
| 3.3.3 | Error Suggestion | Supports | Login error messages describe the problem and suggest corrective action to the caregiver. |
| 3.3.4 | Error Prevention | Supports | Confirmation is required before actions such as adding patients or creating tasks. Modal dialogs include Cancel options. |
| 4.1.3 | Status Messages | Supports | Toast notifications use role="status" and aria-live="polite" for non-disruptive announcements. Error messages use role="alert" and aria-live="assertive" for immediate announcement. |

---

## Known Limitations

1. VoiceOver announcement of toast notifications may vary depending on macOS version and VoiceOver verbosity settings.
2. The application is currently unsigned (no Apple notarization), which may trigger macOS security warnings on first launch for end users.
3. Screen reader announcement of dynamic tab content switching has been implemented via ARIA but behavior may vary across assistive technology versions.

---

## Legal Disclaimer

This VPAT was prepared by SWEN-661 Team 2 for academic purposes. The information provided reflects the current state of CareConnect Desktop version 0.1.0 as of March 2026. This document does not constitute a legal guarantee of accessibility compliance.

---