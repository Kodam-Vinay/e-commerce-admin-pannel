const Spinner = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 14 14"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    className="animate-spin"
  >
    <g fill="none" fillRule="evenodd">
      <circle
        cx={7}
        cy={7}
        r={6}
        stroke="#000000"
        strokeOpacity={0.1}
        strokeWidth={2}
      />
      <path
        fill="#000000"
        fillOpacity={0.1}
        fillRule="nonzero"
        d="M7 0a7 7 0 0 1 7 7h-2a5 5 0 0 0-5-5V0z"
      />
    </g>
  </svg>
);
export default Spinner;
