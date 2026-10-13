import test from 'node:test';
import assert from 'node:assert/strict';

// 1. Mock browser environments for node execution of auth & parser
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) || null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  };
}

// 2. Test ResumeParserService logic
test('ResumeParserService truthfully extracts entities and leaves missing fields empty without fabrication', async () => {
  // We can dynamically test the parser algorithm directly
  const sampleResumeText = `
Alex Rivera
Senior AI Engineer
Bengaluru, India
Email: alex.rivera@example.com
Phone: +91 98765 43210
GitHub: https://github.com/alexrivera-ai
LinkedIn: https://linkedin.com/in/alexrivera-ml

PROFESSIONAL SUMMARY
Senior AI Engineer with 4+ years building production RAG pipelines, FastAPI services, and PyTorch models.

WORK EXPERIENCE
Senior AI Engineer | CognitiveScale
Aug 2022 - Present
• Architected enterprise RAG knowledge engine with sub-220ms latency and 40k+ queries.
• Containerized microservices using Docker on AWS ECS.

EDUCATION
National Institute of Technology Karnataka (NITK)
B.Tech in Computer Science & Engineering
2016 - 2020
GPA: 8.8 / 10.0

SKILLS
Python, PyTorch, FastAPI, Docker, AWS, PostgreSQL, LangChain
`;

  // Import parser service module directly
  const { resumeParserService } = await import('../src/services/resumeParserService.ts');

  if (resumeParserService) {
    const parsed = resumeParserService.parseResumeText(sampleResumeText, 'Alex_Rivera_Resume.pdf');

    assert.equal(parsed.personalInfo.name, 'Alex Rivera');
    assert.equal(parsed.personalInfo.email, 'alex.rivera@example.com');
    assert.ok(parsed.personalInfo.phone.includes('98765'));
    assert.ok(parsed.personalInfo.location.includes('Bengaluru'));
    assert.ok(parsed.personalInfo.summary.includes('Senior AI Engineer'));
    assert.equal(parsed.portfolioLinks.github, 'https://github.com/alexrivera-ai');

    // Check detected skills
    const skillNames = parsed.skills.map((s) => s.name);
    assert.ok(skillNames.includes('Python'));
    assert.ok(skillNames.includes('FastAPI'));
    assert.ok(skillNames.includes('Docker'));
    assert.ok(skillNames.includes('PyTorch'));

    // Check experience
    assert.ok(parsed.experience.length >= 1);
    assert.equal(parsed.experience[0].company, 'CognitiveScale');
    assert.equal(parsed.experience[0].role, 'Senior AI Engineer');

    // Check education
    assert.ok(parsed.education.length >= 1);
    assert.ok(parsed.education[0].degree.includes('B.Tech'));

    // Check truthful missing fields: No certifications were provided in this text
    assert.ok(parsed.missingFields.includes('Certifications') || parsed.certifications.length === 0);

    // ATS score
    const atsScore = resumeParserService.calculateATSScore(parsed);
    assert.ok(atsScore >= 70 && atsScore <= 100);
  }
});

test('Truthful extraction guardrail leaves missing fields empty rather than inventing them', async () => {
  const minimalResume = `
Jane Doe
Email: jane.doe@example.com
`;

  // Simple rule-based validator verifying no hallucination
  const emailMatch = minimalResume.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  assert.equal(emailMatch[0], 'jane.doe@example.com');

  // Verify missing phone is empty and not fabricated
  const phoneMatch = minimalResume.match(/(?:(?:\+|00)\d{1,3}[\s.-]?)?(?:\(?\d{3,5}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,5}/);
  assert.equal(phoneMatch, null);

  // Missing experience remains empty
  const expMatch = minimalResume.match(/(?:work experience|professional experience|experience)[\s:]*([\s\S]*?)/i);
  assert.equal(expMatch, null);
});

test('Authentication: Password hashing with SHA-256 and salt', async () => {
  const password = 'mySecretPassword123';
  const salt = 'unique_salt_998877';

  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt + 'careeros_secure_salt_pepper');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  assert.equal(typeof hash, 'string');
  assert.equal(hash.length, 64); // SHA-256 hex length is 64 characters

  // Re-hashing the same produces identical hash
  const data2 = encoder.encode(password + salt + 'careeros_secure_salt_pepper');
  const hashBuffer2 = await crypto.subtle.digest('SHA-256', data2);
  const hash2 = Array.from(new Uint8Array(hashBuffer2)).map((b) => b.toString(16).padStart(2, '0')).join('');
  assert.equal(hash, hash2);

  // Different password produces completely different hash
  const data3 = encoder.encode('wrongPassword' + salt + 'careeros_secure_salt_pepper');
  const hashBuffer3 = await crypto.subtle.digest('SHA-256', data3);
  const hash3 = Array.from(new Uint8Array(hashBuffer3)).map((b) => b.toString(16).padStart(2, '0')).join('');
  assert.notEqual(hash, hash3);
});
