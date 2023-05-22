import { Component, createSignal, mergeProps } from 'solid-js';

const AdminIcon: Component<{ icon?: string; user?: string; size?: string }> = (
  props
) => {
  const merged = mergeProps(
    { icon: '#837589', user: 'Anonimo', size: '1rem' },
    props
  );
  const [displayText, setDisplayText] = createSignal<string>('');
  const [background, setBackground] = createSignal<string>('');

  if (
    merged.icon.startsWith('#') ||
    merged.icon.startsWith('hsl(') ||
    merged.icon.startsWith('rgb(')
  ) {
    setDisplayText(merged.user.charAt(0));
    setBackground(`${merged.icon}`);
  } else {
    setBackground(`url(${merged.icon})`);
  }

  return (
    <div
      class={`rounded-3xl p-4 aspect-square text-white flex`}
      style={{
        background: `${background()}`,
        width: `${merged.size}`,
        height: 'auto',
        "font-size": `${merged.size}`
      }}
    >
      {displayText() && (
        <span
          class="mx-auto my-auto hover:cursor-default text-center"
          style={{
            "font-size": "0.7em"
          }}
        >
          {displayText()}
        </span>
      )}
    </div>
  );
};

export default AdminIcon;
