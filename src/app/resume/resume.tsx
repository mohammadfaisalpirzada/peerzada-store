"use client";

import React, { useState } from "react";
import styles from "./Resume.module.css";
import Image from "next/image";

const Resume: React.FC = () => {
  const [showSkills, setShowSkills] = useState(true);

  return (
    <div className={styles.resumeContainer}>
      {/* Personal Information */}
      <section className={styles.personalInfo}>
        <Image
          src="/profile-picture.jpg"
          alt="Muhammad Faisal Peerzada"
          width={140}
          height={140}
          className={styles.profilePic}
        />
        <div className={styles.contactInfo}>
          <h1 className={styles.heading1}>Muhammad Faisal Peerzada</h1>
          <div className={styles.contactDetails}>
            <span className={styles.contactItem}>📍 Saddar, Karachi, Pakistan</span>
            <span className={styles.contactItem}>📞 +92 345 8340669</span>
            <span className={styles.contactItem}>✉️ mohammadfaisalpirzada@gmail.com</span>
          </div>
        </div>
      </section>

      {/* Professional Summary */}
      <section className={styles.section}>
        <h2 className={styles.heading2}>Professional Summary</h2>
        <p className={styles.summaryText}>
          Passionate and experienced **education professional** with over{" "}
          <span className={styles.boldText}>20 years</span> of expertise in{" "}
          <span className={styles.boldText}>Mathematics and Physics</span> instruction,
          <span className={styles.boldText}> curriculum development, and department management</span>. A
          <span className={styles.boldText}> tech-savvy leader</span> who seamlessly integrates digital tools into education, enhancing learning experiences.
        </p>
      </section>

      {/* Education Section */}
      <section className={styles.section}>
        <h2 className={styles.heading2}>Education</h2>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <span className={styles.boldText}>Master of Arts</span> in Distance & Formal Education – <i>Allama Iqbal Open University</i>
          </li>
          <li className={styles.listItem}>
            <span className={styles.boldText}>Bachelor of Education (B.Ed.)</span> – <i>University of Karachi</i>
          </li>
          <li className={styles.listItem}>
            <span className={styles.boldText}>Bachelor of Arts (B.A.)</span> – <i>University of Karachi</i>
          </li>
          <li className={styles.listItem}>
            <span className={styles.boldText}>Higher Secondary Certificate (Pre-Engineering)</span> – <i>Board of Intermediate Education Karachi</i>
          </li>
          <li className={styles.listItem}>
            <span className={styles.boldText}>Secondary School Certificate (Computer Science)</span> – <i>Board of Secondary Education Karachi</i>
          </li>
        </ul>
      </section>

      {/* Work Experience Section */}
      <section className={styles.section}>
        <h2 className={styles.heading2}>Professional Experience</h2>

        <div>
          <h3 className={styles.jobTitle}>Head of Department (Secondary) – Peace International School</h3>
          <p className={styles.jobPeriod}>(Present)</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Lead and manage the <span className={styles.boldText}>Secondary Department</span>, ensuring academic excellence.</li>
            <li className={styles.listItem}>Oversee <span className={styles.boldText}>curriculum planning</span> and teacher coordination.</li>
            <li className={styles.listItem}>Implement <span className={styles.boldText}>technology-driven solutions</span> for online learning.</li>
          </ul>
        </div>

        <div>
          <h3 className={styles.jobTitle}>Mathematics Teacher – Government Girls Secondary School, Nishtar Road</h3>
          <p className={styles.jobPeriod}>(Since 2008 – Present)</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>Teach <span className={styles.boldText}>Mathematics</span> to secondary-level students.</li>
            <li className={styles.listItem}>Use <span className={styles.boldText}>interactive learning methods</span> for better concept clarity.</li>
          </ul>
        </div>
      </section>

      {/* Technical & Digital Skills */}
      <section className={styles.section}>
        <h2 className={styles.heading2}>Technical & Digital Skills</h2>
        <button className={styles.toggleButton} onClick={() => setShowSkills(!showSkills)}>
          {showSkills ? "Hide" : "Show"} Skills
        </button>

        {showSkills && (
          <div className={styles.skillsContainer}>
            <div className={styles.skillCategory}>
              <h3 className={styles.skillCategoryTitle}>Educational Technology & Digital Tools</h3>
              <ul className={styles.list}>
                <li className={styles.listItem}>Microsoft Office (Word, Excel, PowerPoint, Visio)</li>
                <li className={styles.listItem}>Adobe Photoshop, Illustrator, InDesign</li>
                <li className={styles.listItem}>Canva & Online Learning Platforms</li>
                <li className={styles.listItem}>Programming: Next.js, TypeScript, Python</li>
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* Interests */}
      <section className={styles.section}>
        <h2 className={styles.heading2}>Interests</h2>
        <div className={styles.interestsContainer}>
          <span className={styles.interestItem}>📷 Photography</span>
          <span className={styles.interestItem}>🌱 Gardening</span>
          <span className={styles.interestItem}>💻 Learning New Tech</span>
          <span className={styles.interestItem}>🗺️ Travel & Exploration</span>
        </div>
      </section>

      {/* Why Choose Me */}
      <section className={styles.section}>
        <h2 className={styles.heading2}>Why Choose Me?</h2>
        <div className={styles.whyChooseMeList}>
          <div className={styles.whyChooseMeItem}>✅ 20+ years of Mathematics & Physics teaching</div>
          <div className={styles.whyChooseMeItem}>✅ Expert in Digital Learning & Tech</div>
          <div className={styles.whyChooseMeItem}>✅ Strong Curriculum Development Skills</div>
        </div>
      </section>
    </div>
  );
};

export default Resume;
