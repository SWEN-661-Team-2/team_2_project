import React, { useState, useEffect, useRef } from "react";

const NewAppointmentModal = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        time: "",
        patient: "",
        duration: "",
        type: "",
        status: "scheduled"
    });

    const [errors, setErrors] = useState({});

    const modalRef = useRef(null);
    const firstInputRef = useRef(null);

    useEffect(() => {
        firstInputRef.current?.focus();

        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();

            if (e.key === "Tab") {
                const focusable = modalRef.current.querySelectorAll(
                    "input, select, button"
                );
                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.time) newErrors.time = "Time is required.";
        if (!formData.duration) newErrors.duration = "Duration is required.";
        if (!formData.patient.trim()) newErrors.patient = "Patient name is required.";
        if (!formData.type) newErrors.type = "Appointment type is required.";
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        onSave(formData);
        onClose();
    };

    return (
        <div className="modal-overlay" role="presentation">
            <div
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="appt-title"
                ref={modalRef}
            >
                <div className="modal-header">
                    <div>
                        <h2 id="appt-title" className="page-title">New Appointment</h2>
                        <div className="modal-subtitle">Schedule care for a patient</div>
                    </div>
                    <button
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="modal-body">

                        {/* Time + Duration Row */}
                        <div className="field-row">
                            <div className="field">
                                <label htmlFor="time" className="label">Time</label>
                                <select
                                    id="time"
                                    name="time"
                                    className="input"
                                    value={formData.time}
                                    onChange={handleChange}
                                    ref={firstInputRef}
                                    aria-invalid={!!errors.time}
                                    aria-describedby={errors.time ? "time-error" : undefined}
                                >
                                    <option value="">Select</option>
                                    {[
                                        "08:00 AM","08:30 AM","09:00 AM","09:30 AM",
                                        "10:00 AM","10:30 AM","11:00 AM","11:30 AM",
                                        "12:00 PM","12:30 PM","01:00 PM","01:30 PM",
                                        "02:00 PM","02:30 PM","03:00 PM","03:30 PM",
                                        "04:00 PM","04:30 PM","05:00 PM"
                                    ].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                {errors.time && <span id="time-error" className="error">{errors.time}</span>}
                            </div>

                            <div className="field">
                                <label htmlFor="duration" className="label">Duration</label>
                                <select
                                    id="duration"
                                    name="duration"
                                    className="input"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    aria-invalid={!!errors.duration}
                                    aria-describedby={errors.duration ? "duration-error" : undefined}
                                >
                                    <option value="">Select</option>
                                    <option value="15">15 minutes</option>
                                    <option value="30">30 minutes</option>
                                    <option value="45">45 minutes</option>
                                    <option value="60">1 hour</option>
                                </select>
                                {errors.duration && <span id="duration-error" className="error">{errors.duration}</span>}
                            </div>
                        </div>

                        {/* Patient */}
                        <div className="field">
                            <label htmlFor="patient" className="label">Patient Name</label>
                            <input
                                id="patient"
                                name="patient"
                                className="input"
                                value={formData.patient}
                                onChange={handleChange}
                                aria-invalid={!!errors.patient}
                                aria-describedby={errors.patient ? "patient-error" : undefined}
                            />
                            {errors.patient && <span id="patient-error" className="error">{errors.patient}</span>}
                        </div>

                        {/* Appointment Type */}
                        <div className="field">
                            <label htmlFor="type" className="label">Appointment Type</label>
                            <select
                                id="type"
                                name="type"
                                className="input"
                                value={formData.type}
                                onChange={handleChange}
                                aria-invalid={!!errors.type}
                                aria-describedby={errors.type ? "type-error" : undefined}
                            >
                                <option value="">Select</option>
                                <option value="Medication Round">Medication Round</option>
                                <option value="Consultation">Consultation</option>
                                <option value="Check-up">Check-up</option>
                                <option value="Therapy">Therapy</option>
                            </select>
                            {errors.type && <span id="type-error" className="error">{errors.type}</span>}
                        </div>

                        {/* Status */}
                        <div className="field">
                            <label htmlFor="status" className="label">Status</label>
                            <select
                                id="status"
                                name="status"
                                className="input"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="scheduled">Scheduled</option>
                                <option value="completed">Completed</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn primary">Save Appointment</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewAppointmentModal;