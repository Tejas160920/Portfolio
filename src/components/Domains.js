import React from 'react';
import { Code, Globe, Database, Cpu, Server, Sparkles } from 'lucide-react';
import './Domains.css';
import Reveal from './Reveal';
import { useTilt } from '../hooks/useMagnetic';

const domains = [
  {
    icon: Cpu,
    name: 'AI & Machine Learning',
    description:
      'LLMs, RAG pipelines, model serving with vLLM and Triton, and the infrastructure that keeps them fast.',
    tags: ['LLMs', 'RAG', 'PyTorch', 'vLLM'],
    span: 'wide',
    accent: 'var(--accent-green)'
  },
  {
    icon: Server,
    name: 'Cloud & Infrastructure',
    description: 'AWS, Kubernetes, Terraform, and CI/CD that ships without drama.',
    tags: ['AWS', 'K8s', 'Terraform'],
    span: 'tall',
    accent: 'var(--accent-cyan)'
  },
  {
    icon: Code,
    name: 'Backend Engineering',
    description: 'Java, Spring Boot, FastAPI. Microservices that hold up under load.',
    tags: ['Java', 'Spring', 'FastAPI'],
    span: 'normal',
    accent: 'var(--accent-violet)'
  },
  {
    icon: Globe,
    name: 'Full Stack',
    description: 'React and Node on top, typed all the way down.',
    tags: ['React', 'Node.js'],
    span: 'normal',
    accent: 'var(--accent-pink)'
  },
  {
    icon: Database,
    name: 'Data',
    description:
      'PostgreSQL, MongoDB, DynamoDB, Redis. Modelling, indexing, and query tuning.',
    tags: ['PostgreSQL', 'Redis', 'DynamoDB'],
    span: 'wide',
    accent: 'var(--accent-yellow)'
  }
];

const DomainCard = ({ domain, index }) => {
  const tiltRef = useTilt({ max: 6 });
  const Icon = domain.icon;

  return (
    <Reveal
      animation="up"
      delay={index * 90}
      className={`domain-card span-${domain.span}`}
      style={{ '--card-accent': domain.accent }}
    >
      <div className="domain-card-inner" ref={tiltRef}>
        <div className="domain-sheen" aria-hidden="true" />

        <div className="domain-icon-wrapper">
          <Icon className="domain-icon" strokeWidth={1.6} />
        </div>

        <div className="domain-body">
          <h3 className="domain-name">{domain.name}</h3>
          <p className="domain-description">{domain.description}</p>
        </div>

        <div className="domain-tags">
          {domain.tags.map((tag) => (
            <span className="domain-tag" key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </Reveal>
  );
};

const DomainsSection = () => (
  <section id="domain" className="domains-section section-shell">
    <div className="section-inner">
      <Reveal animation="up">
        <span className="section-eyebrow">
          <Sparkles size={13} strokeWidth={2} />
          What I do
        </span>
      </Reveal>

      <Reveal animation="up" delay={80}>
        <h2 className="domains-title">
          Domains I <span className="title-highlight">work with</span>
        </h2>
      </Reveal>

      <div className="domains-bento">
        {domains.map((domain, index) => (
          <DomainCard key={domain.name} domain={domain} index={index} />
        ))}
      </div>
    </div>
  </section>
);

export default DomainsSection;
