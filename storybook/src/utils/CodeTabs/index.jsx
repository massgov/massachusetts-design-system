import { DocsContext, Source, useOf } from '@storybook/addon-docs/blocks';
import { STORY_ARGS_UPDATED } from 'storybook/internal/core-events';
import { useContext, useEffect, useId, useMemo, useState } from 'react';
import './CodeTabs.css';

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
        <Source code={activeTab.code} language={activeTab.language} />
      </div>
    </div>
  );
}

function useStoryArgs(of) {
  const { story } = useOf(of, ['story']);
  const context = useContext(DocsContext);
  const [args, setArgs] = useState(() => context.getStoryContext(story).args);

  useEffect(() => {
    setArgs(context.getStoryContext(story).args);
  }, [context, story]);

  useEffect(() => {
    const handleArgsUpdated = ({ storyId, args: updatedArgs }) => {
      if (storyId === story.id) {
        setArgs(updatedArgs);
      }
    };

    context.channel.on(STORY_ARGS_UPDATED, handleArgsUpdated);

    return () => {
      context.channel.off(STORY_ARGS_UPDATED, handleArgsUpdated);
    };
  }, [context.channel, story.id]);

  return args;
}

export function StoryCodeTabs({ getTabs, of }) {
  const args = useStoryArgs(of);
  const tabs = useMemo(() => getTabs(args), [args, getTabs]);

  return <CodeTabs tabs={tabs} />;
}
