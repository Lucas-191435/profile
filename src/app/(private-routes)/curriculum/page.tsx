
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Mail,
  Linkedin,
  Github,
  MapPin,
  Briefcase,
  GraduationCap,
  User,
  Code2,
} from "lucide-react";
import { useRouter } from "next/navigation";

const skills = [
  "React", "Node.js", "TypeScript", "Next.js", "NestJS", "Docker", "DevOps",
  "Prisma", "Express", "JavaScript", "Git", "MySQL", "Angular", "Firebase",
  "APIs REST", "GraphQL", "Flutter", "React Native", "Expo",
];

interface Experience {
  company: string;
  role: string;
  period: string;
  highlights: string[];
}

const experiences: Experience[] = [
  {
    company: "MIND CONSULTING",
    role: "Desenvolvedor Full Stack",
    period: "Maio de 2022 – Atual",
    highlights: [
      "Participação de reuniões de planejamento a partir dos requisitos levantados pelo cliente, com o objetivo de definir fluxo, tecnologia e estratégias pro software.",
      "Buscar melhorias de fluxo do projeto, desde a refatoração de código existente até a aplicação de novas regras de negócio.",
      "Remodelagem do banco de dados existente por novos requisitos e transferência de dados entre tabelas usando scripts.",
      "Implementação e correção em fluxos com gateway de pagamento Stripe e Pagar.me.",
      "Adequação da interface do usuário buscando melhorias na UI e UX.",
      "Utilização de Gitflow em trabalho colaborativo com outros devs.",
      "Utilização da metodologia SCRUM no gerenciamento do projeto.",
    ],
  },
  {
    company: "CONCESSIONÁRIA - GRUPO ABRÃO REZE",
    role: "Estagiário - Suporte Técnico / Help Desk",
    period: "Dezembro de 2020 – Dezembro de 2021",
    highlights: [
      "Preparação, configuração e montagem de máquinas para usuário.",
      "Liberação de acessos e suporte de sistemas.",
      "Acompanhamento em atividades internas e externas nas lojas.",
      "Criação e acompanhamento de processos para os usuários dos sistemas internos.",
      "Abertura e fechamento de chamados internos dos usuários.",
    ],
  },
];

const Curriculo = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="h-14 border-b border-border flex items-center px-4 lg:px-8">
        <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="gap-2 font-body">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Pokédex
        </Button>
      </header>

      <main className="max-w-4xl mx-auto p-4 lg:p-8 space-y-8">
        {/* Hero */}
        <section className="space-y-4">
          <div className="h-2 w-24 bg-primary rounded-full" />
          <h1 className="font-display text-4xl lg:text-5xl font-bold tracking-wide text-glow">
            LUCAS FERNANDO SANTOS
          </h1>
          <p className="font-body text-lg lg:text-xl text-muted-foreground">
            Desenvolvedor Full Stack · +5 anos de experiência
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="mailto:lucasfernandosantos2001@gmail.com"
              className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" /> lucasfernandosantos2001@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/lucas-fer-san/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
            <a
              href="https://github.com/Lucas-191435"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
            <span className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground">
              <MapPin className="w-4 h-4" /> Sorocaba - SP
            </span>
          </div>
        </section>

        {/* Skills */}
        <Card className="border-primary/20 bg-card/60">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" /> Habilidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="font-body text-xs border-primary/30 text-foreground hover:bg-primary/10 transition-colors cursor-default"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="border-border/50 bg-card/40">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Sobre Mim
            </CardTitle>
          </CardHeader>
          <CardContent className="font-body text-sm text-muted-foreground leading-relaxed space-y-3">
            <p>
              Desenvolvedor Full Stack com foco em aplicações web escaláveis, atuando no desenvolvimento de soluções
              completas do front-end ao back-end. Experiência com React, Next.js, Angular, Node.js (Express, NestJS),
              Prisma e GraphQL, trabalhando com arquitetura de sistemas, integração de APIs e boas práticas de código.
            </p>
            <p>
              Também possuo experiência em desenvolvimento mobile com Flutter e React Native (Expo). Já utilizei
              Firebase em projetos, desenvolvendo Cloud Functions, gerenciando arquivos com Firebase Storage e
              realizando integração e envio de dados para o BigQuery.
            </p>
            <p>
              Profissional comprometido com evolução contínua, atuando de forma colaborativa para desenvolver soluções
              eficientes, escaláveis e bem estruturadas, sempre alinhadas às boas práticas de engenharia de software.
            </p>
          </CardContent>
        </Card>

        {/* Experience */}
        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold tracking-wide flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" /> Experiência Profissional
          </h2>

          {experiences.map((exp, idx) => (
            <Card key={idx} className="border-border/50 bg-card/40">
              <CardContent className="p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h3 className="font-display text-base font-bold tracking-wide">{exp.company}</h3>
                  <Badge variant="outline" className="w-fit text-[10px] font-body">
                    {exp.period}
                  </Badge>
                </div>
                <p className="font-body text-sm text-primary font-semibold">{exp.role}</p>
                <Separator className="bg-border/30" />
                <ul className="space-y-1.5">
                  {exp.highlights.map((h, hIdx) => (
                    <li key={hIdx} className="font-body text-sm text-muted-foreground flex gap-2">
                      <span className="text-primary mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Education */}
        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold tracking-wide flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" /> Formação
          </h2>

          <Card className="border-border/50 bg-card/40">
            <CardContent className="p-5 space-y-1">
              <h3 className="font-display text-base font-bold tracking-wide">
                Tecnólogo em ADS - Análise e Desenvolvimento de Sistemas
              </h3>
              <p className="font-body text-sm text-muted-foreground">
                Centro Universitário Facens · 2019 – 2021
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="pt-8 pb-4 text-center">
          <Button variant="outline" onClick={() => router.push("/")} className="gap-2 font-body">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Pokédex
          </Button>
        </footer>
      </main>
    </div>
  );
};

export default Curriculo;
