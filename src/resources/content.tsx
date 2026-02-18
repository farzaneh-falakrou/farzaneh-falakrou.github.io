import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Farzaneh",
  lastName: "Falakrou",
  name: "Farzaneh Falakrou",
  role: "Product Designer",
  avatar: "/images/avatar.png",
  email: "farzaneh.falakrou@gmail.com",
  location: "Europe/Berlin",
  languages: ["English", "Persian"],
};

const newsletter: Newsletter = {
  display: false,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>Updates on design, projects, and creative explorations</>,
};

const social: Social = [
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/farzaneh-falakrou",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/farzaneh-falakrou/",
    essential: true,
  },
  {
    name: "Behance",
    icon: "behance",
    link: "https://www.behance.net/farzanehfalakrou",
    essential: true,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Hi, I'm Farzaneh!</>,
  featured: {
    display: false,
    title: <>Featured work</>,
    href: "/work/top-notch-beauty",
  },
  subline: (
    <>
      I'm a Product Designer with +6 years of experience in design and project
      management, skilled in user-centered solutions and creative thinking. I've led
      +20 projects, demonstrating strong leadership in both independent projects
      and cross-functional teams.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Hi, I'm Farzaneh, a Product Designer blending insights from architectural
        design and project management. My journey began in architecture, where I
        developed my skills in creating user-friendly spaces and leading diverse teams.
        As I transitioned into product design, I carried this leadership experience
        with me, focusing on crafting user-centric solutions. My goal is to boost user
        engagement and improve product performance to help businesses succeed.
      </>
    ),
  },
  work: {
    display: true,
    title: "Work Experience",
    experiences: [
      {
        company: "Product Design",
        timeframe: "2018 - Present",
        role: "Product Designer",
        achievements: [
          <>
            Led +20 projects demonstrating strong leadership in both independent
            projects and cross-functional teams.
          </>,
          <>
            Skilled in user-centered solutions and creative thinking with +6 years
            of experience in design and project management.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true,
    title: "Studies",
    institutions: [
      {
        name: "Polytechnic University of Milan",
        description: <>Service Design — blending urban design, technology, and citizen engagement.</>,
      },
      {
        name: "Careerfoundry",
        description: <>UX/UI Specialization — led digital product design and development.</>,
      },
    ],
  },
  technical: {
    display: true,
    title: "Technical skills",
    skills: [
      {
        title: "Product Design",
        description: (
          <>User research, wireframing, prototyping, and user-centered design.</>
        ),
        tags: [
          {
            name: "Figma",
            icon: "figma",
          },
        ],
        images: [],
      },
      {
        title: "Frontend Development",
        description: (
          <>Building responsive interfaces with modern web technologies.</>
        ),
        tags: [
          {
            name: "JavaScript",
            icon: "javascript",
          },
          {
            name: "Next.js",
            icon: "nextjs",
          },
        ],
        images: [],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  images: [],
};

export { person, social, newsletter, home, about, blog, work, gallery };
