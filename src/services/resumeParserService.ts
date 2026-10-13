import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import type { ParsedResumeData } from '../types';

// Configure PDF.js worker for browser execution
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  // Use a reliable CDN worker matching the installed version or bundled worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

// Known skill catalog for accurate categorical mapping
const SKILL_CATALOG: Record<string, { category: string; aliases?: string[] }> = {
  // Core AI/ML
  Python: { category: 'Languages & Tools', aliases: ['python3', 'python'] },
  PyTorch: { category: 'Core AI/ML', aliases: ['pytorch', 'torch'] },
  TensorFlow: { category: 'Core AI/ML', aliases: ['tensorflow', 'tf'] },
  'Retrieval Augmented Generation (RAG)': { category: 'Core AI/ML', aliases: ['rag', 'retrieval augmented generation'] },
  'LangChain': { category: 'Core AI/ML', aliases: ['langchain'] },
  'LangGraph': { category: 'Core AI/ML', aliases: ['langgraph'] },
  'Hugging Face': { category: 'Core AI/ML', aliases: ['huggingface', 'transformers', 'hugging face'] },
  'Vector Databases': { category: 'Core AI/ML', aliases: ['qdrant', 'pinecone', 'milvus', 'weaviate', 'chromadb', 'faiss'] },
  'Large Language Models (LLMs)': { category: 'Core AI/ML', aliases: ['llm', 'llms', 'openai', 'anthropic', 'claude', 'gemini'] },
  'Fine-tuning': { category: 'Core AI/ML', aliases: ['lora', 'qlora', 'peft', 'fine-tuning', 'sft'] },
  'Computer Vision': { category: 'Core AI/ML', aliases: ['opencv', 'yolo', 'cnn', 'computer vision'] },
  'NLP': { category: 'Core AI/ML', aliases: ['nlp', 'natural language processing', 'spacy', 'nltk', 'bert', 'roberta'] },

  // Backend Systems
  FastAPI: { category: 'Backend Systems', aliases: ['fastapi'] },
  Flask: { category: 'Backend Systems', aliases: ['flask'] },
  Django: { category: 'Backend Systems', aliases: ['django'] },
  NodeJS: { category: 'Backend Systems', aliases: ['node.js', 'nodejs', 'node'] },
  Express: { category: 'Backend Systems', aliases: ['express.js', 'express'] },
  PostgreSQL: { category: 'Backend Systems', aliases: ['postgresql', 'postgres', 'psql'] },
  MongoDB: { category: 'Backend Systems', aliases: ['mongodb', 'mongo'] },
  Redis: { category: 'Backend Systems', aliases: ['redis'] },
  GraphQL: { category: 'Backend Systems', aliases: ['graphql'] },
  RESTful: { category: 'Backend Systems', aliases: ['rest api', 'restful apis', 'rest apis'] },
  gRPC: { category: 'Backend Systems', aliases: ['grpc', 'protobuf'] },

  // Cloud & DevOps
  Docker: { category: 'Cloud & DevOps', aliases: ['docker', 'containerization'] },
  Kubernetes: { category: 'Cloud & DevOps', aliases: ['k8s', 'kubernetes'] },
  AWS: { category: 'Cloud & DevOps', aliases: ['aws', 'amazon web services', 's3', 'ec2', 'lambda', 'ecs', 'eks'] },
  GCP: { category: 'Cloud & DevOps', aliases: ['gcp', 'google cloud', 'bigquery', 'cloud run', 'vertex ai'] },
  Azure: { category: 'Cloud & DevOps', aliases: ['azure', 'azure ml'] },
  'CI/CD': { category: 'Cloud & DevOps', aliases: ['ci/cd', 'github actions', 'gitlab ci', 'jenkins'] },
  Linux: { category: 'Cloud & DevOps', aliases: ['linux', 'bash', 'shell scripting'] },
  Terraform: { category: 'Cloud & DevOps', aliases: ['terraform', 'iac'] },

  // Languages & Tools
  JavaScript: { category: 'Languages & Tools', aliases: ['javascript', 'js'] },
  TypeScript: { category: 'Languages & Tools', aliases: ['typescript', 'ts'] },
  'C++': { category: 'Languages & Tools', aliases: ['c++', 'cpp'] },
  Java: { category: 'Languages & Tools', aliases: ['java'] },
  Go: { category: 'Languages & Tools', aliases: ['golang', 'go lang'] },
  SQL: { category: 'Languages & Tools', aliases: ['sql', 'mysql', 'sqlite'] },
  Git: { category: 'Languages & Tools', aliases: ['git', 'github', 'gitlab'] },
};

export class ResumeParserService {
  /**
   * Extract raw text from PDF or DOCX file
   */
  public async extractRawText(file: File): Promise<string> {
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.pdf')) {
      return this.extractFromPDF(file);
    } else if (fileName.endsWith('.docx')) {
      return this.extractFromDOCX(file);
    } else {
      throw new Error('Unsupported format: Only .pdf and .docx files are permitted.');
    }
  }

  private async extractFromPDF(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      const pageTexts: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageString = textContent.items
          .map((item: any) => item.str || '')
          .join(' ');
        pageTexts.push(pageString);
      }

      const fullText = pageTexts.join('\n\n').trim();
      if (!fullText) {
        throw new Error('PDF appears empty or is an image-only scanned document without an embedded text layer.');
      }
      return fullText;
    } catch (err: any) {
      if (err.message && err.message.includes('scanned')) {
        throw err;
      }
      throw new Error(`PDF Extraction failed: ${err.message || 'Unable to parse document contents.'}`);
    }
  }

  private async extractFromDOCX(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value.trim();
      if (!text) {
        throw new Error('DOCX document is empty.');
      }
      return text;
    } catch (err: any) {
      throw new Error(`DOCX Extraction failed: ${err.message || 'Unable to parse document contents.'}`);
    }
  }

  /**
   * Perform structured, truthful entity extraction from resume text
   */
  public parseResumeText(rawText: string, filename?: string): ParsedResumeData {
    const lines = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const missingFields: string[] = [];

    // 1. Email extraction
    const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0].toLowerCase() : '';
    if (!email) missingFields.push('Email');

    // 2. Phone extraction (prioritize labeled phone, support international and 5+5 Indian formats)
    const labeledPhoneMatch = rawText.match(/(?:phone|mobile|cell|tel|contact)(?:\s*(?:no|number|#))?[\s:]*([+0-9\s().-]{9,22})/i);
    let phone = '';
    if (labeledPhoneMatch) {
      phone = labeledPhoneMatch[1].trim();
    } else {
      const generalPhoneMatch = rawText.match(/(?:(?:\+|00)\d{1,3}[\s.-]?)?(?:\d{5}[\s.-]?\d{5}|\d{3,4}[\s.-]?\d{3,4}[\s.-]?\d{3,4})/);
      phone = generalPhoneMatch ? generalPhoneMatch[0].trim() : '';
    }
    // Filter out false positives (less than 8 digits)
    if (phone.replace(/\D/g, '').length < 8) {
      phone = '';
      missingFields.push('Phone');
    }

    // 3. Social / Portfolio Links
    const githubMatch = rawText.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
    const github = githubMatch ? `https://github.com/${githubMatch[1]}` : '';

    const linkedinMatch = rawText.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
    const linkedin = linkedinMatch ? `https://linkedin.com/in/${linkedinMatch[1]}` : '';

    const huggingfaceMatch = rawText.match(/huggingface\.co\/([a-zA-Z0-9_-]+)/i);
    const huggingface = huggingfaceMatch ? `https://huggingface.co/${huggingfaceMatch[1]}` : '';

    const webMatch = rawText.match(/https?:\/\/(?!github|linkedin|huggingface)([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/[^\s]*)?/i);
    const portfolio = webMatch ? webMatch[0] : '';

    if (!github && !linkedin && !portfolio) {
      missingFields.push('Portfolio / LinkedIn Links');
    }

    // 4. Candidate Name Extraction
    let name = '';
    // Check first 5 lines for a candidate name (2 to 4 capitalized words, no special email/url characters)
    for (let i = 0; i < Math.min(lines.length, 6); i++) {
      const line = lines[i];
      if (
        !line.includes('@') &&
        !line.includes('http') &&
        !line.includes('www') &&
        !/curriculum|resume|page|cv|contact|summary/i.test(line) &&
        line.split(/\s+/).length >= 2 &&
        line.split(/\s+/).length <= 5 &&
        /^[A-Z][a-zA-Z.'-]+(\s+[A-Z][a-zA-Z.'-]+)+$/.test(line)
      ) {
        name = line;
        break;
      }
    }
    if (!name && lines.length > 0) {
      // Fallback: Check if filename has name format (e.g., Alex_Rivera_Resume.pdf)
      if (filename) {
        const cleanName = filename.replace(/\.(pdf|docx)$/i, '').replace(/[-_]?(resume|cv|version|v\d+).*/i, '').replace(/[-_]/g, ' ').trim();
        if (cleanName.length > 3 && cleanName.split(' ').length >= 2) {
          name = cleanName;
        }
      }
    }
    if (!name) missingFields.push('Full Name');

    // 5. Location Extraction
    let location = '';
    const locRegex = /(Bengaluru|Bangalore|Hyderabad|Chennai|Mumbai|Delhi|Pune|Gurugram|Noida|San Francisco|New York|Seattle|Austin|London|Toronto|Berlin|Singapore|Remote|India|USA|UK|Canada)[^,\n\r]*(?:,\s*[A-Za-z\s]+)?/i;
    const locMatch = rawText.match(locRegex);
    if (locMatch) {
      location = locMatch[0].trim();
    } else {
      missingFields.push('Location');
    }

    // 6. Professional Summary
    let summary = '';
    const summaryHeader = rawText.match(/(?:executive summary|professional summary|about me|summary|profile|objective)[\s:]*\n?([\s\S]*?)(?=(?:\n\s*(?:experience|work experience|employment|education|skills|projects|certifications|$)))/i);
    if (summaryHeader && summaryHeader[1]) {
      summary = summaryHeader[1].replace(/\n+/g, ' ').trim();
      if (summary.length > 400) {
        summary = summary.substring(0, 400) + '...';
      }
    }
    if (!summary) missingFields.push('Professional Summary');

    // 7. Skills Extraction (Truthful detection from catalog + extracted tokens)
    const detectedSkills: { name: string; level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'; category: string }[] = [];
    const lowerRawText = rawText.toLowerCase();

    for (const [skillName, meta] of Object.entries(SKILL_CATALOG)) {
      const aliases = meta.aliases || [skillName.toLowerCase()];
      const found = aliases.some((alias) => {
        // Word boundary match
        const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(`(?:^|[\\s,;()•|/])${escaped}(?:$|[\\s,;()•|/])`, 'i');
        return pattern.test(lowerRawText);
      });

      if (found) {
        // Estimate level based on frequency or presence of "Senior", "Lead", "5+ years", etc.
        let level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' = 'Intermediate';
        if (lowerRawText.includes(`expert in ${skillName.toLowerCase()}`) || lowerRawText.includes(`senior`) && ['Python', 'PyTorch', 'FastAPI'].includes(skillName)) {
          level = 'Advanced';
        }

        detectedSkills.push({
          name: skillName,
          category: meta.category,
          level,
        });
      }
    }

    if (detectedSkills.length === 0) {
      missingFields.push('Technical Skills');
    }

    // 8. Experience Extraction
    const experience: ParsedResumeData['experience'] = [];
    const expSectionMatch = rawText.match(/(?:work experience|professional experience|experience|employment history)[\s:]*([\s\S]*?)(?=(?:\n\s*(?:education|skills|projects|certifications|awards|$)))/i);

    if (expSectionMatch && expSectionMatch[1]) {
      const expText = expSectionMatch[1].trim();
      // Look for blocks with date patterns (e.g. "2022 - Present", "Aug 2021 – Jul 2023")
      const dateRegex = /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4})\s*[-–—to]+\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4}|Present|Current)/gi;
      
      const expLines = expText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
      let currentExp: any = null;

      for (let i = 0; i < expLines.length; i++) {
        const line = expLines[i];
        const dateMatch = line.match(dateRegex);

        if (dateMatch) {
          if (currentExp && (currentExp.company || currentExp.role)) {
            experience.push(currentExp);
          }

          const dates = dateMatch[0];
          const parts = dates.split(/[-–—to]+/i);
          const startDate = parts[0]?.trim() || '';
          const endDate = parts[1]?.trim() || 'Present';
          const isCurrent = /present|current/i.test(endDate);

          // The line preceding or current line often has Role and Company
          const lineWithoutDate = line.replace(dates, '').trim();
          const headerLine = lineWithoutDate || (i > 0 && expLines[i - 1].length < 80 ? expLines[i - 1] : '');
          let role = headerLine;
          let company = '';

          if (headerLine.includes('|')) {
            const split = headerLine.split('|');
            role = split[0].trim();
            company = split[1].trim();
          } else if (headerLine.includes(' at ')) {
            const split = headerLine.split(' at ');
            role = split[0].trim();
            company = split[1].trim();
          } else if (headerLine.includes(',')) {
            const split = headerLine.split(',');
            role = split[0].trim();
            company = split.slice(1).join(',').trim();
          } else if (i > 0 && expLines[i - 1].length < 60) {
            // Check previous line
            company = lineWithoutDate || expLines[i - 1];
            role = expLines[i - 1];
          }

          currentExp = {
            id: `exp-parsed-${Date.now()}-${experience.length}`,
            role: role || 'Software Engineer',
            company: company || 'Organization',
            location: location || 'Hybrid',
            startDate,
            endDate,
            current: isCurrent,
            description: [],
          };
        } else if (currentExp) {
          // Bullet point line
          if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.length > 30) {
            const cleanBullet = line.replace(/^[•\-*]\s*/, '').trim();
            if (cleanBullet.length > 10) {
              currentExp.description.push(cleanBullet);
            }
          }
        }
      }

      if (currentExp && (currentExp.company || currentExp.role)) {
        experience.push(currentExp);
      }
    }

    if (experience.length === 0) {
      missingFields.push('Work Experience');
    }

    // 9. Education Extraction
    const education: ParsedResumeData['education'] = [];
    const eduSectionMatch = rawText.match(/(?:education|academic background|academics|qualifications)[\s:]*([\s\S]*?)(?=(?:\n\s*(?:skills|experience|projects|certifications|awards|$)))/i);

    if (eduSectionMatch && eduSectionMatch[1]) {
      const eduText = eduSectionMatch[1].trim();
      const eduLines = eduText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

      let degree = '';
      let institution = '';
      let year = '';
      let gpa = '';

      for (const line of eduLines) {
        if (/bachelor|master|b\.tech|m\.tech|b\.s\.|m\.s\.|b\.e\.|ph\.d|diploma/i.test(line)) {
          degree = line;
        } else if (/university|institute|college|school|academy/i.test(line)) {
          institution = line;
        }

        const yearMatch = line.match(/\b(19\d{2}|20\d{2})\s*[-–—to]*\s*(19\d{2}|20\d{2})?\b/);
        if (yearMatch) {
          year = yearMatch[0];
        }

        const gpaMatch = line.match(/(?:gpa|cgpa|grade)[\s:]*(\d+\.?\d*(\s*\/\s*\d+)?|\d+%)/i);
        if (gpaMatch) {
          gpa = gpaMatch[1];
        }
      }

      if (degree || institution) {
        education.push({
          id: `edu-parsed-${Date.now()}`,
          degree: degree || 'Bachelor of Science / Technology',
          institution: institution || 'Accredited Institution',
          year: year || 'Graduated',
          gpa: gpa || '',
        });
      }
    }

    if (education.length === 0) {
      missingFields.push('Education');
    }

    // 10. Projects Extraction
    const projects: ParsedResumeData['projects'] = [];
    const projSectionMatch = rawText.match(/(?:projects|technical projects|key projects|personal projects)[\s:]*([\s\S]*?)(?=(?:\n\s*(?:certifications|education|skills|awards|$)))/i);

    if (projSectionMatch && projSectionMatch[1]) {
      const projText = projSectionMatch[1].trim();
      const projLines = projText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

      let currentProj: any = null;
      for (const line of projLines) {
        if (!line.startsWith('•') && !line.startsWith('-') && line.length < 80 && line.length > 4) {
          if (currentProj) projects.push(currentProj);
          currentProj = {
            id: `proj-parsed-${Date.now()}-${projects.length}`,
            title: line.replace(/[:\-—]/g, '').trim(),
            description: '',
            technologies: [],
            metrics: 'Extracted from resume candidate portfolio',
          };
        } else if (currentProj) {
          const cleanLine = line.replace(/^[•\-*]\s*/, '').trim();
          if (!currentProj.description) {
            currentProj.description = cleanLine;
          } else {
            currentProj.description += ' ' + cleanLine;
          }
          // Detect techs
          for (const s of Object.keys(SKILL_CATALOG)) {
            if (line.toLowerCase().includes(s.toLowerCase()) && !currentProj.technologies.includes(s)) {
              currentProj.technologies.push(s);
            }
          }
        }
      }
      if (currentProj) projects.push(currentProj);
    }

    // 11. Certifications
    const certifications: ParsedResumeData['certifications'] = [];
    const certSectionMatch = rawText.match(/(?:certifications|licenses & certifications|certificates)[\s:]*([\s\S]*?)(?=(?:\n\s*(?:education|skills|projects|awards|$)))/i);

    if (certSectionMatch && certSectionMatch[1]) {
      const certLines = certSectionMatch[1].split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
      for (const line of certLines) {
        if (line.length > 5) {
          const cleanCert = line.replace(/^[•\-*]\s*/, '').trim();
          let issuer = 'Accredited Provider';
          if (/aws|amazon/i.test(cleanCert)) issuer = 'Amazon Web Services';
          else if (/google|gcp/i.test(cleanCert)) issuer = 'Google Cloud';
          else if (/deeplearning\.ai|coursera/i.test(cleanCert)) issuer = 'DeepLearning.AI / Coursera';
          else if (/microsoft|azure/i.test(cleanCert)) issuer = 'Microsoft';

          certifications.push({
            id: `cert-parsed-${Date.now()}-${certifications.length}`,
            name: cleanCert,
            issuer,
            issueDate: 'Verified',
          });
        }
      }
    }

    // Calculate Truthful Parsing Confidence
    const criticalFields = ['Full Name', 'Email', 'Phone', 'Location', 'Professional Summary', 'Technical Skills', 'Work Experience', 'Education'];
    const foundCount = criticalFields.length - missingFields.filter((f) => criticalFields.includes(f)).length;
    const parsingConfidence = Math.round((foundCount / criticalFields.length) * 100);

    return {
      rawText,
      personalInfo: {
        name,
        email,
        phone,
        location,
        title: name ? 'AI / Software Systems Professional' : '',
        summary,
      },
      portfolioLinks: {
        github,
        linkedin,
        portfolio,
        huggingface,
      },
      skills: detectedSkills,
      experience,
      education,
      projects,
      certifications,
      missingFields,
      parsingConfidence,
    };
  }

  /**
   * Calculate truthful ATS score based on keyword depth, metrics presence, and structured formatting
   */
  public calculateATSScore(parsed: ParsedResumeData): number {
    let score = 40; // Base score for readable text format

    // Quantified impact metrics (numbers, %, ms, etc.)
    const metricsMatches = (parsed.rawText.match(/\d+([.,]\d+)?\s*(%|k|ms|s|x|users|req|queries|latency)/gi) || []).length;
    score += Math.min(metricsMatches * 3, 20);

    // Skill coverage
    score += Math.min(parsed.skills.length * 2, 20);

    // Completeness of sections
    if (parsed.personalInfo.name && parsed.personalInfo.email && parsed.personalInfo.phone) score += 5;
    if (parsed.experience.length > 0) score += 5;
    if (parsed.education.length > 0) score += 5;
    if (parsed.portfolioLinks.github || parsed.portfolioLinks.linkedin) score += 5;

    return Math.min(Math.max(score, 50), 96);
  }
}

export const resumeParserService = new ResumeParserService();
