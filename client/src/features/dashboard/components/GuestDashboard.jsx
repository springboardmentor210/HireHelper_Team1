import { useEffect, useState } from "react";

import GuestNavbar from "./GuestNavbar";

import "../styles/GuestDashboard.css";

import { guestData } from "../data/dashboardData";
import { getPublicStats } from "../services/publicDashboard.service";

import {
  FaCheckCircle,
  FaShieldAlt,
  FaStar,
  FaArrowRight,
  FaHandshake,
} from "react-icons/fa";

import {
  FiClipboard,
  FiUsers,
  FiCheckSquare,
} from "react-icons/fi";

export default function GuestDashboard() {
  const [stats, setStats] = useState({
    registeredUsers: 0,
    totalTasks: 0,
    activeTasks: 0,
    completedTasks: 0,
  });

  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const response = await getPublicStats();

        setStats(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch public dashboard statistics:",
          error
        );
      } finally {
        setStatsLoading(false);
      }
    };

    fetchPublicStats();
  }, []);

  return (
    <div className="guest-dashboard">
      <GuestNavbar />

      {/* ================= Hero ================= */}

      <section className="guest-hero">
        <div className="hero-left">
          <h1>{guestData.hero.title}</h1>

          <p>{guestData.hero.subtitle}</p>

          <div className="guest-buttons">
            <button
              type="button"
              className="primary-btn"
            >
              Find Tasks
              <FaArrowRight />
            </button>

            <button
              type="button"
              className="secondary-btn"
            >
              Become a Helper
            </button>
          </div>

          <div className="hero-features">
            <div className="feature-item">
              <FaCheckCircle />
              <span>Trusted Helpers</span>
            </div>

            <div className="feature-item">
              <FaShieldAlt />
              <span>Secure Payments</span>
            </div>

            <div className="feature-item">
              <FaStar />
              <span>Ratings & Reviews</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <img
            src="/hero1.jpg"
            alt="Task assistance"
          />

          <img
            src="/hero2.jpg"
            alt="Home assistance"
          />

          <img
            src="/hero3.jpg"
            alt="Professional assistance"
          />

          <img
            src="/hero4.jpg"
            alt="Community assistance"
          />
        </div>
      </section>

      {/* ================= How It Works ================= */}

      <section
        id="how-it-works"
        className="how-it-works"
      >
        <h2>How It Works</h2>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-icon">
              <FiClipboard />
            </div>

            <div>
              <h3>Post a Task</h3>

              <p>
                Tell us what you need in just a few simple
                steps.
              </p>
            </div>
          </div>

          <div className="step-card">
            <div className="step-icon">
              <FiUsers />
            </div>

            <div>
              <h3>Get Matched</h3>

              <p>
                Helpers near you discover your task and send
                offers.
              </p>
            </div>
          </div>

          <div className="step-card">
            <div className="step-icon">
              <FaHandshake />
            </div>

            <div>
              <h3>Choose & Connect</h3>

              <p>
                Review profiles and hire the right helper.
              </p>
            </div>
          </div>

          <div className="step-card">
            <div className="step-icon">
              <FiCheckSquare />
            </div>

            <div>
              <h3>Task Completed</h3>

              <p>
                Complete payment securely after the work is
                done.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Safety ================= */}

      <section className="safety-banner">
        <div className="banner-left">
          <FaShieldAlt className="banner-icon" />

          <div>
            <h3>Safe. Simple. Reliable.</h3>

            <p>
              Your safety and satisfaction are our top
              priorities.
            </p>
          </div>
        </div>

        <span className="learn-more">
          Learn more about safety →
        </span>
      </section>

      {/* ================= Dynamic Statistics ================= */}

      <section className="guest-stats">
        <div className="guest-stat-card">
          <h2>
            {statsLoading ? "..." : stats.registeredUsers}
          </h2>
          <p>Registered Users</p>
        </div>

        <div className="guest-stat-card">
          <h2>
            {statsLoading ? "..." : stats.totalTasks}
          </h2>
          <p>Tasks Posted</p>
        </div>

        <div className="guest-stat-card">
          <h2>
            {statsLoading ? "..." : stats.activeTasks}
          </h2>
          <p>Active Tasks</p>
        </div>

        <div className="guest-stat-card">
          <h2>
            {statsLoading ? "..." : stats.completedTasks}
          </h2>
          <p>Tasks Completed</p>
        </div>
      </section>
    </div>
  );
}