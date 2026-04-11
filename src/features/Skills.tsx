import { profileData } from '@/data/profileData';
import '@/assets/styles/features/Skills.css';
import type { SvgIconProps } from '@thesvg/react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { IconType } from 'react-icons';
import {
  FaBroadcastTower,
  FaCheckCircle,
  FaClock,
  FaCodeBranch,
  FaCreditCard,
  FaExchangeAlt,
  FaFileAlt,
  FaKey,
  FaNetworkWired,
  FaProjectDiagram,
  FaShapes,
  FaSitemap,
  FaSyncAlt,
  FaTachometerAlt,
  FaUserShield
} from 'react-icons/fa';
import {
  SiAngular,
  SiDocker,
  SiDotnet,
  SiGithub,
  SiJira,
  SiPostman,
  SiRedis
} from 'react-icons/si';

import AntDesign from '@thesvg/react/ant-design';
import Angular from '@thesvg/react/angular';
import Bootstrap from '@thesvg/react/bootstrap';
import Css from '@thesvg/react/css';
import Csharp from '@thesvg/react/csharp';
import Docker from '@thesvg/react/docker';
import Dotnet from '@thesvg/react/dotnet';
import Github from '@thesvg/react/github';
import GithubActions from '@thesvg/react/github-actions';
import Git from '@thesvg/react/git';
import Graylog from '@thesvg/react/graylog';
import Html5 from '@thesvg/react/html5';
import Jest from '@thesvg/react/jest';
import Jira from '@thesvg/react/jira';
import Jquery from '@thesvg/react/jquery';
import Jwt from '@thesvg/react/jwt';
import Javascript from '@thesvg/react/javascript';
import Kafka from '@thesvg/react/kafka';
import Kubernetes from '@thesvg/react/kubernetes';
import Lighthouse from '@thesvg/react/lighthouse';
import Mermaid from '@thesvg/react/mermaid';
import Microsoft from '@thesvg/react/microsoft';
import MicrosoftAzure from '@thesvg/react/microsoft-azure';
import MicrosoftSqlServer from '@thesvg/react/microsoft-sql-server';
import Mui from '@thesvg/react/mui';
import Nuget from '@thesvg/react/nuget';
import NextJsIcon from '@/components/icons/NextJsIcon';
import Postman from '@thesvg/react/postman';
import Rabbitmq from '@thesvg/react/rabbitmq';
import BrandReact from '@thesvg/react/react';
import Redis from '@thesvg/react/redis';
import Redux from '@thesvg/react/redux';
import Sass from '@thesvg/react/sass';
import Stripe from '@thesvg/react/stripe';
import Swagger from '@thesvg/react/swagger';
import TailwindCss from '@thesvg/react/tailwind-css';
import Temporal from '@thesvg/react/temporal';
import Typescript from '@thesvg/react/typescript';
import VisualStudio from '@thesvg/react/visual-studio';
import VisualStudioCode from '@thesvg/react/visual-studio-code';
import Vite from '@thesvg/react/vite';

type SkillIconComponent = ForwardRefExoticComponent<SvgIconProps & RefAttributes<SVGSVGElement>>;

/** react-icons for Technical Knowledge, Libraries & Familiar With — reliable on dark UI */
const TECH_LIB_FAMILIAR_ICONS: Record<string, IconType> = {
  'Agile & Scrum Methodologies': SiJira,
  'SignalR for Real-Time Communication': FaBroadcastTower,
  'Version Controls (GitHub, Azure)': SiGithub,
  'Repository Pattern with Unit of Work': FaCodeBranch,
  'CQRS and Mediator Patterns': FaExchangeAlt,
  'SOLID Principles': FaShapes,
  'Clean Architecture': FaSitemap,
  'Design Patterns': FaProjectDiagram,
  'Performance Optimization': FaTachometerAlt,
  MediatR: SiDotnet,
  Serilog: FaFileAlt,
  FluentValidation: FaCheckCircle,
  AutoMapper: FaSyncAlt,
  'JWT Authentication': FaKey,
  'Identity Framework': FaUserShield,
  Redis: SiRedis,
  Hangfire: FaClock,
  Angular: SiAngular,
  Docker: SiDocker,
  'Microservices Architecture': FaNetworkWired,
  'Postman & API Testing': SiPostman,
  'Payment Gateway Integration': FaCreditCard,
  // Aliases if strings change in profileData
  'Angular Framework': SiAngular,
  'Docker Basics for Development & Deployment': SiDocker,
  'Version Controls (GitHub, Azure DevOps)': SiGithub
};

/** Only Next.js needs a custom SVG (theSVG package ids break in-browser) */
const SKILL_ICON_BY_LABEL: Record<string, SkillIconComponent> = {
  'Next.js': NextJsIcon
};

const skillIconSvgClass = (skill: string): string => {
  const base = 'skill-icon-thesvg';
  if (skill === 'Next.js') return `${base} skill-icon-next`;
  return base;
};

/**
 * Order matters: avoid false positives (e.g. "bootstrap" contains "ts",
 * "react.js" / "next.js" contain "js") and match specific phrases before broad ones.
 */
const getSkillIcon = (skill: string): SkillIconComponent => {
  const exact = SKILL_ICON_BY_LABEL[skill];
  if (exact) return exact;

  const skillLower = skill.toLowerCase();

  // --- Front end & brands (before generic "js" / "ts") ---
  if (skillLower.includes('next.js') || skillLower.includes('nextjs')) return NextJsIcon;
  if (skillLower.includes('react')) return BrandReact;
  if (skillLower.includes('bootstrap')) return Bootstrap;
  if (skillLower.includes('tailwind')) return TailwindCss;
  if (skillLower.includes('vite')) return Vite;
  if (skillLower.includes('redux') || skillLower.includes('state management')) return Redux;
  if (skillLower.includes('jquery')) return Jquery;
  if (skillLower.includes('material ui')) return Mui;
  if (skillLower.includes('ant design')) return AntDesign;
  if (skillLower.includes('angular')) return Angular;

  if (skillLower.includes('typescript')) return Typescript;
  if (skillLower.includes('javascript')) return Javascript;

  if (skillLower.includes('html')) return Html5;
  if (skillLower.includes('css') && !skillLower.includes('scss') && !skillLower.includes('sass') && !skillLower.includes('tailwind')) return Css;
  if (skillLower.includes('sass') || skillLower.includes('scss')) return Sass;

  // --- .NET / back end ---
  if (skillLower.includes('c#') || skillLower.includes('csharp')) return Csharp;
  if (skillLower.includes('.net') || skillLower.includes('asp.net')) return Dotnet;
  if (skillLower.includes('entity framework') || skillLower.includes('ef core')) return Dotnet;
  if (skillLower.includes('linq')) return Dotnet;

  if (skillLower.includes('microsoft sql') || skillLower.includes('sql server')) return MicrosoftSqlServer;
  if (skillLower.includes('dapper')) return MicrosoftSqlServer;
  if ((skillLower.includes('sql') || skillLower.includes('database')) && !skillLower.includes('signal')) return MicrosoftSqlServer;

  if (skillLower.includes('signalr') || skillLower.includes('websocket') || skillLower.includes('real-time')) return VisualStudio;

  if (skillLower.includes('postman')) return Postman;
  if (skillLower.includes('swagger') || skillLower.includes('openapi')) return Swagger;
  if (skillLower.includes('restful')) return Swagger;
  if (skillLower.includes('minimal api')) return Dotnet;
  if (skillLower.includes('api')) return Swagger;

  if (skillLower.includes('payment') || skillLower.includes('gateway')) return Stripe;

  if (skillLower.includes('github')) return Github;
  if (skillLower.includes('azure')) return MicrosoftAzure;
  if (skillLower.includes('git') || skillLower.includes('version control')) return Git;
  if (skillLower.includes('docker')) return Docker;
  if (skillLower.includes('ci/cd') || skillLower.includes('pipeline')) return GithubActions;

  // --- Architecture & patterns (specific before broad) ---
  if (skillLower.includes('clean architecture')) return Dotnet;
  if (skillLower.includes('design patterns') || skillLower.includes('design pattern')) return Mermaid;
  if (skillLower.includes('repository')) return Git;
  if (skillLower.includes('cqrs') || skillLower.includes('mediator patterns')) return Kafka;
  if (skillLower.includes('microservices')) return Kubernetes;
  if (skillLower.includes('architecture')) return Mermaid;

  if (skillLower.includes('solid')) return Csharp;

  if (skillLower.includes('serilog')) return Graylog;
  if (skillLower.includes('fluentvalidation') || skillLower.includes('fluent validation')) return Nuget;
  if (skillLower.includes('mediatr')) return Dotnet;
  if (skillLower.includes('automapper') || skillLower.includes('auto mapper')) return Nuget;
  if (skillLower.includes('jwt') || skillLower.includes('authentication')) return Jwt;
  if (skillLower.includes('identity framework')) return Microsoft;
  if (skillLower.includes('redis')) return Redis;
  if (skillLower.includes('rabbitmq') || skillLower.includes('rabbit mq')) return Rabbitmq;
  if (skillLower.includes('hangfire')) return Temporal;
  if (skillLower.includes('xunit') || skillLower.includes('moq') || skillLower.includes('unit test')) return Jest;

  if (skillLower.includes('agile') || skillLower.includes('scrum')) return Jira;
  if (skillLower.includes('testing') || skillLower.includes('integration test')) return Jest;
  if (skillLower.includes('performance') || skillLower.includes('optimization')) return Lighthouse;

  return VisualStudioCode;
};

const Skills = () => {
  const skillCategories = [
    {
      title: 'Back End',
      icon: 'fas fa-server',
      skills: profileData.technologies.backEnd
    },
    {
      title: 'Front End',
      icon: 'fas fa-desktop',
      skills: profileData.technologies.frontEnd
    },
    {
      title: 'Technical Knowledge',
      icon: 'fas fa-cogs',
      skills: profileData.technologies.technicalKnowledge
    },
    {
      title: 'Libraries & Technologies',
      icon: 'fas fa-book',
      skills: profileData.technologies.libraries
    },
    {
      title: 'Familiar With',
      icon: 'fas fa-star',
      skills: profileData.technologies.familiarWith
    }
  ];

  return (
    <section className="skills" id="skills">
      <div className="skills-container">
        <h2 className="section-title">
          <i className="fas fa-lightbulb"></i>
          <span>
            Some of My <strong>Skills</strong>
          </span>
        </h2>

        <div className="skills-categories">
          {skillCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="skill-category-section">
              <h3 className="category-title">
                <i className={category.icon}></i>
                {category.title}
              </h3>
              <div className="skills-grid">
                {category.skills.map((skill, skillIndex) => {
                  const ReactIcon = TECH_LIB_FAMILIAR_ICONS[skill];
                  if (ReactIcon) {
                    return (
                      <div key={skillIndex} className="skill-card">
                        <div className="skill-icon">
                          <ReactIcon className="skill-icon-ri" aria-hidden />
                        </div>
                        <span className="skill-name">{skill}</span>
                      </div>
                    );
                  }
                  const IconComponent = getSkillIcon(skill);
                  return (
                    <div key={skillIndex} className="skill-card">
                      <div className="skill-icon">
                        <IconComponent className={skillIconSvgClass(skill)} aria-hidden />
                      </div>
                      <span className="skill-name">{skill}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
