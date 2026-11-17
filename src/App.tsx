import { useEffect, useMemo } from 'react';
import { Footer } from './components/navigation/Footer';
import { Navbar } from './components/navigation/Navbar';
import { HeroSection } from './components/home/HeroSection';
import { SubjectSelectionSection } from './components/home/SubjectSelectionSection';
import { CuriosityQuestionsSection } from './components/home/CuriosityQuestionsSection';
import { LearningPhilosophySection } from './components/home/LearningPhilosophySection';
import { ScienceEverywhereSection } from './components/home/ScienceEverywhereSection';
import { PlatformCapabilitiesSection } from './components/home/PlatformCapabilitiesSection';
import { LearningDiscoverySection } from './components/home/LearningDiscoverySection';
import { FinalCtaSection } from './components/home/FinalCtaSection';
import { SubjectDetailView } from './components/views/SubjectDetailView';
import { PhysicsLandingView } from './components/views/PhysicsLandingView';
import { PhysicsTopicView } from './components/views/PhysicsTopicView';
import { SimplePendulumWorkspace } from './components/simulations/pendulum/SimplePendulumWorkspace';
import { NewtonsLawsWorkspace } from './components/simulations/newtons-laws/NewtonsLawsWorkspace';
import { MyLearningView } from './components/views/MyLearningView';
import { AboutView } from './components/views/AboutView';
import { NotFoundView } from './components/views/NotFoundView';
import { ScrollProgressBar } from './components/ui/ScrollProgressBar';
import { getPhysicsTopicBySlug } from './data/physicsTopics';
import { getSubjectBySlug } from './data/subjects';
import { usePageSeo } from './hooks/usePageSeo';
import {
  createExperimentMetadata,
  createTopicMetadata,
  getAboutMetadata,
  getHomeMetadata,
  getMyLearningMetadata,
  getNotFoundMetadata,
  getSubjectMetadata,
} from './seo/metadata';
import {
  buildHomeJsonLd,
  buildSubjectJsonLd,
  buildTopicJsonLd,
} from './seo/structuredData';
import { useLearningStore } from './stores/useLearningStore';

export default function App() {
  const view = useLearningStore((s) => s.view);
  const syncFromLocation = useLearningStore((s) => s.syncFromLocation);

  useEffect(() => {
    const handlePopState = () => syncFromLocation();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [syncFromLocation]);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://labverse.edu';

  const { seoMetadata, jsonLdSchemas } = useMemo(() => {
    if (view.type === 'experiment') {
      const subject = getSubjectBySlug(view.subjectSlug);
      if (subject) {
        if (view.experimentSlug === 'newtons-laws') {
          return {
            seoMetadata: createExperimentMetadata(
              subject,
              "Newton's Laws of Motion",
              "Interactive physics laboratory exploring Newton's First, Second, and Third Laws with real-time F = ma, static/kinetic friction, action-reaction pairs, live graphs, and CSV analysis.",
              {
                topicSlug: view.topicSlug,
                experimentSlug: 'newtons-laws',
                isComplete: true,
              }
            ),
            jsonLdSchemas: [],
          };
        }

        return {
          seoMetadata: createExperimentMetadata(
            subject,
            'Simple Pendulum',
            'Interactive RK4 physics simulation of simple pendulum motion with live angular displacement, velocity, energy graphs, and CSV data analysis.',
            {
              topicSlug: view.topicSlug,
              experimentSlug: 'simple-pendulum',
              isComplete: true,
            }
          ),
          jsonLdSchemas: [],
        };
      }
      return {
        seoMetadata: getNotFoundMetadata(`/subjects/${view.subjectSlug}/${view.topicSlug}/${view.experimentSlug}`),
        jsonLdSchemas: [],
      };
    }

    if (view.type === 'subject-topic') {
      const subject = getSubjectBySlug(view.subjectSlug);
      const topic = getPhysicsTopicBySlug(view.topicSlug);
      if (subject && topic) {
        return {
          seoMetadata: createTopicMetadata(subject, topic.title, topic.description),
          jsonLdSchemas: buildTopicJsonLd(
            origin,
            subject,
            topic.title,
            topic.route,
            topic.description,
            topic.keyConcepts
          ),
        };
      }
      return {
        seoMetadata: getNotFoundMetadata(`/subjects/${view.subjectSlug}/${view.topicSlug}`),
        jsonLdSchemas: [],
      };
    }

    if (view.type === 'subject') {
      const subject = getSubjectBySlug(view.slug);
      if (subject) {
        return {
          seoMetadata: getSubjectMetadata(subject),
          jsonLdSchemas: buildSubjectJsonLd(origin, subject),
        };
      }
      return {
        seoMetadata: getNotFoundMetadata(`/subjects/${view.slug}`),
        jsonLdSchemas: [],
      };
    }

    if (view.type === 'about') {
      return { seoMetadata: getAboutMetadata(), jsonLdSchemas: [] };
    }

    if (view.type === 'my-learning') {
      return { seoMetadata: getMyLearningMetadata(), jsonLdSchemas: [] };
    }

    if (view.type === 'not-found') {
      return { seoMetadata: getNotFoundMetadata(view.path), jsonLdSchemas: [] };
    }

    return {
      seoMetadata: getHomeMetadata(),
      jsonLdSchemas: buildHomeJsonLd(origin),
    };
  }, [view, origin]);

  usePageSeo(seoMetadata, jsonLdSchemas);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F4EF] text-[#171C24]">
      <ScrollProgressBar />
      <Navbar />

      <main className="flex-1">
        {view.type === 'home' && (
          <>
            <HeroSection />
            <SubjectSelectionSection />
            <CuriosityQuestionsSection />
            <LearningPhilosophySection />
            <ScienceEverywhereSection />
            <PlatformCapabilitiesSection />
            <LearningDiscoverySection />
            <FinalCtaSection />
          </>
        )}

        {view.type === 'subject' && view.slug === 'physics' && <PhysicsLandingView />}

        {view.type === 'subject' && view.slug !== 'physics' && (
          <SubjectDetailView
            slug={view.slug}
            highlightModuleCode={view.highlightModuleCode}
          />
        )}

        {view.type === 'subject-topic' && (
          <PhysicsTopicView topicSlug={view.topicSlug} />
        )}

        {view.type === 'experiment' && view.experimentSlug === 'simple-pendulum' && (
          <SimplePendulumWorkspace />
        )}
        {view.type === 'experiment' && view.experimentSlug === 'newtons-laws' && (
          <NewtonsLawsWorkspace />
        )}

        {view.type === 'my-learning' && <MyLearningView />}
        {view.type === 'about' && <AboutView />}
        {view.type === 'not-found' && <NotFoundView path={view.path} />}
      </main>

      <Footer />
    </div>
  );
}
