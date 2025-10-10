export default function ConstellationSVG(props: { className: string }) {
  return (
    <svg viewBox="0 0 1249 1371" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="3"
            floodColor="#ffffff"
            floodOpacity="0.7"
          />
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="8"
            floodColor="#a78bfa"
            floodOpacity="0.35"
          />
        </filter>
      </defs>

      <path
        d="M3.5 148.5L334.5 3.5L727.5 122.5L882.5 753L1244 1368.5H996L815 1001.5L65.5 660L3.5 148.5Z"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1 30"
        filter="url(#glow)"
        fill="none"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="-120"
          dur="20s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.2;0.5;0.2"
          keyTimes="0;0.5;1"
          dur="2s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines=".25,.1,.25,1;.25,.1,.25,1"
        />
      </path>
    </svg>
  );
}
