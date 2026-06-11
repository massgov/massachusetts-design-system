import { DocsContext, Source, useOf } from '@storybook/addon-docs/blocks';
import { useContext, useEffect, useId, useMemo, useState } from 'react';
import { addons } from 'storybook/preview-api';
import './index.css';

const STORY_ARGS_UPDATED = 'storyArgsUpdated';

export function CodeTabs({ tabs }) {
  const fallbackTab = tabs[0];
  const [activeLabel, setActiveLabel] = useState(fallbackTab?.label);
  const activeTab = tabs.find((tab) => tab.label === activeLabel) || fallbackTab;
  const tabGroupId = useId();

  if (!activeTab) {
    return null;
  }

  return (
    <div className="mds-docs-code-tabs">
      <div className="mds-docs-code-tabs__list" role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.label === activeTab.label;
          const tabId = `${tabGroupId}-${tab.label}-tab`;
          const panelId = `${tabGroupId}-${tab.label}-panel`;

          return (
            <button
              aria-controls={panelId}
              aria-selected={isActive}
              className="mds-docs-code-tabs__tab"
              id={tabId}
              key={tab.label}
              onClick={() => setActiveLabel(tab.label)}
              role="tab"
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div
        aria-labelledby={`${tabGroupId}-${activeTab.label}-tab`}
        className="mds-docs-code-tabs__panel"
        id={`${tabGroupId}-${activeTab.label}-panel`}
        role="tabpanel"
      >
        <Source
          code={activeTab.code}
          key={`${activeTab.label}:${activeTab.code}`}
          language={activeTab.language}
        />
      </div>
    </div>
  );
}

function useStoryArgs(of) {
  const { story } = useOf(of, ['story']);
  const context = useContext(DocsContext);
  const getCurrentArgs = () => context.getStoryContext(story).args;
  const [args, setArgs] = useState(getCurrentArgs);

  useEffect(() => {
    setArgs(getCurrentArgs());

    const channel = addons.getChannel();
    const handleArgsUpdated = ({ args: nextArgs, storyId }) => {
      if (storyId === story.id) {
        setArgs(nextArgs);
      }
    };

    channel.on(STORY_ARGS_UPDATED, handleArgsUpdated);

    return () => {
      channel.off(STORY_ARGS_UPDATED, handleArgsUpdated);
    };
  }, [context, story]);

  return args;
}

export function StoryCodeTabs({ getTabs, of }) {
  const args = useStoryArgs(of);
  const tabs = useMemo(() => getTabs(args), [args, getTabs]);

  return <CodeTabs tabs={tabs} />;
}
