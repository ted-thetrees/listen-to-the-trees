import Head from 'next/head';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import AudioPlayer from '@/components/AudioPlayer';
import { getTableRows, getDesignValues } from '@/lib/baserow';

interface FAQItem {
  id: number;
  name: string;
  question: string;
  text_block: string;
  media_url_main: string;
  caption_main: string;
  display_order: string;
  episode_1_title: string | null;
  episode_1_body: string | null;
  episode_1_image: string;
  episode_1_mp3: string;
  episode_2_title: string | null;
  episode_2_body: string | null;
  episode_2_image: string;
  episode_2_mp3: string;
  episode_3_title: string | null;
  episode_3_body: string | null;
  episode_3_image: string;
  episode_3_mp3: string;
}

interface HomeProps {
  faqs: FAQItem[];
  cssVariables: Record<string, string>;
}

// Parse markdown links in text
function parseMarkdownLinks(text: string) {
  const parts: (string | JSX.Element)[] = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Add the link
    parts.push(
      <a key={key++} href={match[2]} target="_blank" rel="noopener noreferrer">
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

export default function Home({ faqs = [], cssVariables = {} }: HomeProps) {
  if (!faqs || faqs.length === 0) {
    return <div>Loading...</div>;
  }

  // Generate CSS custom properties string
  const cssVarsString = Object.entries(cssVariables)
    .map(([key, value]) => `--${key}: ${value};`)
    .join('\n    ');

  return (
    <>
      <Head>
        <title>Listen to the Trees</title>
        <meta name="description" content="A podcast featuring trees" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      {/* Inject CSS variables from Baserow */}
      <style jsx global>{`
        :root {
          ${cssVarsString}
        }
      `}</style>
      
      {/* Background layers */}
      <div className="bg-base" />
      <div className="bg-grain" />
      
      {/* Main content */}
      <div className="main-container">
        {/* Header */}
        <header className="header-nav">
          <h1 className="text-nav">Listen to the Trees</h1>
          <div className="nav-center">
            <span className="text-nav">FAQ</span>
            <span className="text-nav">?</span>
            <span className="text-nav">?</span>
          </div>
          <span className="text-nav">Contact</span>
        </header>
        
        {/* Section Title */}
        <h1 className="text-section-title">Frequently Asked Questions</h1>

        {/* FAQ Sections */}
        <div className="faq-section">
          {faqs.map((faq, index) => (
            <div key={faq.id} className={`faq-item ${index < faqs.length - 1 ? 'border-bottom-light' : ''}`}>
              <div className="faq-content">
                {faq.question && <h3 className="text-question">{faq.question}</h3>}
                <div className="faq-paragraphs">
                  {faq.text_block.split('\n\n').map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-body">
                      {parseMarkdownLinks(paragraph)}
                    </p>
                  ))}
                </div>
              </div>
              <div className="faq-media">
                {/* Main media (image) */}
                {faq.media_url_main && (
                  <>
                    <Image
                      src={faq.media_url_main}
                      alt={faq.name}
                      width={1600}
                      height={1000}
                      className="faq-image"
                    />
                    {faq.caption_main && (
                      <p className="image-caption">
                        {parseMarkdownLinks(faq.caption_main)}
                      </p>
                    )}
                  </>
                )}
                
                {/* Episode grid (for FAQ 2) */}
                {faq.episode_1_image && (
                  <div className="tree-images-grid">
                    <div className="tree-image-container">
                      <Image
                        src={faq.episode_1_image}
                        alt={faq.episode_1_title || 'Episode 1'}
                        width={400}
                        height={400}
                        className="tree-image"
                      />
                      {faq.episode_1_body && (
                        <div className="episode-body">
                          <p className="text-body">{faq.episode_1_body}</p>
                        </div>
                      )}
                      {faq.episode_1_mp3 && (
                        <div className="audio-player-overlay">
                          <AudioPlayer audioUrl={faq.episode_1_mp3} />
                        </div>
                      )}
                    </div>
                    {faq.episode_2_image && (
                      <div className="tree-image-container">
                        <Image
                          src={faq.episode_2_image}
                          alt={faq.episode_2_title || 'Episode 2'}
                          width={400}
                          height={400}
                          className="tree-image"
                        />
                        {faq.episode_2_body && (
                          <div className="episode-body">
                            <p className="text-body">{faq.episode_2_body}</p>
                          </div>
                        )}
                        {faq.episode_2_mp3 && (
                          <div className="audio-player-overlay">
                            <AudioPlayer audioUrl={faq.episode_2_mp3} />
                          </div>
                        )}
                      </div>
                    )}
                    {faq.episode_3_image && (
                      <div className="tree-image-container">
                        <Image
                          src={faq.episode_3_image}
                          alt={faq.episode_3_title || 'Episode 3'}
                          width={400}
                          height={400}
                          className="tree-image"
                        />
                        {faq.episode_3_body && (
                          <div className="episode-body">
                            <p className="text-body">{faq.episode_3_body}</p>
                          </div>
                        )}
                        {faq.episode_3_mp3 && (
                          <div className="audio-player-overlay">
                            <AudioPlayer audioUrl={faq.episode_3_mp3} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const data = await getTableRows(737803);
  const designValues = await getDesignValues();
  
  // Sort by display_order and filter for published items
  const faqs = data.results
    .filter((item: FAQItem) => item.display_order)
    .sort((a: FAQItem, b: FAQItem) => parseInt(a.display_order) - parseInt(b.display_order));

  // Convert design values to CSS custom properties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cssVariables = designValues.reduce((acc: Record<string, string>, item: any) => {
    const varName = item.Name.toLowerCase().replace(/\s+/g, '-');
    acc[varName] = item.Value;
    return acc;
  }, {});

  return {
    props: {
      faqs,
      cssVariables,
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
};
